import { reducerCases } from "./Constants";

export const initialState = {
    token: null,
    playlists: [],
    userInfo: null,
    selectedPlaylistId: "1zczoFMTHFE7MKej2VycEj",
    selectedPlaylist: null,
    currentlyPlaying: null,
    playerState: false,
    shuffleState: null,
    repeatState: null
}

const reducer = (state, action) => {
    switch(action.type){
        case reducerCases.SET_TOKEN : {
            return {
                ...state,
                token: action.token
            }
        }
        case reducerCases.SET_PLAYLISTS : {
            return {
                ...state,
                playlists: action.playlists,
            }
        }
        case reducerCases.SET_USER: {
            return {
                ...state,
                userInfo: action.userInfo
            }
        }
        case reducerCases.SET_PLAYLIST: {
            return {
                ...state,
                selectedPlaylist: action.selectedPlaylist
            }
        }
        case reducerCases.SET_PLAYING: {
            return {
                ...state,
                currentlyPlaying: action.currentlyPlaying
            }
        }
        case reducerCases.SET_PLAYER_STATE: {
            return {
                ...state,
                playerState: action.playerState
            }
        }
        case reducerCases.SET_SHUFFLE_STATE: {
            return {
                ...state,
                shuffleState: action.shuffleState
            }
        }
        case reducerCases.SET_REPEAT_STATE: {
            return {
                ...state,
                repeatState: action.repeatState
            }
        }
        case reducerCases.SET_PLAYLIST_ID: {
            return {
                ...state,
                selectedPlaylistId: action.selectedPlaylistId
            }
        }
        default:
            return state;
    }
}

export default reducer
