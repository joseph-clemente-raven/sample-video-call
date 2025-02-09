import React, { useContext } from 'react';
import { SocketContext } from '../Context';
import './Notifications.css';

const Notifications = () => {
  const { answerCall, call, callAccepted } = useContext(SocketContext);

  return (
    <>
      {call.isReceivingCall && !callAccepted && (
        <div className="notification-container">
          <h1>{call.name} is calling:</h1>
          <button className="answer-button" onClick={answerCall}>
            Answer
          </button>
        </div>
      )}
    </>
  );
};

export default Notifications;