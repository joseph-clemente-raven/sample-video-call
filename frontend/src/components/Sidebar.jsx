import React, { useState, useContext } from 'react';
import { SocketContext } from '../Context';
import './Sidebar.css';

const Sidebar = ({ children }) => {
  const { me, callAccepted, name, setName, callEnded, leaveCall, callUser } = useContext(SocketContext);
  const [idToCall, setIdToCall] = useState('');

  console.log(me, 'here')

  const copyToClipboard = async (e) => {
    e.preventDefault(); // Prevent form submission
    try {
      await navigator.clipboard.writeText(me);
      console.log('Copied to clipboard!', me);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };  

  return (
    <div className="container">
      <div className="paper">
        <form className="form" noValidate autoComplete="off">
          <div className="grid-container">
            <div className="grid-item">
              <h6>Account Info</h6>
              <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
              <button type='button' className="copy-button" onClick={copyToClipboard}>Copy Your ID</button>
            </div>
            <div className="grid-item">
              <h6>Make a call</h6>
              <input type="text" placeholder="ID to call" value={idToCall} onChange={(e) => setIdToCall(e.target.value)} className="input-field" />
              {callAccepted && !callEnded ? (
                <button type='button' className="hangup-button" onClick={leaveCall}>Hang Up</button>
              ) : (
                <button type='button' className="call-button" onClick={() => callUser(idToCall)}>Call</button>
              )}
            </div>
          </div>
        </form>
        {children}
      </div>
    </div>
  );
};

export default Sidebar;