const socket = io('https://sample-video-call.onrender.com'); // Use full URL for signaling server

const videoGrid = document.getElementById('video-grid');
const myPeer = new Peer(undefined, {
    host: 'sample-video-call.onrender.com',
    path: '/', // Ensure correct path
    secure: true, // Required for HTTPS
});

const myVideo = document.createElement('video');
myVideo.muted = true;
const peers = {};

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream);

  myPeer.on('call', call => {
    call.answer(stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream);
    });
  });

  socket.on('user-connected', userId => {
    console.log(`User connected: ${userId}`);
    connectToNewUser(userId, stream);
  });
});

socket.on('user-disconnected', userId => {
  if (peers[userId]) {
    peers[userId].close();
    console.log(`User ${userId} disconnected.`);
  }
});

myPeer.on('open', id => {
  if (typeof ROOM_ID === "undefined") {
    console.error("ROOM_ID is not defined!");
  } else {
    socket.emit('join-room', ROOM_ID, id);
    console.log(`Joined room: ${ROOM_ID} with ID: ${id}`);
  }
});

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream);
  const video = document.createElement('video');

  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream, userId);
  });

  call.on('close', () => {
    video.remove();
    console.log(`User ${userId} video removed`);
  });

  peers[userId] = call;
}

function addVideoStream(video, stream, userId = "Unknown") {
  video.srcObject = stream;
  video.setAttribute("data-userid", userId);
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);

  // Log all video elements' user IDs
  document.querySelectorAll("video").forEach(video => {
    console.log("User ID:", video.getAttribute("data-userid"));
  });
}
