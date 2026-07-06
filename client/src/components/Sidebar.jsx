import React from "react";
import { assets, dummyUserData } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import MenuItems from "./MenuItems";
import { CirclePlus, LogOut } from "lucide-react";
import { UserButton, useClerk } from "@clerk/clerk-react";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const user = dummyUserData;
  const { signOut } = useClerk();

  return (
    <div
      className={`fixed top-0 left-0 w-60 xl:w-72 h-screen bg-white border-r border-gray-200 flex flex-col z-50 transition-transform duration-300 ease-in-out
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}`}
    >
      <div className="flex-1 w-full">
        <img
          onClick={() => navigate("/")}
          src={assets.logo}
          alt="logo"
          className="w-26 ml-7 my-2 cursor-pointer"
        />

        <hr className="border-gray-300 mb-8" />

        <MenuItems setSidebarOpen={setSidebarOpen} />

        <Link
          to="/create-post"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center justify-center gap-2 py-2.5 mt-6 mx-6 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 transition text-white cursor-pointer"
        >
          <CirclePlus className="w-5 h-5" />
          Create Post
        </Link>
      </div>

      <div className="w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between">
        <div className="flex gap-2 items-center cursor-pointer">
          <UserButton />

          <div>
            <h1 className="text-sm font-medium">{user.full_name}</h1>
            <p className="text-xs text-gray-500">@{user.username}</p>
          </div>
        </div>

        <LogOut
          onClick={() => signOut()}
          className="w-4.5 text-gray-400 hover:text-gray-700 transition cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Sidebar;