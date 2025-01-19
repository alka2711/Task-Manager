import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isUserDropdownVisible, setIsUserDropdownVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("");

  const dropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const notificationIconRef = useRef(null);
  const userIconRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/notifications");

        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const data = await response.json();
        setNotifications(data);

        // Display a toast for each notification
        data.forEach((notification) => {
          toast.info(`New Notification: ${notification.message}`);
        });
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

  return (
    <nav style={styles.navbar}>
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
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 20px",
    backgroundColor: "#003300", // Dark green color
    color: "#fff",
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
    padding: "8px 10px",
    cursor: "pointer",
    borderBottom: "1px solid #ccc",
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
};

export default Navbar;
