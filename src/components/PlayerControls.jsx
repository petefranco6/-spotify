import styled from "styled-components";
import {
  BsFillPlayCircleFill,
  BsFillPauseCircleFill,
  BsShuffle,
} from "react-icons/bs";
import { CgPlayTrackNext, CgPlayTrackPrev } from "react-icons/cg";
import { FiRepeat } from "react-icons/fi";
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";
import ProgressBar from "./ProgressBar";
import axios from "axios";

const repeatStates = ["CONTEXT", "TRACK", "OFF"];

export default function PlayerControls() {
  const [{ token, playerState, shuffleState, repeatState }, dispatch] =
    useStateProvider();

  const toggleShuffle = async () => {
    await axios.put(
      `https://api.spotify.com/v1/me/player/shuffle?state=${!shuffleState}`,
      {},
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    );
    dispatch({
      type: reducerCases.SET_SHUFFLE_STATE,
      shuffleState: !shuffleState,
    });
  };

  const changeRepeatState = async () => {
    const i = repeatStates.indexOf(repeatState);
    let nextRepeatState;
    if (i === 2) {
      nextRepeatState = repeatStates[0];
    } else {
      nextRepeatState = repeatStates[i + 1];
    }
    dispatch({type: reducerCases.SET_REPEAT_STATE, repeatState: nextRepeatState})
    await axios.put(
      `https://api.spotify.com/v1/me/player/repeat?state=${nextRepeatState.toLowerCase()}`,
      {},
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    );
  };

  const changeState = async () => {
    dispatch({
      type: reducerCases.SET_PLAYER_STATE,
      playerState: !playerState,
    });
  };

  let repeatStyle;
  if(repeatState === "CONTEXT") {
    repeatStyle = {color: 'green'}
  } else if (repeatState === "TRACK") {
    repeatStyle = {color: 'blue'}
  } else {
    repeatStyle = {color: 'white'}
  }

  return (
    <Container shuffleState={shuffleState}>
      <div className="player__controls">
        <div className="shuffle">
          <BsShuffle style={shuffleState ? {color: 'green'} : {color: 'white'}} className="shuffle__iocn" onClick={toggleShuffle} />
        </div>
        <div className="previous">
          <CgPlayTrackPrev
            onClick={async () => {
              await window.player.previousTrack();
              await window.player.activateElement();
              dispatch({
                type: reducerCases.SET_PLAYER_STATE,
                playerState: true,
              });
            }}
          />
        </div>
        <div className="state">
          {playerState ? (
            <BsFillPauseCircleFill
              onClick={async () => {
                try {
                  changeState();
                  await window.player.activateElement();
                  await window.player.togglePlay();
                } catch (err) {
                  console.error(err);
                }
              }}
            />
          ) : (
            <BsFillPlayCircleFill
              onClick={() => {
                changeState();
                window.player.togglePlay().then(() => {});
              }}
            />
          )}
        </div>
        <div className="next">
          <CgPlayTrackNext
            onClick={async () => {
              await window.player.activateElement();
              await window.player.nextTrack();
              dispatch({
                type: reducerCases.SET_PLAYER_STATE,
                playerState: true,
              });
            }}
          />
        </div>
        <div className="repeat">
          <FiRepeat style={repeatStyle} onClick={changeRepeatState} />
        </div>
      </div>
      <ProgressBar />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1rem;
  .player__controls {
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
  }
`;
