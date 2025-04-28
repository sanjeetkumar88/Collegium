import React from 'react';

function UserCardSm({ logo, name, username, role }) {
  return (
    <div className="w-full max-w-[290px] h-[70px] bg-white rounded-2xl flex items-center justify-start shadow-md transition-transform duration-500 ease-in-out hover:cursor-pointer hover:scale-105">
      {/* Logo */}
      <div className="w-[50px] h-[50px] ml-[10px] rounded-[10px] bg-gray-200 flex justify-center items-center">
        <img src={logo} alt="logo" className="w-full h-full object-cover rounded-[10px]" />
      </div>

      <div className="w-[calc(100%-90px)] ml-[10px] text-black font-poppins">
        <div className="flex items-center justify-between">
          <p className="text-[16px] font-bold">{name}</p>
          <span className="text-[10px] text-gray-500">{role}</span>
        </div>
        <p className="text-[12px] font-light text-gray-600">@{username}</p>
      </div>
    </div>
  );
}

export default UserCardSm;
