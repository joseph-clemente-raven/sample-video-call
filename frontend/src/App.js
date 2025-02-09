import React from 'react';
import VideoPlayer from './components/VideoPlayer';
import Sidebar from './components/Sidebar';
import Notifications from './components/Notifications';
import './App.css';

const App = () => {
  return (
    <div className="wrapper">
      <div className="appBar">
        <h2>Video Chat</h2>
      </div>
      <VideoPlayer />
      <Sidebar>
        <Notifications />
      </Sidebar>
    </div>
  );
};

export default App;
