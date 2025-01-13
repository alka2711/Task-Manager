import React, { useState, useEffect, useRef } from "react";

// Navbar Component
const Navbar = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // Notification dropdown
  const [isUserDropdownVisible, setIsUserDropdownVisible] = useState(false); // User dropdown
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notifications, setNotifications] = useState([]); // State to store notifications
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const userName = "Alka"; // Set user's name here or fetch from API if needed

  const dropdownRef = useRef(null); // Reference for the notification dropdown
  const userDropdownRef = useRef(null); // Reference for the user dropdown
  const notificationIconRef = useRef(null); // Reference for the notification icon
  const userIconRef = useRef(null); // Reference for the user icon

  // Fetch notifications from the backend when the component mounts
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications"); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }
        const data = await response.json();
        setNotifications(data); // Set the fetched notifications
      } catch (err) {
        setError(err.message); // Set error message if the fetch fails
      } finally {
        setLoading(false); // Set loading to false after the fetch attempt
      }
    };

    fetchNotifications();

    // Event listener to close the dropdowns if clicked outside
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        notificationIconRef.current && !notificationIconRef.current.contains(event.target) &&
        userDropdownRef.current && !userDropdownRef.current.contains(event.target) &&
        userIconRef.current && !userIconRef.current.contains(event.target)
      ) {
        setIsDropdownVisible(false);
        setIsUserDropdownVisible(false); // Close user dropdown if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Handle notification click
  const handleNotificationClick = (message) => {
    setNotificationMessage(message);
    setIsDropdownVisible(false); // Close the dropdown after clicking a notification
  };

  // Handle user dropdown toggle
  const handleUserDropdownClick = () => {
    setIsUserDropdownVisible(!isUserDropdownVisible);
  };

  // Handle logout action
  const handleLogout = () => {
    alert("Logging out...");
    // You can handle logout logic here (e.g., clear session, redirect to login, etc.)
  };

  return (
    <nav style={styles.navbar}>
      {/* Logo text on the left */}
      <div style={styles.logo}>
        <span style={styles.logoText}>TASKMASTER</span>
      </div>

      {/* Search bar in the center */}
      <div style={styles.searchBar}>
        <input type="text" placeholder="Search..." style={styles.searchInput} />
      </div>

      {/* Icons on the right */}
      <div style={styles.icons}>
        <span
          ref={notificationIconRef} // Attach the reference to the notification icon
          style={styles.icon}
          onClick={() => setIsDropdownVisible(!isDropdownVisible)}
        >
          🔔
        </span>
        {/* Notification Dropdown */}
        {isDropdownVisible && (
          <div ref={dropdownRef} style={styles.dropdown}>
            {loading ? (
              <p>Loading notifications...</p>
            ) : error ? (
              <p>Error: {error}</p>
            ) : notifications.length === 0 ? (
              <p>No new notifications</p>
            ) : (
              notifications.map((notification) => (
                <p
                  key={notification.id}
                  style={styles.dropdownItem}
                  onClick={() => handleNotificationClick(notification.message)}
                >
                  {notification.message}
                </p>
              ))
            )}
          </div>
        )}

        {/* User Icon */}
        <span
          ref={userIconRef} // Attach the reference to the user icon
          style={styles.icon}
          onClick={handleUserDropdownClick}
        >
          👤
        </span>

        {/* User Profile Dropdown */}
        {isUserDropdownVisible && (
          <div ref={userDropdownRef} style={styles.userDropdown}>
            <p style={styles.dropdownItem}><strong>{userName}</strong></p> {/* Display user's name */}
            <button style={styles.button}>Settings</button> {/* Settings button */}
            <button style={styles.button} onClick={handleLogout}>Logout</button> {/* Logout button */}
          </div>
        )}
      </div>

      {/* Popup for notification */}
      {notificationMessage && (
        <div style={styles.popup}>
          <div style={styles.popupContent}>
            <h2>{notificationMessage}</h2>
            <button
              style={styles.button}
              onClick={() => setNotificationMessage("")} // Close the popup
            >
              Accept
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

// Inline styles for Navbar and Popup
const styles = {
  navbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 20px",
    backgroundColor: "#333",
    color: "#fff",
  },
  logo: {
    display: "flex",
    alignItems: "center",
  },
  logoText: {
    fontSize: "22px", // Increased font size for emphasis
    fontWeight: "bold",
    color: "#fff", // Ensure it contrasts with the background
  },
  searchBar: {
    flexGrow: 1,
    marginLeft: "20px",
    marginRight: "20px",
  },
  searchInput: {
    width: "90%",
    padding: "8px 12px",
    borderRadius: "20px",
    border: "1px solid #ccc",
  },
  icons: {
    display: "flex",
    alignItems: "center",
    gap: "30px",
  },
  icon: {
    fontSize: "20px",
    cursor: "pointer",
  },
  dropdown: {
    backgroundColor: "#fff",
    padding: "10px",
    position: "absolute",
    top: "40px", // Adjust according to your layout
    right: "10px",
    borderRadius: "5px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    maxHeight: "200px",
    overflowY: "auto",
  },
  userDropdown: {
    backgroundColor: "#fff",
    padding: "10px",
    position: "absolute",
    top: "40px", // Adjust according to your layout
    right: "10px",
    borderRadius: "5px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
  dropdownItem: {
    padding: "8px 10px",
    cursor: "pointer",
    borderBottom: "1px solid #ccc",
  },
  button: {
    padding: "8px 16px",
    backgroundColor: "#007BFF", // Button background color
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "8px", // Space between buttons
    width: "100%", // Full-width button
    textAlign: "center",
  },
  popup: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Backdrop
    width: "300px",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
  },
  popupContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
};

export default Navbar;
