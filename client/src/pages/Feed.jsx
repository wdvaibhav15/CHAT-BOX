import React, { useEffect } from 'react'
import { assets, dummyPostsData } from '../assets/assets';
import Loading from '../components/Loading';
import StoriesBar from '../components/StoriesBar';
import PostCard from '../components/PostCard';
const Feed = () => {

  const [feeds, setfeeds] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const fetchFeeds = async() => {
    setfeeds(dummyPostsData)
    setLoading(false)
  }

  useEffect(() => {
    fetchFeeds()
  },[])


  return !loading ? (
    <div className="h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8">
      {/* Stories and post list */}
      <div>
       <StoriesBar/>
       <div className="p-4 space-y-6">
        {feeds.map((post) => (
          <PostCard key={post._id} post={post}/>
        ))}
       </div>
      </div>
      {/* right sidebar */}
<div className="max-xl:hidden fixed right-15 top-10 w-80 ">
  <div className="bg-white text-xs p-4 rounded-md flex flex-col gap-2 shadow">
    <h3 className="text-slate-800 font-semibold">Sponsored</h3>

    <img
      src={assets.sponsored_img}
      className="w-full h-50 object-cover rounded-md"
      alt=""
    />

    <p className="text-slate-600">Email marketing</p>
    <p className="text-slate-400">
      Supercharge your marketing with a powerful, easy-to-use platform built for
      results.
    </p>
  </div>

  <h1 className="mt-4 font-semibold text-slate-800">Recent messages</h1>
</div>
    </div>
  ): <Loading/>
}

export default Feed
