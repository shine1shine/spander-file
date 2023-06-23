import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  repositories: [],
};

const repositoriesListSlices = createSlice({
  name: "allReposList",
  initialState,
  reducers: {
    setRepositories: (state, action) => {
      state.repositories = action.payload;
    },
  },
});

export const { setRepositories } = repositoriesListSlices.actions;

export default repositoriesListSlices.reducer;
