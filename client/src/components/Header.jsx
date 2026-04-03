import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaUser, FaSignOutAlt, FaChevronDown, FaBars, FaTimes, FaSun, FaMoon, FaExclamationTriangle, FaRocket, FaCog, FaChartLine, FaBrain, FaCode, FaFileAlt } from "react-icons/fa"
import { useAuth } from "../context/AuthContext"
import { motion, AnimatePresence } from "framer-motion"
import React from "react"

export default function Header({ isDarkMode, toggleTheme }) {
  const { user, isLoggedIn, logout } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setShowLogoutConfirm(false)
    setIsDropdownOpen(false)
    await logout()
  }

  const getInitials = (name) => {
    if (!name) return "U"
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
  }

  const navLinks = [
    { name: "Home", path: "/", icon: null },
    ...(isLoggedIn ? [
      { name: "Dashboard", path: "/dashboard", icon: <FaChartLine className="w-3.5 h-3.5" /> },
      { name: "Mock Interview", path: "/interview/setup", icon: <FaRocket className="w-3.5 h-3.5" /> }, 
      { name: "Aptitude", path: "/aptitude", icon: <FaBrain className="w-3.5 h-3.5" /> }, 
      { name: "Coding", path: "/coding-practice", icon: <FaCode className="w-3.5 h-3.5" /> }, 
      { name: "ATS Scorer", path: "/resume-scorer", icon: <FaFileAlt className="w-3.5 h-3.5" /> }, 
    ] : [
      { name: "About", path: "/about", icon: null }
    ]),
    { name: "Resources", path: "/resources", icon: null }
  ]

  const NavLinks = () => (
    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-1">
      {navLinks.map((link) => (
        <Link 
          key={link.path}
          to={link.path} 
          onClick={() => setIsMobileMenuOpen(false)}
          className="group relative px-4 py-2.5 rounded-xl transition-all duration-300 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold flex items-center gap-2"
        >
          {link.icon}
          <span>{link.name}</span>
          <span className="absolute inset-0 rounded-xl bg-emerald-500/0 group-hover:bg-emerald-500/10 dark:group-hover:bg-emerald-500/10 transition-colors duration-300" />
        </Link>
      ))}
    </div>
  )

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "backdrop-blur-xl bg-white/90 dark:bg-[#0f172a]/90 shadow-lg shadow-slate-200/50 dark:shadow-black/50" 
          : "bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md"
      } border-b ${scrolled ? "border-slate-300/50 dark:border-white/10" : "border-slate-200/30 dark:border-white/5"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo Section - Enhanced */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <motion.div 
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="relative p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg shadow-emerald-500/30 group-hover:shadow-xl group-hover:shadow-emerald-500/40"
                >
                  <img src="/lar.png" alt="Laar AI" className="w-7 h-7 invert" />
                  <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
                <div>
                  <span className="text-2xl font-black bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent tracking-tight">
                    Laar AI
                  </span>
                  <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 -mt-1 tracking-wider">
                    INTERVIEW PREP
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              <NavLinks />
              
              {/* Divider */}
              <div className="h-8 w-[2px] bg-gradient-to-b from-transparent via-slate-300 dark:via-white/10 to-transparent mx-3" />
              
              {/* Theme Toggle - Enhanced */}
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="relative p-3 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border border-slate-300 dark:border-slate-700 transition-all overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/0 to-amber-500/0 group-hover:from-amber-400/20 group-hover:to-amber-500/20 dark:group-hover:from-blue-400/20 dark:group-hover:to-blue-500/20 transition-all duration-300" />
                <motion.div
                  initial={false}
                  animate={{ rotate: isDarkMode ? 180 : 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="relative"
                >
                  {isDarkMode ? (
                    <FaSun className="text-amber-400 text-lg" />
                  ) : (
                    <FaMoon className="text-slate-600 text-lg" />
                  )}
                </motion.div>
              </motion.button>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                {isMobileMenuOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
              </button>

              {!isLoggedIn ? (
                <div className="hidden md:flex items-center space-x-3">
                  <Link 
                    to="/login" 
                    className="px-6 py-2.5 text-slate-700 dark:text-slate-300 font-bold hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Log in
                  </Link>
                  <Link 
                    to="/signup" 
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all"
                  >
                    Sign up
                  </Link>
                </div>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 p-1.5 pr-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center overflow-hidden shadow-md shadow-emerald-500/30">
                      {user?.avatar || user?.photoURL ? (
                        <img src={user.avatar || user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white font-bold text-sm">{getInitials(user?.name || user?.displayName)}</span>
                      )}
                    </div>
                    <motion.div
                      animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FaChevronDown className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 py-2 z-50 overflow-hidden"
                      >
                        {/* Gradient Header */}
                        <div className="relative px-6 py-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/5 dark:to-teal-500/5 border-b border-slate-200 dark:border-slate-700">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                              {user?.avatar || user?.photoURL ? (
                                <img src={user.avatar || user.photoURL} alt="Profile" className="w-full h-full object-cover rounded-xl" />
                              ) : (
                                <span className="text-white font-bold">{getInitials(user?.name || user?.displayName)}</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-black text-slate-900 dark:text-white truncate">
                                {user?.name || user?.displayName}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {user?.email}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Menu Items */}
                        <div className="py-2">
                          <Link 
                            to="/profile" 
                            className="flex items-center gap-3 px-6 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all group" 
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 transition-colors">
                              <FaUser className="w-4 h-4" />
                            </div>
                            <span>My Profile</span>
                          </Link>

                          <Link 
                            to="/dashboard" 
                            className="flex items-center gap-3 px-6 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400 transition-all group" 
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-violet-100 dark:group-hover:bg-violet-500/20 transition-colors">
                              <FaChartLine className="w-4 h-4" />
                            </div>
                            <span>Dashboard</span>
                          </Link>

                          <Link 
                            to="/settings" 
                            className="flex items-center gap-3 px-6 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 transition-all group" 
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-amber-100 dark:group-hover:bg-amber-500/20 transition-colors">
                              <FaCog className="w-4 h-4" />
                            </div>
                            <span>Settings</span>
                          </Link>
                        </div>

                        {/* Logout Button */}
                        <div className="border-t border-slate-200 dark:border-slate-700 pt-2 mt-2">
                          <button 
                            onClick={() => {
                              setShowLogoutConfirm(true);
                              setIsDropdownOpen(false);
                            }} 
                            className="w-full flex items-center gap-3 px-6 py-3 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center group-hover:bg-red-100 dark:group-hover:bg-red-500/20 transition-colors">
                              <FaSignOutAlt className="w-4 h-4" />
                            </div>
                            <span>Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-20 left-0 right-0 z-40 md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-xl"
          >
            <div className="px-4 py-6 space-y-2">
              <NavLinks />
              
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <button 
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  <span>Theme</span>
                  <div className="flex items-center gap-2">
                    {isDarkMode ? <FaSun className="text-amber-400" /> : <FaMoon />}
                  </div>
                </button>
              </div>

              {!isLoggedIn && (
                <div className="pt-4 space-y-2 border-t border-slate-200 dark:border-slate-700">
                  <Link 
                    to="/login" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center px-6 py-3 text-slate-700 dark:text-slate-300 font-bold rounded-xl bg-slate-100 dark:bg-slate-800"
                  >
                    Log in
                  </Link>
                  <Link 
                    to="/signup" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold shadow-lg"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- LOGOUT CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute inset-0 bg-slate-900/70 backdrop-blur-md"
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-700"
            >
              {/* Icon */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/30"
              >
                <FaExclamationTriangle className="text-white text-3xl" />
              </motion.div>

              {/* Content */}
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 text-center">
                Confirm Logout
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-center mb-8 leading-relaxed">
                Are you sure you want to log out? You'll need to sign in again to access your account.
              </p>
              
              {/* Buttons */}
              <div className="flex flex-col gap-3">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-bold shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all"
                >
                  Yes, Log me out
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowLogoutConfirm(false)}
                  className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}