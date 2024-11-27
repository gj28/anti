import React, { useState, useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import "./Chat.css";
import Features from "./Features";
import { FaPaperPlane } from "react-icons/fa";  // Importing send icon
import { IoCloseCircleOutline } from "react-icons/io5";  // Importing close icon

function Chatbot({ showChatbot, onClose }) {
  const [isClient, setIsClient] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Welcome to Anti-AI. How can I help you?", type: "incoming" },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [textareaVisible, setTextareaVisible] = useState(false);
  const chatboxRef = useRef(null);
  const textareaRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleFeatureClick = async (feature) => {
    if (feature === "Other") {
      setTextareaVisible(true);
    } else {
      setTextareaVisible(false);
      sendMessage(feature);
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    sendMessage(inputMessage);
    setInputMessage("");
  };

  const sendMessage = async (message) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: message, type: "outgoing" },
      { text: "Thinking...", type: "incoming" },
    ]);

    try {
      const response = await fetch("https://aws.antiai.ltd/apii/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (response.ok) {
        const data = await response.json();
        startTypingEffect(data.response);
      } else {
        throw new Error("Failed to fetch");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        newMessages.pop();
        return [
          ...newMessages,
          { text: "Sorry, something went wrong. Please try again.", type: "incoming" },
        ];
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startTypingEffect = (messageText) => {
    setIsTyping(true);
    let index = 0;
    const typingSpeed = 50; // Speed in ms per character

    const typeInterval = setInterval(() => {
      if (index < messageText.length) {
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          newMessages[newMessages.length - 1].text = messageText.slice(0, index + 1);
          return newMessages;
        });
        index++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
      }
    }, typingSpeed);
  };

  if (!isClient) return null;

  return (
    <div className={`chatbot ${showChatbot ? "show" : ""}`}>
      <header className="header-chat">
        <img src="/static/chatlogo.png" alt="Profile" className="profile-image" />
        <div className="chat-logo">
          <img src="../static/anti-ai-updated-logo.png" alt="Anti AI Logo" className="anti-ai-logo" />
        </div>
        <button className="close-btn" onClick={onClose}>
          <IoCloseCircleOutline size={30} />
        </button>
      </header>

      <Features onFeatureClick={handleFeatureClick} />

      <ul className="chatbox" ref={chatboxRef}>
        {Array.isArray(messages) &&
          messages.map((message, index) => <ChatMessage key={index} message={message} />)}
      </ul>

      {textareaVisible && (
        <div className="chat-input">
          <textarea
            ref={textareaRef}
            placeholder="Enter a message..."
            value={inputMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          ></textarea>
          <button id="send-btn" className="send-button" onClick={handleSendMessage}>
            <FaPaperPlane size={20} />
          </button>
        </div>
      )}
    </div>
  );
}

export default Chatbot;





// TYPE WRITTER EFFECT

// import React, { useState, useEffect, useRef } from "react";
// import ChatMessage from "./ChatMessage";
// import './Chat.css';
// import Features from "./Features";

// function Chatbot({ showChatbot, onClose }) {
//   const [messages, setMessages] = useState([
//     { text: "Welcome to Anti-AI. How can I help you?", type: "incoming" },
//   ]);

//   const [inputMessage, setInputMessage] = useState("");
//   const [textareaVisible, setTextareaVisible] = useState(false); 
//   const chatboxRef = useRef(null);
//   const textareaRef = useRef(null);
//   const [isTyping, setIsTyping] = useState(false); // Track typing effect

//   useEffect(() => {
//     if (chatboxRef.current) {
//       chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
//     }
//   }, [messages]);

//   const handleInputChange = (e) => {
//     setInputMessage(e.target.value);
//     adjustTextareaHeight();
//   };

//   const adjustTextareaHeight = () => {
//     if (textareaRef.current) {
//       textareaRef.current.style.height = "auto";
//       textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
//     }
//   };

