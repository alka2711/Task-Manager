import React, { useState, useEffect, useRef } from "react";

const Navbar = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isUserDropdownVisible, setIsUserDropdownVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState(""); // State to store the user's name

  const dropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const notificationIconRef = useRef(null);
  const userIconRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications");
        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }
        const data = await response.json();
        setNotifications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        notificationIconRef.current && !notificationIconRef.current.contains(event.target) &&
        userDropdownRef.current && !userDropdownRef.current.contains(event.target) &&
        userIconRef.current && !userIconRef.current.contains(event.target)
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
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.name) {
      setUserName(userInfo.name);
    }
  }, []);

  const handleNotificationClick = (message) => {
    setNotificationMessage(message);
    setIsDropdownVisible(false);
  };

  const handleUserDropdownClick = () => {
    setIsUserDropdownVisible(!isUserDropdownVisible);
  };

  const handleLogout = () => {
    alert("Logging out...");
    localStorage.removeItem('userInfo');
    // You can handle logout logic here (e.g., clear session, redirect to login, etc.)
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>
        <span style={styles.logoText}>TASKMASTER</span>
      </div>
      <div style={styles.searchBar}>
        <input type="text" placeholder="Search..." style={styles.searchInput} />
      </div>
      <div style={styles.icons}>
        <span
          ref={notificationIconRef}
          style={styles.icon}
          onClick={() => setIsDropdownVisible(!isDropdownVisible)}
        >
          🔔
        </span>
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
        <span
          ref={userIconRef}
          style={styles.icon}
          onClick={handleUserDropdownClick}
        >
          👤
        </span>
        {isUserDropdownVisible && (
          <div ref={userDropdownRef} style={styles.userDropdown}>
            <p style={styles.dropdownItem}><strong>{userName}</strong></p>
            <button style={styles.button}>Settings</button>
            <button style={styles.button} onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
      {notificationMessage && (
        <div style={styles.popup}>
          <div style={styles.popupContent}>
            <h2>{notificationMessage}</h2>
            <button
              style={styles.button}
              onClick={() => setNotificationMessage("")}
            >
              Accept
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
    backgroundColor:"black",
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
    top: "40px",
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
    top: "40px",
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