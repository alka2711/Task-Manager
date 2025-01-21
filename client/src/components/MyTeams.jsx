import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import AssignTeamTask from './AssignTeamTask';

const MyTeams = () => {
    const [teams, setTeams] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [filteredTeams, setFilteredTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null); // State to store selected team
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get('/api/team', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setTeams(response.data.teams);
            } catch (error) {
                console.error('Error fetching teams:', error);
            }
        };

        fetchTeams();
    }, []);

    useEffect(() => {
        setFilteredTeams(getFilteredTeams());
    }, [teams, filter, searchTerm]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const getFilteredTeams = () => {
        let filtered = teams;

        if (filter !== 'all') {
            filtered = filtered.filter(team => team.role === filter);
        }

        if (searchTerm) {
            filtered = filtered.filter(team => team.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        return filtered;
    };

    const handleViewTeam = (team) => {
        console.log('Selected Team:', team);
        setSelectedTeam(team);
    };

    const handleClosePopup = () => {
        setSelectedTeam(null);
    };

    const handleAssignTask = () => {
        setShowModal(true); // Show the modal when assigning a task
    };

    const handleCloseModal = () => {
        setShowModal(false); // Close the modal
    };

    return (
        <div>
            <Navbar />
            <br />
            <div style={styles.teamContainer}>
                <input
                    type="text"
                    placeholder="Search teams..."
                    value={searchTerm}
                    onChange={handleSearch}
                    style={styles.searchInput}
                />
                <select value={filter} onChange={handleFilterChange} style={styles.filterSelect}>
                    <option value="all">All</option>
                    <option value="Admin">Admin</option>
                    <option value="Member">Member</option>
                </select>
            </div>
            <ul style={styles.teamList}>
                {filteredTeams.map((team) => (
                    <div key={team._id}>
                        <div style={styles.teamDiv}>
                            <li style={styles.teamItem}>
                                {team.name} - {team.role}
                            </li>
                            <button
                                style={styles.viewButton}
                                onClick={() => handleViewTeam(team)}
                            >
                                View Team
                            </button>
                        </div>
                        <br />
                    </div>
                ))}
            </ul>

            {/* Popup Modal for Team Details */}
            {selectedTeam && (
                <div style={styles.popupOverlay}>
                    <div style={styles.popup}>
                        <h2>{selectedTeam.name}</h2>
                        <p><strong>Members:</strong></p>
                        <ul>
                            {selectedTeam.users && selectedTeam.users.length > 0 ? (
                                selectedTeam.users.map((user) => (
                                    <li style={styles.viewList} key={user.email}>
                                        {user.name} - {user.email}
                                    </li>
                                ))
                            ) : (
                                <li>No members found.</li>
                            )}
                        </ul>
                        {selectedTeam.role === 'Admin' && (
                            <>
                                <button
                                    style={styles.closeButton}
                                    onClick={handleAssignTask}
                                >
                                    Assign Task
                                </button>
                                {showModal && (
                                  <div style={styles.modal}>
                                    <div style={styles.modalContent}>
                                        <AssignTeamTask selectedTeam={selectedTeam} onClose={handleCloseModal} />
                                    </div>
                                  </div>
                                )}
                            </>
                        )}
                        <button style={styles.closeButton} onClick={handleClosePopup}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    teamContainer: {
        marginTop: '7%',
        display: 'flex',
        justifyContent: 'space-around',
        marginBottom: '20px',
    },
    searchInput: {
        width: '70%',
        padding: '10px',
        marginBottom: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    filterSelect: {
        width: '20%',
        padding: '10px',
        marginBottom: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    teamList: {
        listStyleType: 'none',
        padding: '1%',
    },
    teamItem: {
        padding: '10px',
    },
    teamDiv: {
        display: 'flex',
        justifyContent: 'space-around',
    },
    viewButton: {
        padding: '5px',
        backgroundColor: '#003300',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
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
    },
    popup: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '5px',
        width: '400px',
        textAlign: 'center',
    },
    viewList: {
      listStyleType: 'none',
    },
    closeButton: {
      margin: '10px',
        padding: '10px',
        backgroundColor: '#003300',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default MyTeams;
