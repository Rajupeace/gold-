import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import SEO from '../components/common/SEO';

const Success = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const order = location.state?.order;

    useEffect(() => {
        if (!order) {
            navigate('/');
        }
    }, [order, navigate]);

    if (!order) return null;

    return (
        <div style={styles.page}>
            <SEO title="Success" />
            <div className="container">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={styles.card}
                    className="glass"
                >
                    <div style={styles.iconWrapper}>
                        <CheckCircle size={80} color="var(--color-gold-primary)" />
                    </div>
                    
                    <h1 style={styles.title}>Acquisition <span className="gold-text">Successful</span></h1>
                    <p style={styles.subtitle}>Your order has been placed and is being prepared for fulfillment.</p>
                    
                    <div style={styles.orderSummary}>
                        <div style={styles.summaryItem}>
                            <span style={styles.label}>Manifest ID:</span>
                            <span style={styles.value}>#{order._id.substring(0, 10).toUpperCase()}</span>
                        </div>
                        <div style={styles.summaryItem}>
                            <span style={styles.label}>Total Amount:</span>
                            <span style={styles.value} className="gold-text">₹{order.totalAmount.toLocaleString()}</span>
                        </div>
                        <div style={styles.summaryItem}>
                            <span style={styles.label}>Status:</span>
                            <span style={{...styles.value, color: '#4caf50'}}>AUTHENTICATED</span>
                        </div>
                    </div>

                    <p style={styles.note}>
                        A digital manifest and tracking details have been sent to your registered email.
                    </p>

                    <div style={styles.actions}>
                        <Link to="/dashboard" className="gold-button" style={styles.dashboardBtn}>
                            <ShoppingBag size={18} /> VIEW PORTFOLIO
                        </Link>
                        <Link to="/products" style={styles.continueLink}>
                            Continue Shopping <ArrowRight size={16} />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const styles = {
    page: {
        paddingTop: 'clamp(100px, 15vw, 150px)',
        paddingBottom: '8rem',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
    },
    card: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: 'clamp(2rem, 8vw, 4rem)',
        textAlign: 'center',
        borderRadius: '16px',
        border: '1px solid rgba(212, 175, 55, 0.2)',
    },
    iconWrapper: {
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'center',
    },
    title: {
        fontSize: 'clamp(2rem, 5vw, 3rem)',
        marginBottom: '1rem',
        fontFamily: "'Playfair Display', serif",
    },
    subtitle: {
        fontSize: 'clamp(1rem, 2vw, 1.1rem)',
        color: 'var(--color-text-muted)',
        marginBottom: '2.5rem',
        lineHeight: '1.6',
    },
    orderSummary: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        padding: '2rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        border: '1px solid rgba(212, 175, 55, 0.1)',
    },
    summaryItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        color: 'var(--color-text-muted)',
        fontSize: '0.9rem',
    },
    value: {
        fontWeight: '600',
        fontSize: '1rem',
    },
    note: {
        fontSize: '0.85rem',
        color: 'var(--color-text-muted)',
        marginBottom: '3rem',
    },
    actions: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
    },
    dashboardBtn: {
        width: '100%',
        padding: '1.2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.8rem',
        textDecoration: 'none',
    },
    continueLink: {
        color: 'var(--color-gold-primary)',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.95rem',
        fontWeight: '500',
    }
};

export default Success;
