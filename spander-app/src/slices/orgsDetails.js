import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    orgs: [],
}

const orgsDetailSlice = createSlice({
    name: "orgDetails",
    initialState,
    reducers: {
        setOrgsDetails: (state, action) => {
            state.orgs = action.payload.orgData;
        }
    },
})

export const { setOrgsDetails } = orgsDetailSlice?.actions;

export default orgsDetailSlice?.reducer;