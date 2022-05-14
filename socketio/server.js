const httpServer = require("http").createServer();
require("events").EventEmitter.prototype._maxListeners = 100;

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const playerIdList = [];

io.on("connection", (socket) => {
  socket.on("create", (roomId) => {
    socket.join(roomId);

    playerIdList.push({
      room: roomId,
      id: socket.id,
      username: socket.id,
      userReady: false,
      timer: false,
    });

    io.to(roomId).emit(
      "lobby-players",
      playerIdList.filter((game) => game.room === roomId)
    );

    socket.on("username", (nickname) => {
      playerIdList.find((s) => s.id === socket.id).username = nickname;
      io.in(roomId).emit(
        "lobby-players",
        playerIdList.filter((game) => game.room === roomId)
      );
    });

    socket.on("message", ({ nicknameChosen, message }) => {
      socket.broadcast.to(roomId).emit("receive-message", nicknameChosen, message);
    });

    //handle ready function
    socket.on("isReady", (socketId) => {
      io.to(roomId).emit("ready", socketId);
    });

    socket.on("disconnect", () => {
      const disconnect = playerIdList.findIndex(
        (game) => game.id === socket.id
      );
      playerIdList.splice(disconnect, 1);

      if (io.sockets.adapter.rooms.get(roomId)) {
        io.to(roomId).emit(
          "lobby-players",
          playerIdList.filter((game) => game.room === roomId)
        );
      }
    });

    // socket.on('timer', () => {
    //     const me = playerIdList.find(s => s.id === socket.id)
    //     me.timer = true
    //     const lobbyPlayers = playerIdList.filter(game => game.room === roomId)
    //     if(lobbyPlayers.every(s => s.timer===true)){

    //         let timer = 10;
    //         const countdown = setInterval(function () {
    //             io.to(roomId).emit('countdown', timer)
    //             timer--
    //             socket.on('reset', () => {
    //                 clearInterval(countdown)
    //                 lobbyPlayers.forEach(s => s.timer = false)
    //             })
    //             if (timer < 0) {
    //                 io.to(roomId).emit('timeUp')
    //                 clearInterval(countdown)
    //                 lobbyPlayers.forEach(s => s.timer = false)
    //             }
    //         }, 1000)
    //     }
    // })
  });
});

module.exports = httpServer;
