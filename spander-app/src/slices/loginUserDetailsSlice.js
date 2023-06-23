import { createSlice } from "@reduxjs/toolkit";
import { jsonToObj, objToJson } from "../utils/json-utils";

const initialState = {
  loginUserDetails: {
    isLoggedIn: jsonToObj(localStorage.getItem("user"))?.isLoggedIn ?? false,
    userData: jsonToObj(localStorage.getItem("user"))?.data,
    loginError : null
  },
};

const loginUserDetailsSlice = createSlice({
  name: "loginUserDetails",
  initialState,
  reducers: {
    setLoginUserDetails: (state, action) => {
      localStorage.setItem("user", objToJson(action.payload));

      state.loginUserDetails = {
        ...state.loginUserDetails,
        isLoggedIn: action.payload.isLoggedIn,
        userData: action.payload.data,
        loginError : action.payload.loginError
      };
    },
  },
});

export const { setLoginUserDetails } = loginUserDetailsSlice.actions;

export default loginUserDetailsSlice.reducer;
