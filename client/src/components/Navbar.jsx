import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isUserDropdownVisible, setIsUserDropdownVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("");
  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);

  const dropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const notificationIconRef = useRef(null);
  const userIconRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
        try {
          setLoading(true);
          const response = await fetch("/api/notifs/notifications");
      
          if (!response.ok) {
            throw new Error("Failed to fetch notifications");
          }
      
          const data = await response.json();
          console.log(data); // Debug: Check the structure of the response
      
          // If the response is an object with a notifications array
          const notificationsArray = Array.isArray(data) ? data : data.notifications;
      
          if (!Array.isArray(notificationsArray)) {
            throw new Error("Unexpected response format: notifications should be an array");
          }
      
          setNotifications(notificationsArray);
      
          // Identify the latest notification
          const latestNotification = notificationsArray[0]; // Assuming the latest is at the beginning
      
          if (latestNotification) {
            toast.info(`${latestNotification.title}`);
          }
        } catch (err) {
          setError(err.message);
          toast.error(`Error: ${err.message}`);
        } finally {
          setLoading(false);
        }
      };
      
      fetchNotifications();
      
      
    const handleClickOutside = (event) => {
      if (
        !dropdownRef.current?.contains(event.target) &&
        !notificationIconRef.current?.contains(event.target) &&
        !userDropdownRef.current?.contains(event.target) &&
        !userIconRef.current?.contains(event.target)
      ) {
        setIsDropdownVisible(false);
        setIsUserDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo && userInfo.name) {
      setUserName(userInfo.name);
    }
  }, []);

  const handleNotificationClick = (message) => {
    setNotificationMessage(message);
    setIsDropdownVisible(false);
  };

  const handleUserDropdownClick = () => {
    setIsUserDropdownVisible((prev) => !prev);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await fetch(`/api/notis/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationId }), // Sending notificationId as the body
      });
  
      const data = await response.json();
  
      if (data.status) {
        // Successfully marked as read, update the UI accordingly
        console.log(data.message);
        // Optionally, update the notifications state to reflect the change (e.g., mark as read, remove, or update)
      } else {
        console.error('Failed to mark notification as read:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const handleLogout = async () => {
    try {
      toast.info("Logging out...");
      
      // Perform server-side logout
      const response = await fetch("/api/user/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to logout. Please try again.");
      }
  
      // Clear local storage after successful logout
      localStorage.removeItem("userInfo");
      
      // Redirect to login or home page
      window.location.href = "/"; // Adjust the URL as needed
    } catch (error) {
      toast.error(`Logout failed: ${error.message}`);
    }
  };

  const toggleNotifications = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  const toggleSideMenu = () => {
    setIsSideMenuVisible((prev) => !prev);
  };

  return (
    <nav style={styles.navbar}>
      <span style={styles.menuBar} onClick={toggleSideMenu}>&#9776;</span> 
      <div style={styles.logo}>
        <span style={styles.logoText}>TASKMASTER</span>
      </div>
      <div style={styles.icons}>
        {/* Notification Icon */}
        <span
          ref={notificationIconRef}
          style={styles.icon}
          onClick={toggleNotifications}
        >
          🔔
        </span>
        <ToastContainer />
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
        <div key={notification.id} style={styles.notificationItem}>
          <p
            style={styles.dropdownItem}
            onClick={() => handleNotificationClick(notification.title, notification.text)}
          >
            {notification.title}
            <br />
            {notification.text}
          </p>
          <button
            style={styles.markAsReadButton}
            onClick={() => handleMarkAsRead(notification.id)}
          >
            Mark as Read
          </button>
        </div>
      ))
    )}
  </div>
)}



        {/* User Icon */}
        <span
          ref={userIconRef}
          style={styles.icon}
          onClick={handleUserDropdownClick}
        >
          👤
        </span>
        {isUserDropdownVisible && (
          <div ref={userDropdownRef} style={styles.userDropdown}>
            <p style={styles.dropdownItem}>
              <strong>{userName || "Guest"}</strong>
            </p>
            <button style={styles.button}>Settings</button>
            <button style={styles.button} onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Popup Message */}
      {notificationMessage && (
        <div style={styles.popup}>
          <div style={styles.popupContent}>
            <h2>{notificationMessage}</h2>
            <button
              style={styles.button}
              onClick={() => setNotificationMessage("")}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {isSideMenuVisible && (
        <div style={styles.sideMenu}>
          <div>
            <div>
              <Link to="/LandingPage" style={styles.link}>
                Home
              </Link>
            </div>
            <div>
              <Link to="/Dashboard" style={styles.link}>
                Dashboard
              </Link>
            </div>
            <div>
              <Link to="/MyTasks" style={styles.link}>
                My Tasks
              </Link>
            </div>
            <div>
              <Link to="/MyTeams" style={styles.link}>
                My Teams
              </Link>
            </div>
            <div>
              <Link to="/Profile" style={styles.link}>
                Profile
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const styles = {
  navbar: {
    position: "fixed",
    width: "100%",
    height: "7%",
    display: "flex",
    justifyContent: "space-between",
    margin: "0",
    padding: "10px 20px",
    backgroundColor: "#003300", // Dark green color
    color: "#fff",
  },
  menuBar: {
    cursor: 'pointer',
  },
  logo: {
    display: "flex",
    alignItems: "center",
  },
  logoText: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#fff",
   
  },
  icons: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  icon: {
    fontSize: "20px",
    cursor: "pointer",
  },
  dropdown: {
    backgroundColor: "#fff",
    color: "black",
    padding: "10px",
    position: "absolute",
    top: "40px",
    right: "10px",
    borderRadius: "5px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    maxHeight: "200px",
    overflowY: "auto",
    zIndex: 1000,
  },
  userDropdown: {
    backgroundColor: "#fff",
    color: "black",
    padding: "10px",
    position: "absolute",
    top: "40px",
    right: "10px",
    borderRadius: "5px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
  },
  dropdownItem: {
    padding: "10px",
    cursor: "pointer",
    wordWrap: "breakWord",
    whiteSpace: "normal",
    color: "black",
  },

  markAsReadButton: {
    padding: '5px 10px',
    marginTop: '5px',
    backgroundColor: 'blue', // Green button color
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  
  button: {
    padding: "8px 16px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "8px",
    width: "100%",
    textAlign: "center",
  },
  popup: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
  sideMenu: {
    position: 'fixed',
    top: '5%',
    left: 0,
    width: '15%',
    height: '100%',
    backgroundColor: 'rgba(0, 48, 0)',
    color: '#fff',
    padding: '30px',
    zIndex: 1000,
  },
  link: {
    color: 'rgba(0, 48, 0)',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
    margin: '30px 0',
    borderRadius: '5px',
    backgroundColor:'#f7f7f7',
    
  },
};

export default Navbar;
