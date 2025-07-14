import React, { useState, useRef, useEffect } from "react";
import { MenuAlt2Icon } from '@heroicons/react/outline';
import '../style/d_style.css';
import { RiUser3Fill, RiLoginBoxFill } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';

const Header = ({ open, setopen }) => {
  // Dropdown logic
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const avatarRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    function handleClickOutside(event) {
      if (avatarRef.current && !avatarRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow d_header sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button className="md:hidden d_icon_btn" onClick={() => setopen(!open)}>
          <MenuAlt2Icon className="w-8 h-8 d_icon" />
        </button>
        <span className="text-xl font-bold tracking-widest d_logo hidden md:block">CROCKERY</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative z_custom_dropdown">
          <div
            className="w-10 h-10 rounded-full d_avatar flex items-center justify-center font-bold cursor-pointer"
            onClick={() => setDropdownOpen((open) => !open)}
            ref={avatarRef}
          >
            D
          </div>
          {dropdownOpen && (
            <div className="z_custom_dropdownMenu">
              <button
                className="z_custom_dropdownItem"
                onClick={() => { setDropdownOpen(false); /* handle profile click here */ }}
              >
                <RiUser3Fill className="text-lg" />
                Profile
              </button>
              <button
                className="z_custom_dropdownItem"
                onClick={() => { setDropdownOpen(false); navigate('/login'); }}
              >
                <RiLoginBoxFill className="text-lg" />
                Sign in
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;