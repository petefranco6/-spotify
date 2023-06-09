import React from 'react'
import styled from 'styled-components'

export default function Login() {

    const handleClick = () => {
        const clientId = "788cecc9a7f74beda4987267ce839a8e"
        const redirectUri = process.env.NODE_ENV !== "production" ? process.env.REACT_APP_REDIRECT_URI : process.env.REACT_APP_PRODUCTION_REDIRECT_URI;
        const apiUrl = "https://accounts.spotify.com/authorize"
        const scope = [
            'user-read-email',
            'user-read-private',
            'user-modify-playback-state',
            'user-read-playback-state',
            'user-read-currently-playing',
            'user-read-recently-played',
            'user-read-playback-position',
            'user-top-read',
            'streaming'
        ]
        window.location.href = `${apiUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope.join(" ")}&response_type=token&show_dialog=true`
    }
  return (
    <Container>
        <img src='https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_Black.png' alt='spotify'/>
        <button onClick={handleClick}>connect spotify</button>
    </Container>
  )
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
    background-color: #1db954;
    gap: 5rem;
    img {
        height: 20vh;
    }
    button {
        padding: 1rem 5rem;
        border-radius: 5rem;
        border: none;
        background-color: black;
        color: #49f585;
        font-size: 1.4rem;
        cursor: pointer;
    }
`
