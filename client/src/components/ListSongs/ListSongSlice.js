import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  songs: [],
  error: "",
};

// Generate pending, fulfiled, rejected action types
export const fetchSongs = createAsyncThunk("song/fetchSongs", async (genre) => {
  console.log(genre);
  //    return  axios.get('http://127.0.0.1:8000/api/v1/users')

  return await axios
    .get("http://127.0.0.1:8000/api/v1/songs/")
    .then((res) => res.data)
    .catch((error) => {
      throw error.response.data;
    });
});

export const deleteSong = createAsyncThunk("song/deleteSong", async (id) => {
  console.log("delete me");
  //    return  axios.get('http://127.0.0.1:8000/api/v1/users')

  return await axios
    .delete(`http://127.0.0.1:8000/api/v1/songs/${id}`)
    .then((res) => {res.data
      return id
    
    })
    .catch((error) => {
      throw error.response.data;
    });
});

// export const updateSong = createAsyncThunk(
//   "song/updateSong",
//   async ({ id, songData }) => {
//     console.log("called her...............", id);
//     console.log("Data .............", songData);
//     return await axios
//       .patch(`http://127.0.0.1:8000/api/v1/songs/${id}`, songData)
//       .then((res) => {
//         res.data;
//       })
//       .catch((error) => {
//         console.log("error");
//         throw error.response.data;
//       });
//     u;
//   }
// );

export const updateSong = createAsyncThunk(
  "song/updateSong",
  async ({ id, songData }) => {
    try {
      const response = await axios.patch(`http://127.0.0.1:8000/api/v1/songs/${id}`, songData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

const ListsongSlice = createSlice({
  name: "song",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchSongs.pending, (state) => {
      state.loading = true;
      console.log("Loading...");
    });

    builder.addCase(fetchSongs.fulfilled, (state, action) => {
      state.loading = false;
      state.songs = action.payload;
      state.error = "";
      console.log("Fulfilled ...");
    });

    builder.addCase(fetchSongs.rejected, (state, action) => {
      state.loading = false;
      state.songs = [];
      state.error = action.error.message;
      console.log("failed ...");
    });

    builder.addCase(deleteSong.pending, (state) => {
      state.loading = true;
      console.log("Loading...");
    });

    builder.addCase(deleteSong.fulfilled, (state, action) => {
      console.log("I am delletinggggggggggggggggggggggggggggggggggggggg u")
      console.log(state.songs)
      state.loading = false;
      if (Array.isArray(state.songs)) {

      state.songs = state.songs.filter((song) => song.id !== action.payload);
      }
      state.error = "";
      console.log("Fulfilled ...");
    });

    builder.addCase(deleteSong.rejected, (state, action) => {
      state.loading = false;
      state.songs = [];
      state.error = action.error.message;
      console.log("failed ...");
    });

    builder.addCase(updateSong.pending, (state) => {
      state.loading = true;
      console.log("Loading...");
    });

    // builder.addCase(updateSong.fulfilled, (state, action) => {
    //   console.log("Updating...");
    //   console.log(state.songs)
    //   const index = state.songs.findIndex(
    //     (song) => song.id === action.payload.id
    //   );
    //   if (index !== -1) {
    //     state.songs[index] = action.payload;
    //   }
    //   state.loading = false;
    //   state.error = "";
    //   console.log("Fulfilled ...");
    // });

    builder.addCase(updateSong.fulfilled, (state, action) => {
      console.log(state)
      if (Array.isArray(state.songs)) {
        const index = state.songs.findIndex((song) => song.id === action.payload.id);
        if (index !== -1) {
          state.songs[index] = action.payload;
        }
      }
      state.loading = false;
      state.error = "";
    });

    builder.addCase(updateSong.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      console.log("failed ...");
    });
  },
});

export default ListsongSlice.reducer;
