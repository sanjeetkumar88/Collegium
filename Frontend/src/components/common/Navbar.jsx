import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaChevronDown,
  FaChevronUp,
  FaUserCircle,
  FaBars,
  FaTimes,
  FaHome,
  FaBook,
  FaUsers,
  FaInfoCircle,
  FaFolderOpen,
  FaProjectDiagram,
  FaCog,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { name: "Home", to: "/", icon: <FaHome /> },
  { name: "Events", to: "/events", icon: <FaBook /> },
  {
    name: "Resources",
    key: "resources",
    dropdown: true,
    icon: <FaFolderOpen />,
    items: [
      { name: "PYQ's", type: "pyq", description: "Previous Year papers of AKTU University" },
      { name: "Lectures", type: "lecture", description: "Online lectures sorted for you subject-wise" },
      { name: "Short Notes", type: "short-note", description: "Short notes for quick revision" },
      { name: "Question Bank", type: "question-bank", description: "Subject-wise question banks" },
      { name: "Notes", type: "notes", description: "Chapter-wise notes for each year" },
      { name: "Quantum", type: "quantum", description: "Subject-wise quantum" },
    ],
  },
  { name: "Club", to: "/community", icon: <FaUsers /> },
  { name: "About", to: "/about", icon: <FaInfoCircle /> },
  {
    name: "Projects",
    dropdown: true,
    key: "projects",
    icon: <FaProjectDiagram />,
    items: [
      { name: "Create Project", type: "create-project", description: "Showcase your work by adding a new project" },
      { name: "Find Project Partner", type: "find-project-partner", description: "Collaborate with peers on exciting projects" },
      { name: "Explore Projects", type: "explore-projects", description: "See what others have built and get inspired" },
    ],
  },
];

