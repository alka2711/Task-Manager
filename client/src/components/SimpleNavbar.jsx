import React from "react";

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>
        <span style={styles.logoText}>TASKMASTER</span>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "start",
    padding: "10px 20px",
    backgroundColor: "#003300",
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
};

export default Navbar;