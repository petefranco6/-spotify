import { useEffect, useState } from "react";
import styled from "styled-components";
import { useStateProvider } from "../utils/StateProvider";

const convertTimeToSeconds = (timeString) => {
  const [minutes, seconds] = timeString.split(":");
  const totalSeconds = parseInt(minutes) * 60 + parseInt(seconds);
  return totalSeconds;
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const RemainingSeconds = seconds % 60;

  return `${minutes}:${RemainingSeconds}`;
}

const ProgressBar = () => {
  const [{ currentlyPlaying, playerState }] = useStateProvider();
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setSeconds(0);
    setMinutes(0);
  }, [currentlyPlaying]);

  useEffect(() => {
    if (currentlyPlaying?.duration && playerState) {
      const duration = currentlyPlaying.duration.split(":");
      let interval = setInterval(() => {
        if (
          minutes === parseInt(duration[0]) &&
          seconds === parseInt(duration[1])
        ) {
          clearInterval(interval);
        } else {
          if (seconds < 59) {
            setSeconds((prevSeconds) => prevSeconds + 1);
          } else {
            setSeconds(0);
            setMinutes((prevMinutes) => prevMinutes + 1);
          }
          setProgress(
            (convertTimeToSeconds(minutes + ":" + seconds) /
              convertTimeToSeconds(currentlyPlaying.duration)) *
              100
          );
        }
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [seconds, minutes, currentlyPlaying?.duration, playerState]);

  const seekToPosition = async (event) => {
      const progressBarWidth = event.currentTarget.clientWidth;
      const clickPosition = event.clientX - event.currentTarget.getBoundingClientRect().left;
      const seekTime = (clickPosition / progressBarWidth) * convertTimeToSeconds(currentlyPlaying.duration);
      const duration = formatTime(parseInt(seekTime)).split(":")
      setMinutes(parseInt(duration[0]))
      setSeconds(parseInt(duration[1]))
      setProgress((seekTime/convertTimeToSeconds(currentlyPlaying.duration)) * 100 )
      await window.player.seek(seekTime * 1000)
  }

  return (
    <Container width={progress}>
      <div className="current__time">
        <div>{minutes < 10 && minutes > 0 ? "0" + minutes + ":" : minutes + ":"}</div>
        <div>{seconds < 10 && seconds >= 0 ? "0" + seconds : seconds}</div>
      </div>

      <div className="bar__full" onClick={(event) => seekToPosition(event)}>
        <div className="bar"></div>
      </div>

      {currentlyPlaying && (
        <div>{currentlyPlaying.duration}</div>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  color: white;
  gap: 1rem;
  .current__time {
    display: flex;
  }
  .bar__full {
    width: 100%;
    height: 10px;
    background-color: #f2f2f2;
    border-radius: 5px;
    overflow: hidden;

    .bar {
      width: ${(props) => props.width}%;
      height: 100%;
      background-color: #1db954;
      border-radius: 5px;
      transition: width 0.3s ease-in-out;
    }
  }
`;

export default ProgressBar;
