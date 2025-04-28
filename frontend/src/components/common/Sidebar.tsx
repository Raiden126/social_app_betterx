import { useState, useEffect } from 'react';
import { Home, Search, MessageCircle, Calendar, Bell, Mail, User } from 'lucide-react';

const Sidebar = () => {
  const [active, setActive] = useState('Home');
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Home', icon: <Home size={20} /> },
    { name: 'Explore', icon: <Search size={20} /> },
    { name: 'Discussions', icon: <MessageCircle size={20} /> },
    { name: 'Events', icon: <Calendar size={20} /> },
    { name: 'Notifications', icon: <Bell size={20} /> },
    { name: 'Messages', icon: <Mail size={20} /> },
    { name: 'Account', icon: <User size={20} /> },
  ];

  // Prevent scrolling when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  return (
    <>
      {/* Mobile menu button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-md"
        onClick={() => setIsOpen(true)}
      >
        Menu
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-black text-white p-6 flex flex-col justify-between 
        transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        transition-transform duration-300 ease-in-out z-50 md:translate-x-0 md:static md:flex-shrink-0`}
      >
        <div>
          {/* Close button for mobile */}
          <div className="flex justify-between items-center mb-10 md:hidden">
            <div className="text-3xl font-extrabold text-white">
              Better<span className="text-blue-500">X</span>
            </div>
            <button 
              className="text-gray-400 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* Logo for desktop */}
          <div className="hidden md:flex text-3xl font-extrabold text-white mb-10">
            Better<span className="text-blue-500">X</span>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <button 
                key={item.name}
                onClick={() => {
                  setActive(item.name);
                  setIsOpen(false); // Close sidebar on mobile after clicking
                }}
                className={`flex items-center gap-4 text-base font-medium px-3 py-2 rounded-lg transition 
                  ${active === item.name 
                    ? 'bg-gray-800 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'}`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="text-xs text-gray-600 mt-6">
          © Copyright 2025
        </div>
      </div>
    </>
  );
};

export default Sidebar;
