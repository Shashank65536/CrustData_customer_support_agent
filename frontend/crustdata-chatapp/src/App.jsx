import React, { useEffect, useState } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import './App.css';
function App() {
  
  const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    // Connect on component mount
    const socket = new SockJS('http://localhost:8080/websocket-connection');
    const stomp = Stomp.over(socket);
    console.log(socket);

    stomp.connect({}, () => {
      // On successful connection, subscribe to the server
      stomp.subscribe('/topic/greeting', (message) => {
        const responseBody = JSON.parse(message.body);
        setMessages((prev) => [...prev, responseBody]);
      });
    });

    setStompClient(stomp);

    // Cleanup on unmount
    return () => {
      if (stompClient !== null) {
        stompClient.disconnect();
      }
    };
  }, []);

  const sendMessage = () => {
    if (stompClient && input.trim() !== "") {
      const chatMessage = {
        sender: "User",
        content: input
      };
      console.log(stompClient);
      stompClient.send("/app/hello", {}, JSON.stringify(chatMessage));
      setMessages([...messages, chatMessage]); // show user’s own message in chat
      setInput("");
    }
  };

  return (
    <div className="app">
      <div className="chat-container">
        <h3>Crustdata API Chat</h3>

        <div className="message-container">
          {console.log(messages)}
          {messages.map((msg, idx) => (
            <div key={idx} className="message">
              <strong>{msg.sender}</strong> {msg.content}
            </div>
          ))}
        </div>

        <div className="input-container">
          <input
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App