//   const handleFeatureClick = (feature) => {
//     if (feature === 'Other') {
//       setTextareaVisible(true);
//     } else {
//       setTextareaVisible(false); 
//       setMessages(prevMessages => [
//         ...prevMessages,
//         { text: `You selected: ${feature}`, type: "outgoing" },
//         { text: "Thinking...", type: "incoming" }
//       ]);

//       setTimeout(() => {
//         fetch('http://127.0.0.1:5000/api/chat', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ message: feature }),
//         })
//         .then(response => response.json())
//         .then(data => {
//           setMessages(prevMessages => {
//             const newMessages = [...prevMessages];
//             newMessages.pop(); 
//             typeWriterEffect(newMessages, data.response);
//           });
//         })
//         .catch(error => {
//           console.error('Error:', error);
//           setMessages(prevMessages => {
//             const newMessages = [...prevMessages];
//             newMessages.pop(); 
//             return [...newMessages, { text: "Sorry, something went wrong. Please try again.", type: "incoming" }];
//           });
//         });
//       }, 100); 
//     }
//   };

//   const handleSendMessage = () => {
//     if (!inputMessage.trim()) return;

//     setMessages([...messages, { text: inputMessage, type: "outgoing" }]);

//     setInputMessage("");

//     setMessages(prevMessages => [
//       ...prevMessages,
//       { text: "Thinking...", type: "incoming" },
//     ]);

//     setTimeout(() => {
//       fetch('http://127.0.0.1:5000/api/chat', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ message: inputMessage }),
//       })
//       .then(response => response.json())
//       .then(data => {
//         setMessages(prevMessages => {
//           const newMessages = [...prevMessages];
//           newMessages.pop(); 
//           typeWriterEffect(newMessages, data.response);
//         });
//       })
//       .catch(error => {
//         console.error('Error:', error);
//         setMessages(prevMessages => {
//           const newMessages = [...prevMessages];
//           newMessages.pop(); 
//           return [...newMessages, { text: "Sorry, something went wrong. Please try again.", type: "incoming" }];
//         });
//       });
//     }, 200); 
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   // Function to apply typewriting effect
//   const typeWriterEffect = (prevMessages, messageText) => {
//     setIsTyping(true);
//     let index = 0;
//     const typingSpeed = 2; // Milliseconds per character

//     const typingInterval = setInterval(() => {
//       if (index < messageText.length) {
//         const currentText = messageText.slice(0, index + 1);
//         setMessages([...prevMessages, { text: currentText, type: "incoming" }]);
//         index++;
//       } else {
//         clearInterval(typingInterval);
//         setIsTyping(false);
//       }
//     }, typingSpeed);
//   };

//   return (
//     <div className={`chatbot ${showChatbot ? "show" : ""}`}>
//       <header className="header-chat">
//         <img 
//           src='/static/robot-assistant.png'
//           alt="Profile"
//           className="profile-image"
//         />
//         <div className="chat-logo">
//           <img
//             src="../static/anti-ai-updated-logo.png"
//             alt="Anti AI Logo"
//             className="anti-ai-logo"
//           />
//         </div>
//         <span className="close-btn material-symbols-outlined" onClick={onClose}>
//           close
//         </span>
//       </header>

//       <Features onFeatureClick={handleFeatureClick} />

//       <ul className="chatbox" ref={chatboxRef}>
//         {Array.isArray(messages) && messages.map((message, index) => (
//           <ChatMessage key={index} message={message} />
//         ))}
//       </ul>

//       {textareaVisible && (
//         <div className="chat-input">
//           <textarea
//             ref={textareaRef}
//             placeholder="Enter a message..."
//             value={inputMessage}
//             onChange={handleInputChange}
//             onKeyDown={handleKeyDown}
//           ></textarea>
//           <span
//             id="send-btn"
//             className="material-symbols-outlined"
//             onClick={handleSendMessage}
//           >
//             send
//           </span>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Chatbot;
