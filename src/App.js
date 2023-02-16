import React, { useEffect, useState } from 'react';
import { Widget, addResponseMessage, addLinkSnippet, addUserMessage, setQuickButtons } from 'react-chat-widget';
import socket from './socket';
import 'react-chat-widget/lib/styles.css';

const buttons = [{ label: 'first', value: '1' }, { label: 'second', value: '2' }];

function App() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [selectedUser, setSelectedUser] = useState({});
  let devUsername;

  useEffect(() => {
    const username = prompt("Enter name");
    devUsername = prompt("Enter name of developer");

    for(let i=0;i<users.length;i++)
    {
      console.log("message user = ",users[i]);
      if(users[i].username===devUsername)
      {
        setSelectedUser(users[i]);
        break;
      }
    }
    console.log(username);
    socket.auth = {username};
    socket.connect();
    console.log("connected = ",socket);
    setUser({username,userID:socket.id});

    socket.on("private message", ({ content, from }) => {
      console.log("Private message from server",content);
      // for (let i = 0; i < users.length; i++) {
      //   const u = users[i];
      //   // if (u.userID === from) {
      //   //   console.log("Private message from server for self",content);
      //   //   if(!user.messages)
      //   //   user.messages=[];
      //   //   user.messages.push({
      //   //     content,
      //   //     fromSelf: false,
      //   //   });
      //   //   if (user !== selectedUser) {
      //   //     user.hasNewMessages = true;
      //   //   }
      //   //   break;
      //   // }
      // }
      addResponseMessage(content);
    });
    return () => {
      socket.off("connect_error");
    };
  }, []);

  // socket.on("user connected", (u) => {
  //   console.log("users = ",users);
  //   users.push(u);
  //   setUsers(users);
  // });

  socket.on("users", (us) => {
    us.forEach((u) => {
      if(u.username===devUsername)
      setSelectedUser(u);
      u.self = u.userID === socket.id;
      // return u;
    });
    // put the current user first, and then sort by username
    // setUsers(
      let temp = us.sort((a, b) => {
      if (a.self) return -1;
      if (b.self) return 1;
      if (a.username < b.username) return -1;
      return a.username > b.username ? 1 : 0;
    });
    setUsers(temp);
    console.log("users = ",users);
  });


  const onMessage = (content) => {
    // console.log("message = ",content);
    if (selectedUser) {
      socket.emit("private message", {
        content,
        to: selectedUser.userID,
      });
      // this.selectedUser.messages.push({
      //   content,
      //   fromSelf: true,
      // });
    }
  }

  const handleNewUserMessage = newMessage => {
    console.log(`New message incoming! ${newMessage}`);
    onMessage(newMessage);
    // Now send the message throught the backend API
  };


  useEffect(() => {
    // addResponseMessage('Welcome to this awesome chat!');
    // setQuickButtons(buttons);
  }, []);

  return (
    <div className="App">
      <Widget
        handleNewUserMessage={handleNewUserMessage}
        title="Chat"
        subtitle="with Developer"
      />
    </div>
  );
}

export default App;
