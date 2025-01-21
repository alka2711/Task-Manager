import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const MyTeams = () => {
    const [teams, setTeams] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
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

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const filteredTeams = teams.filter((team) => {
        const isAdmin = team.users[0]._id === userId;
        const isMember = team.users.some(user => user._id === userId);

        if (filter === 'admin' && !isAdmin) return false;
        if (filter === 'member' && !isMember) return false;

        return team.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div>
            <Navbar />
            <div style={styles.container}>
                <h1 style={styles.heading}>My Teams</h1>
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
                    <option value="admin">Admin</option>
                    <option value="member">Member</option>
                </select>
                </div>
                <ul style={styles.teamList}>
                    {filteredTeams.map((team) => (
                        <li key={team._id} style={styles.teamItem}>
                            {team.name} - {team.users[0]._id === userId ? 'Admin' : 'Member'}
                        </li>
                    ))}
                </ul>
                
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        margin: '0 auto',
    },
    heading: {
        marginTop: '5%',
        marginBottom: '20px',
    },
    teamContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        padding: '20px',
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
        padding: '0',
    },
    teamItem: {
        padding: '10px',
        borderBottom: '1px solid #ccc',
    },
};

export default MyTeams;