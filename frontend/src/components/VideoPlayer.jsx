import React, { useContext } from 'react';
import './VideoPlayer.css';
import { SocketContext } from '../Context';

const VideoPlayer = () => {
  const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } = useContext(SocketContext);


  console.log(myVideo)

  return (
    <div className="gridContainer">
      {stream && (
        <div className="paper">
          <div className="videoContainer">
            <h5>{name || 'Name'}</h5>
            <video playsInline muted ref={myVideo} autoPlay className="video" />
          </div>
        </div>
      )}
      {callAccepted && !callEnded && (
        <div className="paper">
          <div className="videoContainer">
            <h5>{call.name || 'Name'}</h5>
            <video playsInline ref={userVideo} autoPlay className="video" />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
