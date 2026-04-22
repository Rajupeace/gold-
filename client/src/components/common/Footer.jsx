import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Smartphone, Mail as MailIcon, MapPin, Globe, Share2 } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={styles.footer}>
            <div className="container" style={styles.grid}>
                {/* About */}
                <div style={styles.section}>
                    <h3 style={{...styles.title, fontFamily: "'Playfair Display', serif"}}>EVERGREEN ELEGANCE</h3>
                    <p style={styles.text}>
                        Exquisite gold jewelry crafted for the moments that matter. 
                        Our legacy of purity and design spans decades.
                    </p>
                    <div style={styles.socials}>
                        <Instagram size={20} style={styles.socialIcon} />
                        <Globe size={20} style={styles.socialIcon} />
                        <Share2 size={20} style={styles.socialIcon} />
                    </div>
                </div>

                {/* Quick Links */}
                <div style={styles.section}>
                    <h4 style={styles.subTitle}>Collections</h4>
                    <ul style={styles.list}>
                        <li><Link to="/products?category=rings">Gold Rings</Link></li>
                        <li><Link to="/products?category=necklaces">Neckchains</Link></li>
                        <li><Link to="/products?category=bracelets">Bangles</Link></li>
                        <li><Link to="/products?category=silver">Silver Jewelry</Link></li>
                    </ul>
                </div>

                {/* Customer Service */}
                <div style={styles.section}>
                    <h4 style={styles.subTitle}>Customer Care</h4>
                    <ul style={styles.list}>
                        <li><Link to="/contact">Contact Us</Link></li>
                        <li><Link to="/shipping">Shipping Policy</Link></li>
                        <li><Link to="/returns">Returns & Exchanges</Link></li>
                        <li><Link to="/faq">FAQs</Link></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div style={styles.section}>
                    <h4 style={styles.subTitle}>Store Info</h4>
                    <div style={styles.contactItem}>
                        <MapPin size={18} style={styles.icon} />
                        <span>123 Gold Street, Jewelry District, NY</span>
                    </div>
                    <div style={styles.contactItem}>
                        <Smartphone size={18} style={styles.icon} />
                        <span>9398435222</span>
                    </div>
                    <div style={styles.contactItem}>
                        <MailIcon size={18} style={styles.icon} />
                        <span>concierge@evergreen-elegance.com</span>
                    </div>
                </div>
            </div>
            
            <div style={styles.bottom}>
                <p>&copy; {new Date().getFullYear()} Evergreen Elegance. All rights reserved.</p>
            </div>
        </footer>
    );
};

const styles = {
    footer: {
        backgroundColor: '#000000',
        padding: '5rem 0 2rem',
        borderTop: '1px solid #222222',
        marginTop: 'auto',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '3rem',
        marginBottom: '4rem',
    },
    section: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    title: {
        fontSize: '1.5rem',
        color: 'var(--color-gold-primary)',
        letterSpacing: '2px',
    },
    subTitle: {
        fontSize: '1.1rem',
        color: '#ffffff',
        marginBottom: '0.5rem',
    },
    text: {
        color: '#888888',
        fontSize: '0.9rem',
        maxWidth: '300px',
    },
    socials: {
        display: 'flex',
        gap: '1rem',
    },
    socialIcon: {
        color: 'var(--color-gold-primary)',
        cursor: 'pointer',
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
        fontSize: '0.9rem',
        color: '#888888',
    },
    contactItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        color: '#888888',
        fontSize: '0.9rem',
    },
    icon: {
        color: 'var(--color-gold-primary)',
    },
    bottom: {
        textAlign: 'center',
        paddingTop: '2rem',
        borderTop: '1px solid #111111',
        color: '#555555',
        fontSize: '0.8rem',
    }
};

export default Footer;
