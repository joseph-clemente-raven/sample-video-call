const socket = io();
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;
const peers = {};

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream);

  socket.on('user-connected', userId => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

    peerConnection.ontrack = event => {
      const video = document.createElement('video');
      addVideoStream(video, event.streams[0]);
    };

    peerConnection.onicecandidate = event => {
      if (event.candidate) {
        socket.emit('signal', { userId, signal: event.candidate });
      }
    };

    socket.on('signal', ({ userId, signal }) => {
      peerConnection.addIceCandidate(new RTCIceCandidate(signal));
    });

    peers[userId] = peerConnection;
  });

  socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close();
  });

  socket.emit('join-room', ROOM_ID, socket.id);
});

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  videoGrid.append(video);
}
