import React, { useState, useEffect } from 'react';
import { Users, Mail, Shield, Calendar, Trash2, Search, Smartphone } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const UserManagement = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, [currentUser.token]);

    const fetchUsers = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${currentUser.token}` }
            };
            const { data } = await axios.get('http://localhost:5000/api/auth/users', config);
            setUsers(data);
            setLoading(false);
        } catch (error) {
            toast.error("Failed to fetch users");
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to remove this user?")) {
            // Logic to delete user can be added here
            toast.info("User deletion is restricted in demo mode.");
        }
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div style={{padding: '200px', textAlign: 'center'}}>Loading User Directory...</div>;

    return (
        <div style={styles.page}>
            <div className="container">
                <header style={styles.header}>
                    <h1 style={{fontFamily: "'Playfair Display', serif"}}>User <span className="gold-text">Management</span></h1>
                    <div style={styles.searchBar}>
                        <Search size={20} style={styles.searchIcon} />
                        <input 
                            type="text" 
                            placeholder="Find a client..." 
                            style={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </header>

                <div style={styles.directoryGrid}>
                    {filteredUsers.map(user => (
                        <div key={user._id} style={styles.userCard}>
                            <div style={styles.cardHeader}>
                                <div style={styles.avatar}>
                                    {user.name.charAt(0)}
                                </div>
                                <div style={styles.badgeContainer}>
                                    <span style={{
                                        ...styles.roleBadge,
                                        backgroundColor: user.role === 'admin' ? 'rgba(226, 156, 129, 0.15)' : 'rgba(255,255,255,0.05)',
                                        color: user.role === 'admin' ? 'var(--color-gold-primary)' : 'var(--color-text-muted)'
                                    }}>
                                        <Shield size={12} style={{marginRight: '0.4rem'}} />
                                        {user.role.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            
                            <div style={styles.cardBody}>
                                <h3 style={styles.userNameText}>{user.name}</h3>
                                <div style={styles.userDetail}>
                                    <Mail size={14} style={styles.detailIcon} />
                                    <span>{user.email}</span>
                                </div>
                                <div style={styles.userDetail}>
                                    <Smartphone size={14} style={styles.detailIcon} />
                                    <span>{user.phone || 'No Private Phone'}</span>
                                </div>
                                <div style={styles.userDetail}>
                                    <Calendar size={14} style={styles.detailIcon} />
                                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div style={styles.cardFooter}>
                                <button 
                                    onClick={() => handleDelete(user._id)} 
                                    style={styles.actionBtn}
                                    disabled={user.role === 'admin'}
                                    title="Revoke Access"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: { paddingTop: '120px', paddingBottom: '8rem', backgroundColor: '#000', minHeight: '100vh' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3.5rem', flexWrap: 'wrap', gap: '1.5rem' },
    searchBar: { position: 'relative', width: '350px' },
    searchIcon: { position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gold-primary)' },
    searchInput: { width: '100%', padding: '0.9rem 1rem 0.9rem 3rem', backgroundColor: '#0a0a0a', border: '1px solid rgba(226, 156, 129, 0.2)', borderRadius: '8px', color: 'var(--color-white)', outline: 'none', transition: 'all 0.3s', '&:focus': { borderColor: 'var(--color-gold-primary)' } },
    directoryGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '2rem'
    },
    userCard: {
        backgroundColor: '#0a0a0a',
        borderRadius: '12px',
        border: '1px solid rgba(226, 156, 129, 0.1)',
        padding: '1.5rem',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem',
        '&:hover': {
            transform: 'translateY(-5px)',
            borderColor: 'rgba(226, 156, 129, 0.3)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    avatar: { 
        width: '40px', 
        height: '40px', 
        borderRadius: '50%', 
        backgroundColor: 'rgba(226, 156, 129, 0.1)', 
        color: 'var(--color-gold-primary)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        fontSize: '1rem',
        fontWeight: 'bold',
        border: '1px solid rgba(226, 156, 129, 0.2)'
    },
    roleBadge: { padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '700', display: 'flex', alignItems: 'center', letterSpacing: '1px' },
    cardBody: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem'
    },
    userNameText: {
        fontSize: '1.2rem',
        color: '#fff',
        fontWeight: '600',
        marginBottom: '0.2rem'
    },
    userDetail: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.7rem',
        color: 'var(--color-text-muted)',
        fontSize: '0.85rem'
    },
    detailIcon: {
        color: 'var(--color-gold-primary)',
        opacity: 0.8
    },
    cardFooter: {
        marginTop: '0.5rem',
        paddingTop: '1rem',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        justifyContent: 'flex-end'
    },
    actionBtn: {
        backgroundColor: 'transparent',
        color: '#f44336',
        padding: '0.5rem',
        borderRadius: '4px',
        cursor: 'pointer',
        opacity: 0.6,
        transition: 'all 0.2s ease',
        '&:hover': {
            opacity: 1,
            backgroundColor: 'rgba(244, 67, 54, 0.1)'
        }
    }
};

export default UserManagement;
