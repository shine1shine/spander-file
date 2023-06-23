import { configureStore } from "@reduxjs/toolkit";
import loginUserDetailsSlice from "./slices/loginUserDetailsSlice";
import allRepositorySlice from "./slices/allRepositoryDetails";
import orgsDetailSlice from "./slices/orgsDetails";

export const store = configureStore({
    reducer: {
        loginUserDetailsSlice: loginUserDetailsSlice,
        allRepositorySlice: allRepositorySlice,
        orgsDetailSlice: orgsDetailSlice
    },
});