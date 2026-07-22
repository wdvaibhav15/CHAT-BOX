import React, { useEffect, useRef } from 'react' // Fixed: Single clean import for React and useEffect
import { Routes, Route, useLocation } from 'react-router-dom'
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
import toast, { Toaster } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { fetchUser } from './features/user/userSlice.js'
import { fetchConnections } from './features/connections/connectionSlice.js'
import { addMessage } from './features/messages/messagesSlice.js'
import Notification from './components/Notification.jsx'

const App = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { pathname } = useLocation();
  const pathnameRef = useRef(pathname);

  const dispatch = useDispatch();



  useEffect(() => {
  const fetchData = async () => {
    try {
      if (!user) return;

      const token = await getToken();

      if (!token) return;

      await dispatch(fetchUser(token));
      await dispatch(fetchConnections(token));
    } catch (error) {
      console.error(error);
    }
  };

  fetchData();
}, [user, getToken, dispatch]);

  useEffect(() => {
    pathnameRef.current = pathname
  }),[pathname]

  useEffect(() => {
    if(user){
      const eventSource = new EventSource(import.meta.env.VITE_BASEURL + '/api/message/' + user.id);

      eventSource.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (pathnameRef.current === '/messages/' + message.from_user_id._id) {
          dispatch(addMessage(message));
        }else{
          toast.custom((t)=>(
            <Notification t={t} message={message} />
          ), {position: 'bottom-right', duration: 5000})
        }
      }
      return () => eventSource.close()
    }
  },[user, dispatch])

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