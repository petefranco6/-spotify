import React, { useEffect, useRef } from "react";
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";
import PlayerControls from "./PlayerControls";
import Volume from "./Volume";
import axios from "axios";

export default function Webplayback() {
  const [{ token, currentlyPlaying }, dispatch] = useStateProvider();
  const prevSongIdRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5,
      });

      window.player = player;

      window.player.addListener("ready", async ({ device_id }) => {
        await axios.put(
          "https://api.spotify.com/v1/me/player",
          {
            device_ids: [device_id],
          },
          {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          }
        );
      });

      window.player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      const msToMinutesAndSeconds = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
      };

      const initialPlaybackState = (state) => {
        dispatch({
          type: reducerCases.SET_SHUFFLE_STATE,
          shuffleState: state.shuffle,
        });
        dispatch({
          type: reducerCases.SET_REPEAT_STATE,
          repeatState: state.context.metadata.options.repeat_mode,
        });
        window.player.removeListener(
          "player_state_changed",
          initialPlaybackState
        );
      };

      window.player.addListener("player_state_changed", initialPlaybackState);

      window.player.addListener("player_state_changed", (state) => {
        if (!state) {
          return;
        }

        if (state.track_window.current_track) {
          if (state.track_window.current_track.id !== prevSongIdRef.current) {
            const currentlyPlaying = {
              id: state.track_window.current_track.id,
              name: state.track_window.current_track.name,
              artists: state.track_window.current_track.artists.map(
                (artist) => artist.name
              ),
              image: state.track_window.current_track.album.images[2].url,
              duration: msToMinutesAndSeconds(
                state.context.metadata.current_item.estimated_duration
              ),
            };

            dispatch({ type: reducerCases.SET_PLAYING, currentlyPlaying });

            prevSongIdRef.current = state.track_window.current_track.id;
          }
        }
      });

      window.player.connect();
    };
  }, [token, dispatch]);
  return (
    <>
      {currentlyPlaying && (
        <>
          <PlayerControls />
          <Volume />
        </>
      )}
    </>
  );
}
