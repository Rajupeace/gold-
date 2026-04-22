import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout, isAdmin } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();

    return (
        <nav style={styles.nav}>
            <div className="container" style={styles.container}>
                {/* Logo */}
                <Link to="/" style={styles.logo}>
                    <span style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '3px' }}>
                        EVERGREEN <span style={{ color: 'var(--color-gold-primary)' }}>ELEGANCE</span>
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div style={styles.desktopMenu}>
                    <Link to="/" style={styles.navLink}>Home</Link>
                    <Link to="/products" style={styles.navLink}>Jewelry</Link>
                    {user && !isAdmin && <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>}
                    {isAdmin && (
                        <>
                            <Link to="/admin" style={{...styles.navLink, color: 'var(--color-gold-primary)'}}>Admin</Link>
                            <Link to="/admin/users" style={styles.navLink}>Users</Link>
                        </>
                    )}
                </div>

                {/* Icons */}
                <div style={styles.icons}>
                    <Link to="/products"><Search size={20} style={styles.icon} /></Link>
                    <Link to="/wishlist"><Heart size={20} style={styles.icon} /></Link>
                    <Link to="/cart" style={styles.cartIcon}>
                        <ShoppingBag size={20} style={styles.icon} />
                        {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
                    </Link>
                    
                    {user ? (
                        <div className="user-profile" style={styles.userProfile} onClick={() => setIsMenuOpen(false)}>
                            <div style={styles.profileTrigger}>
                                <User size={20} style={styles.icon} />
                                <span style={styles.userName}>{user.name.split(' ')[0]}</span>
                            </div>
                            <div className="glass dropdown-menu" style={styles.dropdown}>
                                <Link to={isAdmin ? "/admin" : "/dashboard"} className="dropdown-item" style={styles.dropdownItem}>My Account</Link>
                                <button onClick={logout} style={styles.logoutBtn}>Logout</button>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login"><User size={20} style={styles.icon} /></Link>
                    )}
                    
                    {/* Burger Menu for mobile */}
                    <div style={styles.burger} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div style={styles.mobileMenu}>
                    <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
                    <Link to="/products" onClick={() => setIsMenuOpen(false)}>Jewelry</Link>
                    {isAdmin && <Link to="/admin" onClick={() => setIsMenuOpen(false)}>Admin</Link>}
                    <Link to="/wishlist" onClick={() => setIsMenuOpen(false)}>Wishlist</Link>
                    <Link to="/cart" onClick={() => setIsMenuOpen(false)}>Cart</Link>
                    {!user && <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>}
                </div>
            )}
        </nav>
    );
};

const styles = {
    nav: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '80px',
        backgroundColor: '#000000',
        borderBottom: '1px solid #222222',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
    },
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    logo: {
        fontSize: '1.5rem',
        fontWeight: '700',
        letterSpacing: '2px',
        color: 'var(--color-white)',
    },
    desktopMenu: {
        display: 'flex',
        gap: '2rem',
    },
    navLink: {
        fontSize: '0.9rem',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        color: 'var(--color-text-main)',
    },
    icons: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
    },
    icon: {
        color: 'var(--color-text-main)',
        cursor: 'pointer',
    },
    cartIcon: {
        position: 'relative',
    },
    cartBadge: {
        position: 'absolute',
        top: '-8px',
        right: '-8px',
        backgroundColor: 'var(--color-gold-primary)',
        color: 'var(--color-black)',
        fontSize: '0.7rem',
        fontWeight: 'bold',
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userProfile: {
        position: 'relative',
        cursor: 'pointer',
    },
    profileTrigger: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
    },
    userName: {
        fontSize: '0.9rem',
        color: 'var(--color-gold-primary)',
        fontWeight: '600',
    },
    dropdown: {
        position: 'absolute',
        top: '100%',
        right: 0,
        minWidth: '180px',
        padding: '0.5rem 0',
        marginTop: '0.5rem',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        zIndex: 1001,
    },
    dropdownItem: {
        display: 'block',
        padding: '0.8rem 1.5rem',
        color: 'var(--color-text-main)',
        fontSize: '0.9rem',
    },
    logoutBtn: {
        width: '100%',
        textAlign: 'left',
        padding: '0.8rem 1.5rem',
        backgroundColor: 'transparent',
        color: '#f44336',
        fontSize: '0.9rem',
        fontWeight: '600',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        marginTop: '0.5rem',
    },
    burger: {
        display: 'none',
        cursor: 'pointer',
        color: 'var(--color-gold-primary)',
    },
    mobileMenu: {
        position: 'absolute',
        top: '80px',
        left: 0,
        width: '100%',
        backgroundColor: 'var(--color-black)',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        borderBottom: '1px solid var(--color-gold-primary)',
    }
};

export default Navbar;
