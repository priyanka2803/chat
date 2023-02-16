import React, { useEffect, useState } from 'react';
import { Widget, addResponseMessage, addLinkSnippet, addUserMessage, setQuickButtons } from 'react-chat-widget';
import socket from './socket';
import 'react-chat-widget/lib/styles.css';

const buttons = [{ label: 'first', value: '1' }, { label: 'second', value: '2' }];

function App() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({})
  useEffect(() => {
    const username = prompt("Enter name");
    console.log(username);
    socket.auth = {username};
    socket.connect();
    console.log("connected = ",socket);
    setUser({username,userID:socket.id});

    socket.on("private message", ({ content, from }) => {
      console.log("Private message from server",content);
      for (let i = 0; i < this.users.length; i++) {
        const user = this.users[i];
        if (user.userID === from) {
          user.messages.push({
            content,
            fromSelf: false,
          });
          if (user !== this.selectedUser) {
            user.hasNewMessages = true;
          }
          break;
        }
      }
    });
    return () => {
      socket.off("connect_error");
    };
  }, []);

  socket.on("user connected", (user) => {
    users.push(user);
    setUsers(users);
    console.log("users = ",users);
  });

  socket.on("users", (users) => {
    users.forEach((user) => {
      user.self = user.userID === socket.id;
      setUser(user);
    });
    // put the current user first, and then sort by username
    this.users = users.sort((a, b) => {
      if (a.self) return -1;
      if (b.self) return 1;
      if (a.username < b.username) return -1;
      return a.username > b.username ? 1 : 0;
    });
  });

  socket.on("private message", ({ content, from }) => {
    console.log("Private message from server top",content);

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      if (user.userID === from) {
        console.log("Private message from server",content);
        if(!user.messages)
        user.messages=[];
        user.messages.push({
          content,
          fromSelf: false,
        });
        if (user !== this.selectedUser) {
          user.hasNewMessages = true;
        }
        break;
      }
    }
  });
  const onMessage = (content) => {
    console.log("message = ",content);
    let to;
    // if (this.selectedUser) {
      for(let i=0;i<users.length;i++)
      {
        console.log("message user = ",users[i]);
        if(users[i].username=="ghi")
        {
          to=users[i].userID;
          break;
        }
      }
      socket.emit("private message", {
        content,
        to: to,
      });
      // this.selectedUser.messages.push({
      //   content,
      //   fromSelf: true,
      // });
    // }
  }

  const handleNewUserMessage = newMessage => {
    console.log(`New message incoming! ${newMessage}`);
    onMessage(newMessage);
    // Now send the message throught the backend API
  };

  const handleQuickButtonClicked = data => {
    console.log(data);
    setQuickButtons(buttons.filter(button => button.value !== data));
  };

  useEffect(() => {
    addResponseMessage('Welcome to this awesome chat!');
    setQuickButtons(buttons);
  }, []);

  return (
    <div className="App">
      <Widget
        handleNewUserMessage={handleNewUserMessage}
        handleQuickButtonClicked={handleQuickButtonClicked}
        title="Polls"
        subtitle="Polls Demo"
      />
    </div>
  );
}

export default App;
