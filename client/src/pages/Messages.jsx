// import React from "react";
// import { dummyConnectionsData } from "../assets/assets";
// import { Eye, MessageSquare } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const Messages = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen md:ml-80 bg-slate-50">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
//         <div className="mb-8 pt-12 sm:pt-0">
//           <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
//             Messages
//           </h1>
//           <p className="text-slate-600">
//             Talk to your friends and connections
//           </p>
//         </div>

//         <div className="flex flex-col gap-3">
//           {dummyConnectionsData.map((user) => (
//             <div
//               key={user._id}
//               className="w-full max-w-xl flex items-start gap-4 p-4 sm:p-6 bg-white shadow rounded-md"
//             >
//               <img
//                 src={user.profile_picture}
//                 alt=""
//                 className="size-12 rounded-full object-cover flex-shrink-0"
//               />

//               <div className="flex-1 min-w-0">
//                 <p className="font-medium text-slate-700 truncate">
//                   {user.full_name}
//                 </p>
//                 <p className="text-slate-500 truncate">@{user.username}</p>
//                 <p className="text-sm text-gray-600 line-clamp-2">
//                   {user.bio}
//                 </p>
//               </div>

//               <div className="flex flex-col gap-2">
//                 <button
//                   onClick={() => navigate(`/messages/${user._id}`)}
//                   className="size-10 flex items-center justify-center rounded bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-95 transition cursor-pointer"
//                 >
//                   <MessageSquare className="w-4 h-4" />
//                 </button>

//                 <button
//                   onClick={() => navigate(`/profile/${user._id}`)}
//                   className="size-10 flex items-center justify-center rounded bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-95 transition cursor-pointer"
//                 >
//                   <Eye className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Messages;
import React from "react";
import { dummyConnectionsData } from "../assets/assets";
import { Eye, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Messages = () => {
  const navigate = useNavigate();

  return (
    // Flexbox structure that perfectly centers content on mobile screens, but respects standard grid flow on desktop
    <div className="min-h-screen md:ml-80 bg-slate-50 flex flex-col max-sm:items-center w-full overflow-x-hidden">
      {/* max-w-2xl limits the desktop width exactly to what is shown in your screenshot */}
      <div className="w-full max-w-2xl px-4 sm:px-8 py-20 sm:py-10 flex flex-col max-sm:items-center">
        
        {/* Title Block - Centered text ONLY on mobile screen layout breaks */}
        <div className="mb-8 max-sm:text-center w-full">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            Messages
          </h1>
          <p className="text-sm text-slate-600">
            Talk to your friends and connections
          </p>
        </div>

        {/* Message Cards Stack Container */}
        <div className="flex flex-col gap-4 w-full">
          {dummyConnectionsData.map((user) => (
            <div
              key={user._id}
              className="w-full flex items-start gap-4 p-4 sm:p-5 bg-white shadow-sm border border-slate-100 rounded-xl min-w-0"
            >
              {/* Profile Image */}
              <img
                src={user.profile_picture}
                alt=""
                className="size-12 rounded-full object-cover flex-shrink-0 border border-slate-100"
              />

              {/* User Identity Details */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 truncate text-sm sm:text-base">
                  {user.full_name}
                </p>
                <p className="text-xs sm:text-sm text-slate-400 truncate mb-1">@{user.username}</p>
                <p className="text-xs sm:text-sm text-slate-600 break-words leading-relaxed">
                  {user.bio}
                </p>
              </div>

              {/* Action Buttons Tray */}
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button
                  onClick={() => navigate(`/messages/${user._id}`)}
                  className="size-9 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-200/60 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 active:scale-95 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate(`/profile/${user._id}`)}
                  className="size-9 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-200/60 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 active:scale-95 transition-all cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Messages;