function Navbar() {
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isProjectOpen, setIsProjectOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const profileRef = useRef(null);
  const resourcesRef = useRef(null);
  const projectRef = useRef(null);

  const handleResourceClick = (type) => {
    navigate(`/resources?type=${type}`);
    setTimeout(() => {
      setIsResourcesOpen(false);
      setIsMobileMenuOpen(false);
    }, 100);
  };

  const handleProjectClick = (type) => {
    navigate(`/project/${type}`);
    setTimeout(() => {
      setIsProjectOpen(false);
      setIsMobileMenuOpen(false);
    }, 100);
  };

  const handleLogout = () => {
    auth.logout();
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setIsProfileOpen(false);
      if (resourcesRef.current && !resourcesRef.current.contains(e.target)) setIsResourcesOpen(false);
      if (projectRef.current && !projectRef.current.contains(e.target)) setIsProjectOpen(false);
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const location = useLocation();
  const isHomePage = location.pathname === "/";
  // Always show "Glass" look if not on Home or if scrolled
  // Actually, since our new Hero is light, we always want dark text/glassy feel.
  const shouldShowGlass = true; 

  return (
    <header 
      className={`fixed top-0 left-0 right-0 p-4 transition-all duration-500 z-[100] ${
        scrolled 
          ? "bg-white/70 backdrop-blur-xl border-b border-slate-100 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)]" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
        <div 
          onClick={() => navigate("/")}
          className="text-2xl font-black tracking-tighter text-slate-900 cursor-pointer flex items-center gap-2 group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">C</div>
          <span className="hidden sm:block">COLLEGIUM</span>
        </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <button 
          onClick={toggleMobileMenu} 
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-900 hover:bg-blue-50 hover:text-blue-600 transition-all"
        >
          {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex space-x-1 items-center bg-slate-50/50 backdrop-blur-md p-1 rounded-2xl border border-slate-100">
        {navItems.map((item, index) =>
          item.dropdown ? (
            <div
              key={index}
              ref={item.key === "resources" ? resourcesRef : projectRef}
              className="relative"
              onMouseEnter={() =>
                item.key === "resources"
                  ? setIsResourcesOpen(true)
                  : setIsProjectOpen(true)
              }
              onMouseLeave={() =>
                item.key === "resources"
                  ? setIsResourcesOpen(false)
                  : setIsProjectOpen(false)
              }
            >
              <div className={`px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                (item.key === "resources" ? isResourcesOpen : isProjectOpen) 
                  ? "bg-white text-blue-600 shadow-sm" 
                  : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
              }`}>
                {item.name}
                <FaChevronDown className={`w-2.5 transition-transform duration-300 ${
                  (item.key === "resources" ? isResourcesOpen : isProjectOpen) ? "rotate-180" : ""
                }`} />
              </div>
              
              {/* Dropdown Menu */}
              <div className={`absolute top-full left-0 mt-2 w-80 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-4 transition-all duration-300 origin-top ${
                (item.key === "resources" ? isResourcesOpen : isProjectOpen) 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-4 pointer-events-none"
              }`}>
                <div className="grid grid-cols-1 gap-2">
                  {item.items.map((option, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        item.key === "resources"
                          ? handleResourceClick(option.type)
                          : handleProjectClick(option.type)
                      }
                      className="group flex flex-col p-4 rounded-2xl hover:bg-blue-50 transition-all text-left"
                    >
                      <h3 className="font-black text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                        {option.name}
                      </h3>
                      <p className="text-[10px] font-medium text-slate-400 leading-relaxed mt-1">
                        {option.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <Link
              key={index}
              to={item.to}
              className={`px-5 py-2.5 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                location.pathname === item.to 
                  ? "bg-white text-blue-600 shadow-sm" 
                  : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              {item.name}
            </Link>
          )
        )}
      </nav>

      {/* Profile Menu (Desktop) */}
      <div className="hidden lg:block relative" ref={profileRef}>
        {!auth.authUser ? (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-8 py-3 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10"
              >
                Sign In
              </Link>
            </div>
        ) : (
          <div
            className="relative cursor-pointer group"
            onClick={() => setIsProfileOpen((prev) => !prev)}
          >
            <div className="w-11 h-11 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all border border-slate-100 overflow-hidden shadow-sm">
               {auth.authUser.photoURL ? (
                 <img src={auth.authUser.photoURL} alt="profile" className="w-full h-full object-cover" />
               ) : (
                 <FaUserCircle size={24} />
               )}
            </div>
            
            {/* Profile Dropdown */}
            <div className={`absolute right-0 mt-3 w-64 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-3 transition-all duration-300 origin-top-right ${
              isProfileOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
            }`}>
              <div className="p-4 border-b border-slate-50 mb-2">
                 <div className="font-black text-slate-900 text-sm truncate">{auth.authUser.displayName || auth.authUser.email}</div>
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{auth.authUser.role || 'Member'}</div>
              </div>
              <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all">
                <FaUserCircle size={14} /> Profile
              </Link>
              <Link to="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all">
                <FaCog size={14} /> Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all"
              >
                <FaTimes size={14} /> Logout
              </button>
            </div>
          </div>
        )}
      </div>
      </div>

      {/* Mobile Sidebar Menu */}
      <div className={`fixed inset-0 bg-slate-900/20 backdrop-blur-md z-[-1] lg:hidden transition-all duration-500 ${
        isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`} onClick={() => setIsMobileMenuOpen(false)} />
      
      <div className={`fixed top-0 left-0 w-80 h-full bg-white shadow-2xl z-[200] lg:hidden transition-transform duration-500 ease-out p-8 ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex items-center justify-between mb-12">
           <div className="text-xl font-black tracking-tighter text-slate-900">COLLEGIUM</div>
           <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-slate-900"><FaTimes size={20} /></button>
        </div>

        <nav className="flex flex-col space-y-2">
          {navItems.map((item, index) => (
            <div key={index} className="flex flex-col">
              {item.dropdown ? (
                <>
                  <button 
                    onClick={() => item.key === "resources" ? setIsResourcesOpen(!isResourcesOpen) : setIsProjectOpen(!isProjectOpen)}
                    className="flex items-center justify-between px-4 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50"
                  >
                    <span className="flex items-center gap-3">{item.icon} {item.name}</span>
                    <FaChevronDown className={`w-3 transition-transform ${ (item.key === "resources" ? isResourcesOpen : isProjectOpen) ? "rotate-180" : "" }`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${ (item.key === "resources" ? isResourcesOpen : isProjectOpen) ? "max-h-[500px] opacity-100 mt-2 ml-4" : "max-h-0 opacity-0" }`}>
                     {item.items.map((opt, i) => (
                       <button 
                        key={i} 
                        onClick={() => item.key === "resources" ? handleResourceClick(opt.type) : handleProjectClick(opt.type)}
                        className="w-full text-left p-4 rounded-xl hover:bg-blue-50 transition-all"
                       >
                         <h4 className="text-[10px] font-black uppercase text-slate-900">{opt.name}</h4>
                       </button>
                     ))}
                  </div>
                </>
              ) : (
                <Link
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                    location.pathname === item.to ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {item.icon} {item.name}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="absolute bottom-8 left-8 right-8">
           {!auth.authUser ? (
             <Link
               to="/login"
               onClick={() => setIsMobileMenuOpen(false)}
               className="w-full block text-center py-4 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl"
             >
               Sign In
             </Link>
           ) : (
             <button
               onClick={handleLogout}
               className="w-full py-4 bg-red-50 text-red-600 font-black text-[10px] uppercase tracking-widest rounded-2xl"
             >
               Logout
             </button>
           )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
