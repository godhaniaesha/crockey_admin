import React, { useState, useRef, useEffect } from "react";
import { MenuAlt2Icon } from '@heroicons/react/outline';
import '../style/d_style.css';
import { RiUser3Fill, RiLoginBoxFill } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slice/auth.slice'; // adjust path if needed

const Header = ({ open, setopen }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  // Dropdown logic
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const avatarRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    function handleClickOutside(event) {
      // Check if click is outside both avatar and dropdown menu
      if (avatarRef.current && !avatarRef.current.contains(event.target) && 
          dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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

  const handleSignIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
  
    setDropdownOpen(false);
    navigate('/login');
  };

  const handleProfile = (e) => {
    e.preventDefault();
    e.stopPropagation();
 
    setDropdownOpen(false);
    navigate('/profile');
  };

  const handleLogout = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(logout());
    localStorage.removeItem('token');
    setDropdownOpen(false);
    navigate('/login');
  };


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
            <div className="z_custom_dropdownMenu" ref={dropdownRef}>
            
              
              <button
                type="button"
                className="z_custom_dropdownItem"
                onClick={handleProfile}
                onMouseDown={(e) => e.preventDefault()}
                style={{ pointerEvents: 'auto' }}
              >
                <RiUser3Fill className="text-lg" />
                Profile
              </button>
              {isAuthenticated ? (
                <button
                  type="button"
                  className="z_custom_dropdownItem"
                  onClick={handleLogout}
                  onMouseDown={(e) => e.preventDefault()}
                  style={{ pointerEvents: 'auto' }}
                >
                  <RiLoginBoxFill className="text-lg" />
                  Logout
                </button>
              ) : (
              <button
                type="button"
                className="z_custom_dropdownItem"
                onClick={handleSignIn}
                onMouseDown={(e) => e.preventDefault()}
                style={{ pointerEvents: 'auto' }}
              >
                <RiLoginBoxFill className="text-lg" />
                Sign in
              </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;