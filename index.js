const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
	res.send('Running');
});

io.on("connection", (socket) => {
	console.log(`New connection: ${socket.id}`);
	socket.emit("me", socket.id);

	socket.on("disconnect", () => {
		console.log(`User disconnected: ${socket.id}`);
		socket.broadcast.emit("callEnded");
	});

	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		console.log(`Calling user: ${userToCall} from ${from} (${name})`);
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});

	socket.on("answerCall", (data) => {
		console.log(`Call answered by: ${data.to}`);
		io.to(data.to).emit("callAccepted", data.signal);
	});
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
