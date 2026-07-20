import React, { useEffect, useState } from 'react'
import { dummyUserData } from '../assets/assets'
import { X, Image } from 'lucide-react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'

const CreatePost = () => {
  const [content, setContent] = React.useState("")
  const [images, setImages] = React.useState([])
  const [loading, setLoading] = React.useState(false)

  const user = useSelector((state)=> state.user.value);

  const handleSubmit = async () => {
    // Submit logic here
  }

  return (
    // Fixed: Added md:ml-80 and set up fluid padding configuration
    <div className="min-h-screen md:ml-80 bg-gradient-to-b from-slate-50 to-white overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-10">
        
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">Create Post</h1>
          <p className="text-sm text-slate-600">Share your thoughts and ideas with the world.</p>
        </div>
        
        {/* Form Container */}
        <div className="max-w-xl bg-white p-5 sm:p-8 rounded-xl shadow-sm border border-slate-100 space-y-4">
          
          {/* User Info Header */}
          <div className="flex items-center gap-3">
            <img src={user.profile_picture} alt="" className="w-11 h-11 rounded-full object-cover shadow-sm" />
            <div>
              <h2 className="font-semibold text-slate-800 text-sm sm:text-base">{user.full_name}</h2>
              <p className="text-xs sm:text-sm text-slate-400">@{user.username}</p>
            </div>
          </div>
          
          {/* Text Area */}
          <textarea 
            className="w-full resize-none min-h-[100px] mt-2 text-sm outline-none placeholder-gray-400 text-slate-700" 
            placeholder="What's on your mind?" 
            value={content} 
            onChange={(e) => setContent(e.target.value)}
          />
          
          {/* Images Preview Grid */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {images.map((image, i) => (
                <div key={i} className="relative group">
                  <img src={URL.createObjectURL(image)} className="h-20 w-20 object-cover rounded-lg border border-slate-100" alt="" />
                  <div 
                    onClick={() => setImages(images.filter((_, index) => index !== i))} 
                    className="absolute hidden group-hover:flex justify-center items-center top-0 right-0 bottom-0 left-0 bg-black/50 rounded-lg cursor-pointer transition-all"
                  >
                    <X className="w-5 h-5 text-white" />
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Bottom Interactive Tray */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <label htmlFor="images" className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition cursor-pointer p-1">
              <Image className="w-5 h-5" />
              <span className="text-xs font-medium hidden sm:inline">Add Photos</span>
            </label>
            <input 
              type="file" 
              id="images" 
              accept="image/*" 
              hidden 
              multiple 
              onChange={(e) => setImages([...images, ...Array.from(e.target.files)])} 
            />
            
            <button 
              disabled={loading} 
              onClick={() => toast.promise(handleSubmit(), {
                loading: "uploading...",
                success: <p>Post Added</p>,
                error: <p>Post Not Added</p>
              })} 
              className="text-xs sm:text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition-all text-white font-medium px-5 py-2 rounded-lg cursor-pointer shadow-sm"
            >
              Publish Post
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default CreatePost