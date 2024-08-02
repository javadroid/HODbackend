let onlineUsers = [] as any[];
export default function SocketServer(socket: any, io: any) {
  // user is online
  socket.on("join", (user: any) => {
    console.log("user has joined: ", user);
    socket.join(user);

    if (!onlineUsers.some((u) => u.userId === user)) {
      onlineUsers.push({ userId: user, socketId: socket.id });
    }
    io.emit("get_online_users", onlineUsers);

    io.emit("setup_socket", socket.id);
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("get_online_users", onlineUsers);
  });

  //join a conversation room
  socket.on("join_conversation", (conversation: any) => {
    console.log("user has joined conversation: ", conversation);
    socket.join(conversation);
  });

  //send and receive message

  socket.on("send_message", (messaeg: any) => {
    console.log("user has joined conversation: ", messaeg);
    let conversation = messaeg.conversation;

    if (!conversation.users) return;
    conversation.users.forEach((user: any) => {
      if (user._id === messaeg.sender._id) return;
      socket.in(user._id).emit("message_receive", messaeg);
    });
  });

  //typing
  socket.on("typing", (conversation: any) => {
    //    console.log("typing",conversation)
    socket.in(conversation).emit("typing", conversation);
  });
  socket.on("stop_typing", (conversation: any) => {
    // console.log("stop_typing",conversation)
    socket.in(conversation).emit("stop_typing");
  });

  socket.on("call_user", (data: any) => {
    console.log("call_user",data)
    let userId = data.userToCall;
    let userSocketId = onlineUsers.find((user) => user.userId === userId);
    io.to(userSocketId?.socketId).emit("call_user", {
      signal: data.signal,
      from: data.from,
      name: data.name,
      picture: data.picture,
    });
  });


  socket.on("answer_call", (data: any) => {
    console.log("answer_call",data)
    io.to(data.to).emit("call_accepted", data.signal);
  });

  socket.on("end_call", (id: any) => {
   console.log("endcall",id)
    io.to(id).emit("end_call");
  });
}
