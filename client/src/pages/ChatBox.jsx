// import React, { useRef, useState, useEffect } from 'react'
// import { dummyMessagesData, dummyUserData } from '../assets/assets';
// import { ImageIcon, SendHorizonal } from 'lucide-react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useParams } from 'react-router-dom';
// import { useAuth } from '@clerk/clerk-react';
// import api from '../api/axios';
// import { addMessage,fetchMessages, resetMessages } from '../features/messages/messagesSlice.js';
// import toast from 'react-hot-toast';

// const ChatBox = () => {
//   const { messages } = useSelector((state) => state.messages);
//   const { userId } = useParams();
//   const { getToken } = useAuth();
//   const dispatch = useDispatch();
//   const [text, setText] = useState('');
//   const [image, setImage] = useState(null);
//   const [user, setUser] = useState(null);
//   const messagesEndRef = useRef(null);

//   const connections = useSelector((state) => state.connections.connections);

//   const fetchUserMessages = async () => {
    
//     try {
//       const token = await getToken();
//       dispatch(fetchMessages({  token, userId  }));
//     } catch (error) {
//       toast.error(error.message);
//     }
//   }

//   // const sendMessage = async () => {
    
//   //   try{
//   //     if (!text.trim() && !image) return;
//   //     const token = await getToken();
//   //     const formdata = new FormData();
//   //     formData.append("to_user_is", userId);
//   //     formData.append("content", text);
//   //     image && formData.append("media", image);

//   //     const { data } = await api.post("/api/message/send", formData, {
//   //       headers: {
//   //         Authorization: `Bearer ${token}`
//   //       }
//   //     })
//   //     if(data.success){
//   //       setText('');
//   //       setImage(null);
//   //       dispatch(addMessage(data.message));
//   //     }else{
//   //       throw new Error(data.message);
//   //     }

//   //   } catch (error) {
//   //     toast.error(error.message);
//   //   }
//   // };

//   const sendMessage = async () => {
//     try {
//       if (!text.trim() && !image) return;
//       const token = await getToken();
      
//       // ✅ 1. Standardized variable name to formData
//       const formData = new FormData(); 
      
//       // ✅ 2. Fixed typo from to_user_is -> to_user_id
//       formData.append("to_user_id", userId); 
//       formData.append("content", text);
//       if (image) formData.append("media", image);

//       const { data } = await api.post("/api/message/send", formData, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       if (data.success) {
//         setText('');
//         setImage(null);
//         dispatch(addMessage(data.message));
//       } else {
//         throw new Error(data.message);
//       }

//     } catch (error) {
//       toast.error(error.message);
//     }
//   };   



//   useEffect(() => {
//     fetchUserMessages();
//     return () => {
//       dispatch(resetMessages());
//     }
//   }, [userId])

