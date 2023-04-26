import React, { useEffect } from "react";
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";
import PlayerControls from "./PlayerControls";

export default function Webplayback() {
  const [{ token }, dispatch] = useStateProvider();

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

      window.player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
      });

      window.player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      window.player.addListener("player_state_changed", (state) => {
        if (!state) {
          return;
        }

        const currentlyPlaying = {
            id: state.track_window.current_track.id,
            name: state.track_window.current_track.name,
            artists: state.track_window.current_track.artists.map((artist) => artist.name),
            image: state.track_window.current_track.album.images[2].url,
          };


        dispatch({type: reducerCases.SET_PLAYING, currentlyPlaying})
        dispatch({type: reducerCases.SET_PLAYER_STATE, playerState: state.paused})

        // window.player.getCurrentState().then((state) => {
        //   !state ? setActive(false) : setActive(true);
        // });
      });

      window.player.connect();
    };
  }, [token, dispatch]);
  return (
    <>
      <PlayerControls />
    </>
  );
}
