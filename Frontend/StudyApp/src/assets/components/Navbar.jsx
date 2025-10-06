import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "./css/navbar.css";
import { StudyContext } from "./StudyContext";
import ProfileMenu from "./ProfileMenu"; // import the profile menu
import axios from "axios";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const values = useContext(StudyContext);

  const handleLogout = async() => {
    // Clear current user and session
    const response =  await axios.post(
        "http://localhost:8081/user/logout",
        {},
        { withCredentials: true }
      );
      console.log(response)
    values.setCurrentUser(null);
    localStorage.removeItem("currentUser");
    console.log("Logged out!");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left Section */}
        <div className="navbar-left">
          <span className="navbar-logo">Study App</span>
          <div className="navbar-links">
            <Link to="/explore" className="navbar-link">
              Explore
            </Link>
            <Link to="/plans" className="navbar-link">
              Plans
            </Link>
            {values?.currentUser && (
              <>
                <Link to="/publisher-dashboard" className="navbar-link">
                  Publisher
                </Link>
                <Link to="/publisher-dashboard" className="navbar-link">
                  My Learnings
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Search Box */}
        <div className="navbar-search">
          <input type="text" placeholder="Search..." className="search-input" />
        </div>

        {/* Right Section */}
        {values.currentUser ? (
          <ProfileMenu onLogout={handleLogout} />
        ) : (
          <>
            <div className="navbar-actions">
              <Link to="/login" className="btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Sign Up
              </Link>
            </div>
            <div className="navbar-mobile-toggle">
              <button onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? "✖" : "☰"}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Mobile Menu */}
      {isOpen && !values.currentUser && (
        <div className="navbar-mobile-menu">
          <Link to="/explore" className="navbar-link">
            Explore
          </Link>
          <Link to="/plans" className="navbar-link">
            Plans
          </Link>
          <input type="text" placeholder="Search..." className="search-input" />
          <div className="mobile-actions">
            <Link to="/login" className="btn-outline">
              Login
            </Link>
            <Link to="/register" className="btn-primary">
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
