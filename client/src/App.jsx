import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


import Navbar from "./components/Navbar/Navbar";


const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <main style={styles.mainContent}>
          <Routes>
            <Route path="/" element={<Homepage />} />
            {/* <Route path="/discussion" element={<DiscussionThread />} />
            <Route path="/discussion/new" element={<DiscussionForm />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

// Homepage component
const Homepage = () => {
  return (
    <div>
      <h1>Welcome to the Tasks Management App!</h1>
      <p>Use the navigation bar to explore more features, including discussions.</p>
    </div>
  );
};

// Inline styles for main content
const styles = {
  mainContent: {
    padding: "20px",
    textAlign: "center",
  },
};

export default App;
