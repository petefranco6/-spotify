import React from "react";
import styled from "styled-components";
import {
  BsFillPlayCircleFill,
  BsFillPauseCircleFill,
  BsShuffle,
} from "react-icons/bs";
import { CgPlayTrackNext, CgPlayTrackPrev } from "react-icons/cg";
import { FiRepeat } from "react-icons/fi";
import { useStateProvider } from "../utils/StateProvider";
import axios from "axios";
import { reducerCases } from "../utils/Constants";

export default function PlayerControls() {
  const [{ token, playerState }, dispatch] = useStateProvider();
  const changeTrack = async () => {
    const response = await axios.get(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data !== "") {
      const { item } = response.data;
      const currentlyPlaying = {
        id: item.id,
        name: item.name,
        artists: item.artists.map((artist) => artist.name),
        image: item.album.images[2].url,
      };
      dispatch({ type: reducerCases.SET_PLAYING, currentlyPlaying });
    } else {
      dispatch({ type: reducerCases.SET_PLAYING, currentlyPlaying: null });
    }
  };

  const changeState = async () => {
    dispatch({
      type: reducerCases.SET_PLAYER_STATE,
      playerState: !playerState,
    });
  };

  return (
    <Container>
      <div className="shuffle">
        <BsShuffle />
      </div>
      <div className="previous">
        <CgPlayTrackPrev
          onClick={() => {
            changeTrack();
            window.player.nextTrack().then(() => {});
          }}
        />
      </div>
      <div className="state">
        {playerState ? (
          <BsFillPlayCircleFill
            onClick={() => {
              changeState();
              window.player.togglePlay().then(() => {});
            }}
          />
        ) : (
          <BsFillPauseCircleFill
            onClick={() => {
              changeState();
              window.player.togglePlay().then(() => {});
            }}
          />
        )}
      </div>
      <div className="next">
        <CgPlayTrackNext
          onClick={() => {
            changeTrack();
            window.player.nextTrack().then(() => {});
          }}
        />
      </div>
      <div className="repeat">
        <FiRepeat />
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  svg {
    color: #b3b3b3;
    transition: 0.2s ease-in-out;
    &:hover {
      color: white;
    }
  }
  .state {
    svg {
      color: white;
    }
  }
  .previous,
  .next,
  .state {
    font-size: 2rem;
  }
`;
