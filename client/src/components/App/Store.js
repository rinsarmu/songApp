import { configureStore } from "@reduxjs/toolkit";

import ListSongSlice from "../ListSongs/ListSongSlice";
const store = configureStore({
  reducer: {
    song: ListSongSlice,
  },
});

export default store;
