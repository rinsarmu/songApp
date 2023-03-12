import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function SongForm() {
  const [title, setTitle] = useState('');
  const [songName, setSongName] = useState('');

  const [duration, setDuration] = useState('');
  const [releasedAt, setReleasedAt] = useState('');
  const [rate, setRate] = useState('');
  const navigate = useNavigate()

  const handleSubmit = event => {
    event.preventDefault();
    const songData = { title, duration, releasedAt, rate };
    axios.post('http://localhost:8000/api/v1/songs/', {title, duration, releasedAt, rate})
      .then(response => {
        console.log(response.data);
        navigate('/')
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Song Title:
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
      </label>
      <br />
      <label>
        Song name:
        <input type="text" value={songName} onChange={e => setSongName(e.target.value)} />
      </label>
      <br />
      <label>
        Duration:
        <input type="text" value={duration} onChange={e => setDuration(e.target.value)} />
      </label>
      <br />
      <label>
        Released At:
        <input type="date" value={releasedAt} onChange={e => setReleasedAt(e.target.value)} />
      </label>
      <br />
      <label>
        Rate:
        <input type="text" value={rate} onChange={e => setRate(e.target.value)} />
      </label>
      <br />
      <Link to='/'>
        <button>Cancel</button>

      </Link>

      <button type="submit">Submit</button>
    </form>
  );
}

export default SongForm;
