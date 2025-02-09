const socket = io('https://sample-video-call.onrender.com'); // ✅ Full URL
const videoGrid = document.getElementById('video-grid');

const myVideo = document.createElement('video');
myVideo.muted = true;
const peers = {};

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream);

  socket.emit('join-room', ROOM_ID);

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream);
  });

  socket.on('user-disconnected', userId => {
    if (peers[userId]) {
      peers[userId].destroy();
      delete peers[userId];
    }
  });

  socket.on('signal', ({ userId, signal }) => {
    if (peers[userId]) {
      peers[userId].signal(signal);
    }
  });
});

function connectToNewUser(userId, stream) {
  const peer = new SimplePeer({
    initiator: true,
    trickle: false,
    stream: stream
  });

  peer.on('signal', signal => {
    socket.emit('signal', { userId, signal });
  });

  peer.on('stream', userVideoStream => {
    const video = document.createElement('video');
    addVideoStream(video, userVideoStream);
  });

  peer.on('close', () => {
    peer.destroy();
    delete peers[userId];
  });

  peers[userId] = peer;
}

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  videoGrid.append(video);
}
