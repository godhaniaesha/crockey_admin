import React from 'react';
import { MenuAlt2Icon } from '@heroicons/react/outline';
import '../style/d_style.css';

const Header = ({ open, setopen }) => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow d_header sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button className="md:hidden d_icon_btn" onClick={() => setopen(!open)}>
          <MenuAlt2Icon className="w-8 h-8 d_icon" />
        </button>
        <span className="text-xl font-bold tracking-widest d_logo hidden md:block">CROCKERY</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full d_avatar flex items-center justify-center font-bold">D</div>
      </div>
    </header>
  );
};

export default Header;