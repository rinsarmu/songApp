import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { updateSong } from "../ListSongs/ListSongSlice";

import { useSelector, useDispatch } from "react-redux";

const UpdateSong = () => {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const song = location.state.song;
  console.log(song)
  const [title, setTitle] = useState(song.title);
  const [songName, setSongName] = useState("");

  const [duration, setDuration] = useState(song.duration);
  const [releasedAt, setReleasedAt] = useState();
  const [rate, setRate] = useState(song.rate);

  const handleSubmit = (event) => {
    event.preventDefault();
    const updatedSongData = { title, duration, rate };
    console.log("here ..........", updatedSongData);
    console.log("..............click");
    dispatch(updateSong({ id: song._id, songData: updatedSongData })).then(() => navigate("/"));

    //   axios
    //     .post(`http://localhost:8000/api/v1/songs/${title}`, {
    //       title,
    //       duration,
    //       releasedAt,
    //       rate,
    //     })
    //     .then((response) => {
    //       console.log(response.data);
    //       navigate("/");
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Song Title:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <br />
      <label>
        Song name:
        <input
          type="text"
          value={songName}
          onChange={(e) => setSongName(e.target.value)}
        />
      </label>
      <br />
      <label>
        Duration:
        <input
          type="text"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
      </label>
      <br />
      <label>
        Released At:
        <input
          type="date"
          value={releasedAt}
          onChange={(e) => setReleasedAt(e.target.value)}
        />
      </label>
      <br />
      <label>
        Rate:
        <input
          type="text"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
        />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
};

export default UpdateSong;
