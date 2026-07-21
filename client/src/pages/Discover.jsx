import React, { useEffect, useState } from 'react'
import { dummyConnectionsData } from '../assets/assets'
import { Search } from 'lucide-react'
import UserCard from '../components/UserCard'
import Loading from '../components/Loading'
import api from '../api/axios'
import { useAuth } from '@clerk/clerk-react'
import { useDispatch } from 'react-redux'
import { fetchUser } from '../features/user/userSlice.js'

const Discover = () => {

  const dispatch = useDispatch();

  const [input, setInput] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false) 
  const { getToken } = useAuth()

  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      try {
        setUsers([])
        setLoading(true)
        const { data } = await api.post("/api/user/discover", {input}, {
          headers: {
            Authorization: `Bearer ${await getToken()}`
          }
        })
        data.success ? setUsers(data.users) : toast.error(data.message)
        setLoading(false)
        setInput('')
        
      } catch (error) {
        toast.error(error.message)
      }
      setLoading(false)
      // setUsers([])
      // setLoading(true)
      // setTimeout(() => {
      //   const filtered = dummyConnectionsData.filter(user => 
      //     user.full_name.toLowerCase().includes(input.toLowerCase()) ||
      //     user.username.toLowerCase().includes(input.toLowerCase()) ||
      //     user.bio?.toLowerCase().includes(input.toLowerCase())
      //   )
      //   setUsers(filtered)
      //   setLoading(false)
      // }, 1000)
    }
  }

  useEffect(() => {
    getToken().then(token => {
      dispatch(fetchUser(token))
    })
  },[])

  return (
    // Uses normal layout on desktop, but centers everything natively on mobile screen views
    <div className="min-h-screen md:ml-80 bg-gradient-to-b from-slate-50 to-white overflow-x-hidden flex flex-col max-sm:items-center">
      <div className="w-full max-w-6xl px-4 sm:px-8 py-20 sm:py-10 flex flex-col max-sm:items-center">
        
        {/* Title - Centered on mobile only via max-sm:text-center */}
        <div className="mb-8 max-sm:text-center w-full">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">Discover People</h1>
          <p className="text-sm text-slate-600">Find new people and connections.</p>
        </div>

        {/* Search bar Container */}
        <div className="w-full mb-8 shadow-sm rounded-xl border border-slate-200/60 bg-white p-4 sm:p-6 max-w-xl sm:max-w-none">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              onKeyUp={handleSearch}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              type="text"
              placeholder="Search people by name, username, bio or location..." 
              className="pl-12 pr-4 py-3 w-full border border-gray-200 rounded-xl max-sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50/50" 
            />
          </div>
        </div>

        {/* Main Content Feed Area */}
        {loading ? (
          <div className="flex items-center justify-center w-full min-h-[50vh]">
            <Loading height="100px" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No people found matching your search.
          </div>
        ) : (
          /* Grid centers items on small devices using max-sm:justify-items-center */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-sm:justify-items-center">
            {users.map((user) => (
              <UserCard key={user._id} user={user} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default Discover