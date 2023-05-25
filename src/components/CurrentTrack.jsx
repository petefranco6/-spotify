import styled from "styled-components";
import { useStateProvider } from "../utils/StateProvider";

export default function CurrentTrack() {
  const [{ currentlyPlaying }] = useStateProvider();

  return (
    <Container>
        {currentlyPlaying && (
          <div className="track">
            <div className="track__image">
              <img src={currentlyPlaying.image} alt="currentlyPlaying" />
            </div>
            <div className="track__info">
              <h4>{currentlyPlaying.name}</h4>
              <h6>{currentlyPlaying.artists.join(", ")}</h6>
            </div>
          </div>
        )}
    </Container>
  );
}

const Container = styled.div`
  color: white;
  .track {
    display: flex;
    align-items: center;
    gap: 1rem;
    img {
      height: 50px;
    }
    &__info {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      h4 {
        color: white;
      }
      h6 {
        color: #b3b3b3;
      }
    }
  }
`;
