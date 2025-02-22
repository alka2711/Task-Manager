import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar'; // Import the Navbar component
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const [showJoinTeamPopup, setShowJoinTeamPopup] = useState(false);
    const [showCreateTeamPopup, setShowCreateTeamPopup] = useState(false);
    const [teamName, setTeamName] = useState('');
    const [teamMembers, setTeamMembers] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleJoinTeamClick = () => {
        setShowJoinTeamPopup(true);
    };

    const handleCreateTeamClick = () => {
        setShowCreateTeamPopup(true);
    };

    const handleClosePopup = () => {
        setShowJoinTeamPopup(false);
        setShowCreateTeamPopup(false);
        setErrorMessage('');
        setSuccessMessage('');
    };

    const handleJoinTeam = async () => {
        try {
            const response = await axios.post('/api/team/join', {
                teamName
            }, {
                withCredentials: true
            });

            setSuccessMessage(response.data.message);
            setTimeout(() => {
                handleClosePopup();
                navigate('/MyTeams');
            }, 2000);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Failed to join team');
        }
    };

    const handleCreateTeam = async () => {
        try {
            const response = await axios.post('/api/team/create', {
                name: teamName,
                userEmails: teamMembers
            }, {
                withCredentials: true
            });

            setSuccessMessage(response.data.message);
            setTimeout(() => {
                handleClosePopup();
                navigate('/MyTeams');
            }, 2000);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Failed to create team');
        }
    };

    return (
        <div style={styles.landingContainer}>
            <div style={styles.navbarContainer}>
                <Navbar /> {/* Include the Navbar at the top */}
            </div>
            <div style={styles.sectionsContainer}>
                <div style={styles.section}>
                    <div style={styles.content}>
                        <h1 style={styles.heading}>Exclusive Space</h1>
                        <p style={styles.paragraph}>Manage your tasks and assign tasks to up to one user, working together to achieve your goals.</p>

                        <Link to="/ESMyTasks" style={styles.ctaButton}>
                            Get Started
                        </Link>
                    </div>
                </div>

                <div style={styles.section}>
                    <div style={styles.content}>
                        <h1 style={styles.heading}>Collaborative Space</h1>
                        <p style={styles.paragraph}>Collaborate with others and achieve goals together</p>
                        <div style={styles.buttonContainer}>
                            <button onClick={handleJoinTeamClick} style={styles.ctaButton}>
                                Join a Team
                            </button>
                            <button onClick={handleCreateTeamClick} style={styles.ctaButton}>
                                Create a New Team
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showJoinTeamPopup && (
                <div style={styles.popupOverlay}>
                    <div style={styles.popup}>
                        <h2>Enter Details</h2>
                        <input
                            type="text"
                            placeholder="Enter team name"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            style={styles.input}
                        />
                        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
                        {successMessage && <p style={styles.success}>{successMessage}</p>}
                        <button onClick={handleJoinTeam} style={styles.popupButton}>
                            Join
                        </button>
                        <button onClick={handleClosePopup} style={styles.popupButton}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {showCreateTeamPopup && (
                <div style={styles.popupOverlay}>
                    <div style={styles.popup}>
                        <h2>Enter Details</h2>
                        <input
                            type="text"
                            placeholder="Enter team name"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            style={styles.input}
                        />
                        <input
                            type="text"
                            placeholder="Enter email IDs of team members separated by commas"
                            value={teamMembers}
                            onChange={(e) => setTeamMembers(e.target.value)}
                            style={styles.input}
                        />
                        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
                        {successMessage && <p style={styles.success}>{successMessage}</p>}
                        <button onClick={handleCreateTeam} style={styles.popupButton}>
                            Create
                        </button>
                        <button onClick={handleClosePopup} style={styles.popupButton}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    landingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f7f7f7',
        fontFamily: 'Arial, sans-serif',
        paddingTop: '60px',
    },
    navbarContainer: {
        width: '100%',
        position: 'fixed',
        top: 0,
        zIndex: 1000,
    },
    sectionsContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginTop: '20px',
        flexWrap: 'wrap', // Allow sections to wrap on smaller screens
    },
    section: {
        flex: '0 0 40%',
        padding: '20px 10px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        minHeight: '50vh',
        backgroundColor: '#ffffff',
        margin: '10px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    content: {
        maxWidth: '300px',
    },
    heading: {
        fontSize: '2rem',
        color: '#003300',
        marginBottom: '15px',
    },
    paragraph: {
        fontSize: '1rem',
        color: '#555',
        marginBottom: '20px',
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'column', // Change to column to stack buttons vertically
        alignItems: 'center',
        gap: '10px', // Add spacing between buttons
        marginTop: '10px',
    },
    ctaButton: {
        padding: '10px 20px',
        fontSize: '1rem',
        color: 'white',
        backgroundColor: '#003300',
        border: 'none',
        borderRadius: '5px',
        textDecoration: 'none',
        transition: 'background-color 0.3s',
    },
    popupOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1001,
    },
    popup: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
    },
    input: {
        padding: '10px',
        margin: '10px 0',
        width: '100%',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    popupButton: {
        padding: '10px 20px',
        fontSize: '1rem',
        color: 'white',
        backgroundColor: '#003300',
        border: 'none',
        borderRadius: '5px',
        textDecoration: 'none',
        transition: 'background-color 0.3s',
        margin: '10px 5px',
    },
};

export default LandingPage;