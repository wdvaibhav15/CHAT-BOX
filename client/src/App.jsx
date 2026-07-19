// import React from 'react'
// import {  Routes, Route } from 'react-router-dom'
// import Feed from './pages/Feed'
// import Messages from './pages/Messages'
// import ChatBox from './pages/ChatBox'
// import Connections from './pages/Connections'
// import Discover from './pages/Discover'
// import Profile from './pages/Profile'
// import CreatePost from './pages/CreatePost'
// import Login from './pages/Login'
// import { useUser, useAuth } from '@clerk/clerk-react'
// import Layout from './pages/Layout' 
// import { Toaster } from 'react-hot-toast'
// import { useEffect } from 'react'

// const App = () => {
  
//   const { user } = useUser();
//   const {getToken} = useAuth();

//   useEffect(()=>{
//     if(user){
//       getToken().then((token)=> console.log(token))
//     }
//   }, [user])

//   return (
//     <>
//     <Toaster />
//     <Routes>
//       <Route path="/" element={!user ? <Login /> : <Layout />}>
//         <Route index element={<Feed />} />
//         <Route path="messages" element={<Messages />} />
//         <Route path='messages/:userId' element={<ChatBox />} />
//         <Route path="connections" element={<Connections />} />
//         <Route path="discover" element={<Discover />} />
//         <Route path="profile" element={<Profile />} />
//         <Route path="profile/:profileId" element={<Profile />} />
//         <Route path='create-post' element={<CreatePost />} />

//       </Route>
//     </Routes>
//     </>
//   )
// }

// export default App
import React, { useEffect } from 'react' // Fixed: Single clean import for React and useEffect
import { Routes, Route } from 'react-router-dom'
import Feed from './pages/Feed'
import Messages from './pages/Messages'
import ChatBox from './pages/ChatBox'
import Connections from './pages/Connections'
import Discover from './pages/Discover'
import Profile from './pages/Profile'
import CreatePost from './pages/CreatePost'
import Login from './pages/Login'
import { useUser, useAuth } from '@clerk/clerk-react'
import Layout from './pages/Layout' 
import { Toaster } from 'react-hot-toast'

const App = () => {
  const { user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await getToken();
        console.log("Your Auth Token:", token);
        // TODO: You can store this in a global state, context, or configure your Axios headers here
      } catch (error) {
        console.error("Error retrieving token:", error);
      }
    };

    if (user) {
      fetchToken();
    }
  }, [user, getToken]); // Fixed: Added missing hook dependencies

  return (
    <>
      <Toaster />
      <Routes>
        {/* Protected layout mechanism: If not logged in, drops to <Login /> */}
        <Route path="/" element={!user ? <Login /> : <Layout />}>
          <Route index element={<Feed />} />
          <Route path="messages" element={<Messages />} />
          <Route path='messages/:userId' element={<ChatBox />} />
          <Route path="connections" element={<Connections />} />
          <Route path="discover" element={<Discover />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:profileId" element={<Profile />} />
          <Route path='create-post' element={<CreatePost />} />
        </Route>
      </Routes>
    </>
  )
}

export default App