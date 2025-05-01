import { Home, Search, MessageCircle, Calendar, Bell, Mail, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}) => {
  const [active, setActive] = useState('Home');
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Home', icon: <Home size={20} />, route: '/' },
    { name: 'Explore', icon: <Search size={20} />, route: '/explore' },
    { name: 'Discussions', icon: <MessageCircle size={20} />, route: '/discussion' },
    { name: 'Events', icon: <Calendar size={20} />, route: '/events' },
    { name: 'Notifications', icon: <Bell size={20} />, route: '/notification' },
    { name: 'Messages', icon: <Mail size={20} />, route: '/messages' },
    { name: 'Account', icon: <User size={20} />, route: '/account' },
  ];

  useEffect(() => {
    const currentItem = menuItems.find((item) => item.route === location.pathname);
    if (currentItem) {
      setActive(currentItem.name);
    }
  }, [location.pathname, menuItems]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-black text-white p-6 flex flex-col justify-between
          transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          transition-transform duration-300 ease-in-out z-50 md:translate-x-0 md:static md:flex-shrink-0`}
      >
        <div>
          <div className="flex justify-between items-center mb-10 md:hidden">
            <div className="text-3xl font-extrabold text-white">
              Better<span className="text-blue-500">X</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setActive(item.name);
                  setIsOpen(false);
                  navigate(item.route);
                }}
                className={`flex items-center gap-4 text-base font-medium px-3 py-2 rounded-lg relative transition
                  ${active === item.name
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
              >
                <span
                  className={`absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-md transition-all
                    ${active === item.name ? 'opacity-100' : 'opacity-0'}`}
                />
                {item.icon}
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="text-xs text-gray-600 mt-6">© Copyright 2025</div>
      </div>
    </>
  );
};

export default Sidebar;
