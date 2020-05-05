import axios from "axios";
import {
    PROFILE_LOADING,
    GET_PROFILE,
    GET_ERRORS,
    CLEAR_CURRENT_PROFILE,
} from "../constants";

// Get Current Profile
export const getCurrentProfile = () => (dispatch) => {
    dispatch(setProfileLoading());
    axios
        .get("/api/profile")
        .then((res) =>
            dispatch({
                type: GET_PROFILE,
                payload: res.data,
            })
        )
        .catch((err) =>
            dispatch({
                type: GET_PROFILE,
                payload: {},
            })
        );
};

// Profile Loading
export const setProfileLoading = () => {
    return {
        type: PROFILE_LOADING,
    };
};

// Clear Profile
export const clearCurrentProfile = () => {
    return {
        type: CLEAR_CURRENT_PROFILE,
    };
};
