import React, { useRef, useState, useEffect } from 'react'
import { dummyMessagesData, dummyUserData } from '../assets/assets';
import { ImageIcon, SendHorizonal } from 'lucide-react';

const ChatBox = () => {
  const messages = dummyMessagesData;
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(dummyUserData);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!text.trim() && !image) return;
    // Sending logic here
    setText('');
    setImage(null);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return user && (
    // Fixed: Added md:ml-80 to separate from the fixed navigation sidebar
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
        <div className="space-y-4 max-w-4xl mx-auto flex flex-col">
          {messages
            .toSorted((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            .map((message, index) => (
              <div 
                key={index} 
                className={`flex flex-col ${message.to_user_id !== user._id ? "items-start" : "items-end"} w-full`}
              >
                <div 
                  className={`p-3 text-sm max-w-[75%] sm:max-w-md shadow-sm border ${
                    message.to_user_id !== user._id 
                      ? "bg-white text-slate-700 border-slate-100 rounded-2xl rounded-bl-none" 
                      : "bg-indigo-600 text-white border-indigo-600 rounded-2xl rounded-br-none"
                  }`}
                >
                  {message.message_type === "image" && (
                    <img 
                      src={message.media_url} 
                      alt="Media attachment" 
                      className="w-full max-h-64 object-cover rounded-xl mb-1.5 shadow-inner"
                    />
                  )}
                  {message.text && <p className="break-words leading-relaxed">{message.text}</p>}
                </div>
              </div>
            ))
          }
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
  )
}

export default ChatBox