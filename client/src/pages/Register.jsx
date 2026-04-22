import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Phone, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        try {
            await register(formData.name, formData.email, formData.password, formData.phone);
            navigate('/dashboard');
        } catch (error) {
            // Error managed in context
        }
    };

    return (
        <div style={styles.page}>
            <div className="sparkle" style={{top: '15%', left: '10%'}}></div>
            <div className="sparkle" style={{top: '25%', left: '85%', animationDelay: '1s'}}></div>
            <div className="sparkle" style={{top: '75%', left: '20%', animationDelay: '0.5s'}}></div>
            <div className="sparkle" style={{top: '80%', left: '70%', animationDelay: '1.5s'}}></div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="glass" 
                style={styles.card}
            >
                <div style={styles.branding}>
                    <h1 style={{...styles.logo, fontFamily: "'Playfair Display', serif", letterSpacing: '2px'}}>EVERGREEN <span className="gold-text">ELEGANCE</span></h1>
                    <div style={styles.divider}></div>
                </div>

                <h2 style={styles.title}>Begin Your <span className="gold-text">Legacy</span></h2>
                <p style={styles.subtitle}>Join our exclusive circle of luxury connoisseurs</p>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Full Name</label>
                        <div style={styles.inputWrapper}>
                            <User size={18} style={styles.icon} />
                            <input 
                                type="text" 
                                name="name"
                                placeholder="E.g. Alexander Pierce" 
                                style={styles.input} 
                                value={formData.name}
                                onChange={handleChange}
                                required 
                            />
                        </div>
                    </div>

                    <div style={styles.inputRow}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email Address</label>
                            <div style={styles.inputWrapper}>
                                <Mail size={18} style={styles.icon} />
                                <input 
                                    type="email" 
                                    name="email"
                                    placeholder="your@luxury.com" 
                                    style={styles.input} 
                                    value={formData.email}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Private Phone</label>
                            <div style={styles.inputWrapper}>
                                <Phone size={18} style={styles.icon} />
                                <input 
                                    type="tel" 
                                    name="phone"
                                    placeholder="+91 XXXXX XXXXX" 
                                    style={styles.input} 
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Passkey</label>
                        <div style={styles.inputWrapper}>
                            <Lock size={18} style={styles.icon} />
                            <input 
                                type="password" 
                                name="password"
                                placeholder="••••••••" 
                                style={styles.input} 
                                value={formData.password}
                                onChange={handleChange}
                                required 
                            />
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Verify Passkey</label>
                        <div style={styles.inputWrapper}>
                            <Lock size={18} style={styles.icon} />
                            <input 
                                type="password" 
                                name="confirmPassword"
                                placeholder="••••••••" 
                                style={styles.input} 
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required 
                            />
                        </div>
                    </div>

                    <div style={styles.agreement}>
                        <ShieldCheck size={16} color="var(--color-gold-primary)" />
                        <span style={{fontSize: '0.8rem', color: 'var(--color-text-muted)'}}>
                            I agree to the terms of the Evergreen Elegance Legacy & Privacy Policy.
                        </span>
                    </div>

                    <button type="submit" className="gold-button" style={styles.submitBtn}>
                        Create Legacy Account <ArrowRight size={18} />
                    </button>
                </form>

                <p style={styles.footerText}>
                    Already have an account? <Link to="/login" style={{color: 'var(--color-gold-primary)', fontWeight: '600'}}>Sign In</Link>
                </p>
            </motion.div>
        </div>
    );
};

const styles = {
    page: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        padding: 'clamp(2rem, 5vw, 4rem) clamp(1rem, 3vw, 2rem)',
    },
    card: {
        width: '100%',
        maxWidth: 'clamp(400px, 50vw, 500px)',
        backgroundColor: '#111111',
        padding: 'clamp(2rem, 5vw, 3rem)',
        borderRadius: '8px',
        border: '1px solid #333333',
    },
    branding: {
        marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
    },
    logo: {
        fontSize: 'clamp(1.4rem, 4vw, 1.8rem)',
        letterSpacing: '4px',
        fontWeight: '300',
        marginBottom: '1rem',
    },
    divider: {
        width: '40px',
        height: '2px',
        background: 'var(--gradient-gold)',
        margin: '0 auto',
    },
    title: {
        fontSize: 'clamp(1.5rem, 4vw, 2rem)',
        marginBottom: '0.5rem',
        fontFamily: 'var(--font-serif)',
    },
    subtitle: {
        color: 'var(--color-text-muted)',
        marginBottom: 'clamp(2rem, 5vw, 2.5rem)',
        fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(1.2rem, 3vw, 1.5rem)',
    },
    inputRow: {
        display: 'flex',
        gap: 'clamp(1rem, 3vw, 1.5rem)',
        textAlign: 'left',
        flexWrap: 'wrap',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
        flex: 1,
        textAlign: 'left',
    },
    label: {
        fontSize: 'clamp(0.7rem, 2vw, 0.8rem)',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        color: 'var(--color-text-muted)',
        marginLeft: '0.2rem',
    },
    inputWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    },
    icon: {
        position: 'absolute',
        left: '1.2rem',
        color: 'var(--color-gold-primary)',
        opacity: 0.7,
    },
    input: {
        width: '100%',
        padding: 'clamp(0.9rem, 2.5vw, 1.1rem) clamp(0.9rem, 2.5vw, 1.1rem) clamp(0.9rem, 2.5vw, 1.1rem) 3.5rem',
        backgroundColor: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(212, 175, 55, 0.15)',
        borderRadius: '12px',
        color: 'var(--color-white)',
        outline: 'none',
        fontSize: 'clamp(0.9rem, 2vw, 1rem)',
        transition: 'all 0.3s ease',
    },
    agreement: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
        textAlign: 'left',
        margin: '0.5rem 0',
        flexWrap: 'wrap',
    },
    submitBtn: {
        width: '100%',
    },
    footerText: {
        marginTop: 'clamp(2rem, 5vw, 2.5rem)',
        fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
        color: 'var(--color-text-muted)',
    }
};

export default Register;

