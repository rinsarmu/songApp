import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchSongs, deleteSong, updateSong } from "./ListSongSlice";

const ListSong = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState(0);
  const [listOfSongs, setListOfSongs] = useState([]);

  useEffect(() => {
    dispatch(fetchSongs("Check up ne variable"));
  }, [refresh]);

  const refreshData = () => {
    setRefresh((prevRefresh) => prevRefresh + 1);
  };

  const fetch = useSelector((state) => state.song);
  const newFetch = fetch?.songs?.data;

  useEffect(() => {
    if (newFetch) {
      setListOfSongs(newFetch.songs);
    }
  }, [newFetch]);

  const deleteSongById = (id) => {
    dispatch(deleteSong(id)).then(() => {
      refreshData();
      setListOfSongs((prevList) => prevList.filter((song) => song._id !== id));
    });
  };

  const updateSongById = (id, song) => {
    navigate(`/update/${id}`, { state: { song } });
  };

  return (
    <div>
      {fetch.loading && <p>Loading</p>}
      <Link to="/create"> Add</Link>
      List of songs
      {listOfSongs &&
        listOfSongs.map((song) => {
          return (
            <div key={song.title}>
              {song.title}
              <button onClick={() => deleteSongById(song._id)}>Delete</button>
              <button onClick={() => updateSongById(song._id, song)}>
                Update
              </button>
            </div>
          );
        })}
    </div>
  );
};

export default ListSong;
