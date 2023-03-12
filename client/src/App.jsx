import { useState, useEffect } from 'react'
import axios from 'axios'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css'
import CreateSong from './components/CreateSong/CreateSong';
import ListSong from './components/ListSongs/ListSong';
import DeleteSong from './components/DeleteSongs/DeleteSong';
import UpdateSong from './components/UpdateSong/UpdateSong';
import ViewSong from './components/ViewSong/ViewSong';
import NotMatch from './components/Error/NotMatch';
import Header from './components/Header/Header';

function App() {
  const [message, setMessage] = useState("");

  // useEffect(() => {
  //   fetch("http://localhost:8000/message")
  //     .then((res) => res.json())
  //     .then((data) => setMessage(data.message));
  // }, []);


  // useEffect(() => {
  //   axios.get("http://localhost:8000/api/v1/songs/")
  //     .then((res) => console.log(res.data))
  // }, []);
  
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path='/' exact element ={ <ListSong />} />
          <Route path='/create' element ={ <CreateSong />} />
          <Route path='/delete' element ={ <DeleteSong />} />
          <Route path='/update/:id' element ={ <UpdateSong />} />
          <Route path='/view' element ={ <ViewSong />} />
          <Route path='/*' element ={ <NotMatch />} />

        </Routes>
      </Router>
      App
      <h1>{message}</h1>
    </div>
  )
}

export default App
