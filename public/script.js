const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
    host: 'sample-video-call.onrender.com', // Remove extra "https"
    path: '/peerjs', // Ensure correct path
    secure: true, // Necessary for HTTPS
    port: 443, // Optional (default for HTTPS)
})
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream)

  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream);
    const video = document.createElement('video');
  
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream, userId); // Pass userId
    });
  
    call.on('close', () => {
      video.remove();
      console.log(`User ${userId} video removed`);
    });
  
    peers[userId] = call;
  }
 
  function addVideoStream(video, stream, userId = "Unknown") {
    video.srcObject = stream;
    video.setAttribute("data-userid", userId); // Store user ID in video tag
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
    videoGrid.append(video);
    
    // Log user ID after adding video
    document.querySelectorAll("video").forEach(video => {
      console.log("User ID:", video.getAttribute("data-userid"));
    });
  }
  
  