//   useEffect(() => {
//     if(connections.length > 0){
//       const user = connections.find(connection => connection._id === userId);
//       setUser(user);
//     }
//   },[connections,userId])

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   return user && (
//     // Fixed: Added md:ml-80 to separate from the fixed navigation sidebar
//     <div className="flex flex-col h-screen md:ml-80 bg-slate-50 overflow-hidden">
      
//       {/* Top Chat Header Panel */}
//       <div className="flex items-center gap-3 px-4 sm:px-10 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200 flex-shrink-0">
//         <img src={user.profile_picture} alt="" className="w-10 h-10 rounded-full object-cover shadow-sm" />
//         <div className="min-w-0">
//           <p className="font-semibold text-slate-800 text-sm sm:text-base truncate">{user.full_name}</p>
//           <p className="text-xs text-gray-500 truncate">@{user.username}</p>
//         </div>
//       </div>

//       {/* Messages Stream Content Area */}
//       <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-50/50">
//         <div className="space-y-4 max-w-4xl mx-auto flex flex-col">
//           {messages
//             .toSorted((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
//             .map((message, index) => (
//               <div 
//                 key={index} 
//                 className={`flex flex-col ${message.to_user_id !== user._id ? "items-start" : "items-end"} w-full`}
//               >
//                 <div 
//                   className={`p-3 text-sm max-w-[75%] sm:max-w-md shadow-sm border ${
//                     message.to_user_id !== user._id 
//                       ? "bg-white text-slate-700 border-slate-100 rounded-2xl rounded-bl-none" 
//                       : "bg-indigo-600 text-white border-indigo-600 rounded-2xl rounded-br-none"
//                   }`}
//                 >
//                   {message.message_type === "image" && (
//                     <img 
//                       src={message.media_url} 
//                       alt="Media attachment" 
//                       className="w-full max-h-64 object-cover rounded-xl mb-1.5 shadow-inner"
//                     />
//                   )}
//                   {message.text && <p className="break-words leading-relaxed">{message.text}</p>}
//                 </div>
//               </div>
//             ))
//           }
//           <div ref={messagesEndRef} />
//         </div>
//       </div>

//       {/* Input Form Action Tray */}
//       <div className="p-3 sm:p-4 bg-white border-t border-slate-100 flex-shrink-0">
//         <div className="flex items-center gap-3 pl-4 pr-1.5 py-1.5 bg-slate-50 w-full max-w-2xl mx-auto border border-slate-200 shadow-sm rounded-full">
//           <input 
//             type="text" 
//             className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder-slate-400 py-1" 
//             placeholder="Type a message..."
//             onKeyDown={e => e.key === 'Enter' && sendMessage()} 
//             onChange={e => setText(e.target.value)} 
//             value={text} 
//           />
          
//           <label htmlFor="image" className="flex items-center justify-center flex-shrink-0">
//             {image ? (
//               <div className="relative">
//                 <img src={URL.createObjectURL(image)} alt="Preview" className="h-8 w-8 object-cover rounded-md border border-indigo-200" />
//                 <div onClick={() => setImage(null)} className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full size-3.5 flex items-center justify-center text-[9px] font-bold cursor-pointer">×</div>
//               </div>
//             ) : (
//               <ImageIcon className="w-5 h-5 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors" />
//             )}
//             <input 
//               type="file" 
//               id="image" 
//               accept="image/*" 
//               hidden 
//               onChange={(e) => e.target.files?.[0] && setImage(e.target.files[0])}
//             />
//           </label>

//           <button 
//             onClick={sendMessage} 
//             className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95 active:scale-95 transition-all cursor-pointer text-white p-2 rounded-full flex-shrink-0 shadow-sm"
//           >
//             <SendHorizonal size={16} />
//           </button>
//         </div>
//       </div>

//     </div>
//   )
// }

// export default ChatBox


//..................................................................


// import React, { useRef, useState, useEffect } from 'react';
// import { ImageIcon, SendHorizonal } from 'lucide-react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useParams } from 'react-router-dom';
// import { useAuth } from '@clerk/clerk-react';
// import api from '../api/axios';
// import { addMessage, fetchMessages, resetMessages } from '../features/messages/messagesSlice.js';
// import toast from 'react-hot-toast';

// const ChatBox = () => {
//   const { messages } = useSelector((state) => state.messages);
//   const { userId } = useParams();
//   const { getToken } = useAuth();
//   const dispatch = useDispatch();
//   const [text, setText] = useState('');
//   const [image, setImage] = useState(null);
//   const [user, setUser] = useState(null);
//   const messagesEndRef = useRef(null);

//   const connections = useSelector((state) => state.connections.connections);

//   const fetchUserMessages = async () => {
//     try {
//       const token = await getToken();
//       dispatch(fetchMessages({ token, userId }));
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const sendMessage = async () => {
//     try {
//       if (!text.trim() && !image) return;
//       const token = await getToken();
      
//       const formData = new FormData(); 
//       formData.append("to_user_id", userId); 
//       // ✅ FIX: Match backend expectation (text instead of content)
//       formData.append("text", text);
//       if (image) formData.append("media", image);

//       const { data } = await api.post("/api/message/send", formData, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       if (data.success) {
//         setText('');
//         setImage(null);
//         dispatch(addMessage(data.message));
//       } else {
//         throw new Error(data.message);
//       }

//     } catch (error) {
//       toast.error(error.message);
//     }
//   };  

//   useEffect(() => {
//     fetchUserMessages();
//     return () => {
//       dispatch(resetMessages());
//     };
//   }, [userId]);

//   useEffect(() => {
//     if (connections.length > 0) {
//       const targetUser = connections.find(connection => connection._id === userId);
//       setUser(targetUser);
//     }
//   }, [connections, userId]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   return user && (
//     <div className="flex flex-col h-screen md:ml-80 bg-slate-50 overflow-hidden">
      
//       {/* Top Chat Header Panel */}
//       <div className="flex items-center gap-3 px-4 sm:px-10 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200 flex-shrink-0">
//         <img src={user.profile_picture} alt="" className="w-10 h-10 rounded-full object-cover shadow-sm" />
//         <div className="min-w-0">
//           <p className="font-semibold text-slate-800 text-sm sm:text-base truncate">{user.full_name}</p>
//           <p className="text-xs text-gray-500 truncate">@{user.username}</p>
//         </div>
//       </div>

//       {/* Messages Stream Content Area */}
//       <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-50/50">
//         <div className="space-y-3 max-w-4xl mx-auto flex flex-col">
//           {Array.isArray(messages) && messages.length > 0 ? (
//             messages
//               .slice()
//               .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
//               .map((message, index) => {
//                 // ✅ FIX: Message sent TO chat user means it was sent BY current user
//                 const isSentByMe = message.to_user_id === user._id;
//                 const textContent = message.text || message.content;

//                 return (
//                   <div 
//                     key={message._id || index} 
//                     className={`flex flex-col ${!isSentByMe ? "items-start" : "items-end"} w-full`}
//                   >
//                     <div 
//                       className={`px-3.5 py-2 text-sm shadow-sm border border-slate-100 rounded-xl bg-white text-black min-w-[60px] max-w-[75%] sm:max-w-md ${
//                         !isSentByMe ? "rounded-bl-none" : "rounded-br-none"
//                       }`}
//                     >
//                       {message.message_type === "image" && message.media_url && (
//                         <img 
//                           src={message.media_url} 
//                           alt="Attachment" 
//                           className="w-full max-h-64 object-cover rounded-lg mb-1.5"
//                         />
//                       )}
//                       {textContent && (
//                         <p className="break-words leading-normal whitespace-pre-wrap text-black font-normal">
//                           {textContent}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })
//           ) : (
//             <div className="text-center text-slate-400 py-10 text-sm">
//               No messages found. Say hi!
//             </div>
//           )}
//           <div ref={messagesEndRef} />
//         </div>
//       </div>

//       {/* Input Form Action Tray */}
//       <div className="p-3 sm:p-4 bg-white border-t border-slate-100 flex-shrink-0">
//         <div className="flex items-center gap-3 pl-4 pr-1.5 py-1.5 bg-slate-50 w-full max-w-2xl mx-auto border border-slate-200 shadow-sm rounded-full">
//           <input 
//             type="text" 
//             className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder-slate-400 py-1" 
//             placeholder="Type a message..."
//             onKeyDown={e => e.key === 'Enter' && sendMessage()} 
//             onChange={e => setText(e.target.value)} 
//             value={text} 
//           />
          
//           <label htmlFor="image" className="flex items-center justify-center flex-shrink-0">
//             {image ? (
//               <div className="relative">
//                 <img src={URL.createObjectURL(image)} alt="Preview" className="h-8 w-8 object-cover rounded-md border border-indigo-200" />
//                 <div onClick={() => setImage(null)} className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full size-3.5 flex items-center justify-center text-[9px] font-bold cursor-pointer">×</div>
//               </div>
//             ) : (
//               <ImageIcon className="w-5 h-5 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors" />
//             )}
//             <input 
//               type="file" 
//               id="image" 
//               accept="image/*" 
//               hidden 
//               onChange={(e) => e.target.files?.[0] && setImage(e.target.files[0])}
//             />
//           </label>

//           <button 
//             onClick={sendMessage} 
//             className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95 active:scale-95 transition-all cursor-pointer text-white p-2 rounded-full flex-shrink-0 shadow-sm"
//           >
//             <SendHorizonal size={16} />
//           </button>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default ChatBox;



// ...............................................
import React, { useRef, useState, useEffect } from 'react';
import { ImageIcon, SendHorizonal } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import api from '../api/axios';
import { addMessage, fetchMessages, resetMessages } from '../features/messages/messagesSlice.js';
import toast from 'react-hot-toast';

const ChatBox = () => {
  const { messages } = useSelector((state) => state.messages);
  const { userId } = useParams();
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);

  const connections = useSelector((state) => state.connections.connections);

  const fetchUserMessages = async () => {
    try {
      const token = await getToken();
      dispatch(fetchMessages({ token, userId }));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const sendMessage = async () => {
    try {
      if (!text.trim() && !image) return;
      const token = await getToken();
      
      const formData = new FormData(); 
      formData.append("to_user_id", userId); 
      formData.append("text", text);
      if (image) formData.append("image", image); // Matched upload.single("image") in router

      const { data } = await api.post("/api/message/send", formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (data.success) {
        setText('');
        setImage(null);
        dispatch(addMessage(data.message));
      } else {
        throw new Error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  };  

  // Load chat history on recipient switch
  useEffect(() => {
    if (userId) {
      fetchUserMessages();
    }
    return () => {
      dispatch(resetMessages());
    };
  }, [userId]);

  // Handle Real-time SSE stream for receiving messages live
  useEffect(() => {
    if (!userId) return;

    const backendUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';
    const eventSource = new EventSource(`${backendUrl}/api/message/sse/${userId}`);

    eventSource.onmessage = (event) => {
      try {
        const newMsg = JSON.parse(event.data);
        if (newMsg && newMsg._id) {
          dispatch(addMessage(newMsg));
        }
      } catch (e) {
        console.error("SSE Parse Error:", e);
      }
    };

    return () => {
      eventSource.close();
    };
  }, [userId, dispatch]);

  // Target User lookup
  useEffect(() => {
    if (connections.length > 0) {
      const targetUser = connections.find(connection => connection._id === userId);
      setUser(targetUser);
    }
  }, [connections, userId]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return user && (
    <div className="flex flex-col h-screen md:ml-80 bg-slate-50 overflow-hidden">
      
      {/* Top Chat Header Panel */}
      <div className="flex items-center gap-3 px-4 sm:px-10 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200 flex-shrink-0">
        <img src={user.profile_picture} alt="" className="w-10 h-10 rounded-full object-cover shadow-sm" />
        <div className="min-w-0">
          <p className="font-semibold text-slate-800 text-sm sm:text-base truncate">{user.full_name}</p>
          <p className="text-xs text-gray-500 truncate">@{user.username}</p>
        </div>
      </div>

      {/* Messages Stream Content Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-50/50">
        <div className="space-y-3 max-w-4xl mx-auto flex flex-col">
          {Array.isArray(messages) && messages.length > 0 ? (
            messages
              .slice()
              .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
              .map((message, index) => {
                const isSentByMe = message.to_user_id === user._id;
                const textContent = message.text || message.content;

                return (
                  <div 
                    key={message._id || index} 
                    className={`flex flex-col ${!isSentByMe ? "items-start" : "items-end"} w-full`}
                  >
                    <div 
                      className={`px-3.5 py-2 text-sm shadow-sm border border-slate-100 rounded-xl bg-white text-black min-w-[60px] max-w-[75%] sm:max-w-md ${
                        !isSentByMe ? "rounded-bl-none" : "rounded-br-none"
                      }`}
                    >
                      {message.message_type === "image" && message.media_url && (
                        <img 
                          src={message.media_url} 
                          alt="Attachment" 
                          className="w-full max-h-64 object-cover rounded-lg mb-1.5"
                        />
                      )}
                      {textContent && (
                        <p className="break-words leading-normal whitespace-pre-wrap text-black font-normal">
                          {textContent}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
          ) : (
            <div className="text-center text-slate-400 py-10 text-sm">
              No messages found. Say hi!
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form Action Tray */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-3 pl-4 pr-1.5 py-1.5 bg-slate-50 w-full max-w-2xl mx-auto border border-slate-200 shadow-sm rounded-full">
          <input 
            type="text" 
            className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder-slate-400 py-1" 
            placeholder="Type a message..."
            onKeyDown={e => e.key === 'Enter' && sendMessage()} 
            onChange={e => setText(e.target.value)} 
            value={text} 
          />
          
          <label htmlFor="image" className="flex items-center justify-center flex-shrink-0">
            {image ? (
              <div className="relative">
                <img src={URL.createObjectURL(image)} alt="Preview" className="h-8 w-8 object-cover rounded-md border border-indigo-200" />
                <div onClick={() => setImage(null)} className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full size-3.5 flex items-center justify-center text-[9px] font-bold cursor-pointer">×</div>
              </div>
            ) : (
              <ImageIcon className="w-5 h-5 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors" />
            )}
            <input 
              type="file" 
              id="image" 
              accept="image/*" 
              hidden 
              onChange={(e) => e.target.files?.[0] && setImage(e.target.files[0])}
            />
          </label>

          <button 
            onClick={sendMessage} 
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95 active:scale-95 transition-all cursor-pointer text-white p-2 rounded-full flex-shrink-0 shadow-sm"
          >
            <SendHorizonal size={16} />
          </button>
        </div>
      </div>

    </div>
  );
};

export default ChatBox;