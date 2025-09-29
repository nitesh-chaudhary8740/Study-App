import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "../css/navbar.css";
import { StudyContext } from "./StudyContext";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const values = useContext(StudyContext);

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
          { values?.currentUser && <>
            <Link to="/publisher-dashboard" className="navbar-link">
              Publisher
            </Link>
            <Link to="/publisher-dashboard" className="navbar-link">
              My Learnings
            </Link> 
          </> 
            }
          </div>
        </div>

        {/* Search Box */}
        <div className="navbar-search">
          <input type="text" placeholder="Search..." className="search-input" />
        </div>

        {/* Right Section */}
        { values.currentUser ? (
          <span className="profile-icon">{values.currentProvider?values.currentProvider.fullName.charAt(0):
          values.currentUser.fullName.charAt(0)}</span>
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
              {/* this class element get visible through the css media query */}
              <button onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? "✖" : "☰"}
              </button>
            </div>
          </>
        )}

        {/* Mobile Menu Button */}
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="navbar-mobile-menu">
          <Link to="/explore" className="navbar-link">
            Explore
          </Link>
          <Link to="/plans" className="navbar-link">
            Plans
          </Link>
          <Link to="/publisher-dashboard" className="navbar-link">
            Publisher
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
