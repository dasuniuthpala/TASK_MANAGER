import React, { useEffect, useState } from 'react';

const PRODUCTIVITY_CARD = {
  container: "bg-purple-50 rounded-xl p-4 shadow-md mt-6",
  header: "flex justify-between items-center mb-2",
  label: "text-xs font-bold text-purple-700 tracking-widest",
  badge: "bg-fuchsia-500 text-white text-xs px-2 py-1 rounded-full font-semibold",
  barBg: "h-2 bg-fuchsia-200 rounded-full relative overflow-hidden",
  bar: "h-2 bg-fuchsia-500 rounded-full"
};

const Slidebar = ({ user, task }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const totalTasks = task?.length || 0
  const completedTasks = task?.filter((t) => t.completed).length || 0
  const productivity = totalTasks > 0
  ? Math.round((completedTasks/totalTasks) * 100)
  :0
  const username = user?.name || "User"
  const initial = username.charAt(0).toUpperCase()

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [mobileOpen]);

  const renderMenuItems = (isMobile = false) => (
    <ul className="space-y-2">
      {menuItems.map(({ text, path, icon }) => (
        <li key={text}>
          <NavLink
            to={path}
            className={({ isActive }) =>
              [
                LINK_CLASSES.base,
                isActive ? LINK_CLASSES.active : LINK_CLASSES.inactive,
                isMobile ? "justify-start" : "lg:justify-start"
              ].join(" ")
            }
            onClick={() => setMobileOpen(false)}
          >
            <span className={LINK_CLASSES.icon}>{icon}</span>
            {icon}
          </NavLink>
        </li>
      ))}
    </ul>
  );
  
  return (
    <aside className="hidden md:flex flex-col fixed top-0 left-0 h-full w-64 bg-white border-r border-purple-100 pt-20 z-20">
      <div className="flex flex-col items-center mt-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-2">
          {initial}
        </div>
        <div className="text-center">
          <div className="font-semibold text-gray-800 text-lg">Hey, {username}</div>
          <div className="text-xs text-fuchsia-600 font-medium mt-1">⚡ Let's crush some tasks!</div>
        </div>

        <div className='p4 space-y-6 overflow-y-auto flex-1'>
          <div className= {PRODUCTIVITY_CARD.container} >
            <div className= {PRODUCTIVITY_CARD.header} >
              <h3 className= {PRODUCTIVITY_CARD.label}>PRODUCTIVITY</h3>
              <span className= {PRODUCTIVITY_CARD.badge}>{productivity}%</span>
            </div>
            <div className= {PRODUCTIVITY_CARD.barBg}>
              <div className= {PRODUCTIVITY_CARD.bar}
              style={{width: `${productivity}%`}}>
                
              </div>
            </div>
          </div>

        </div>
      </div>
    </aside>
  );
};

export default Slidebar;