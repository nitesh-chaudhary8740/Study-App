import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";
import "./css/ProfileMenu.css";
const ProfileMenu = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: "Profile", onClick: () => console.log("Profile clicked") },
    { label: "Cart", onClick: () => console.log("Cart clicked") },
    { label: "Notification", onClick: () => console.log("Notification clicked") },
    { label: "Help & Support", onClick: () => console.log("Help & Support clicked") },
    { label: "Logout", onClick: onLogout },
  ];

  return (
    <div className="profile-menu-container">
      <FaUserCircle
        className="profile-icon"
        onClick={() => setIsOpen((prev) => !prev)}
      />

      {/* Desktop dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="profile-dropdown"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {menuItems.map((item) => (
              <button
                key={item.label}
                className="menu-item"
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile slide-in panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="mobile-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="panel-header">
              <span>Menu</span>
              <button className="close-btn" onClick={() => setIsOpen(false)}>
                ✕
              </button>
            </div>
            <div className="panel-items">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  className="menu-item"
                  onClick={() => {
                    item.onClick();
                    setIsOpen(false);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileMenu;
