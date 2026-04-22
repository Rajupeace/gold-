import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user'); // 'user' or 'admin'
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || (role === 'admin' ? '/admin' : '/dashboard');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate(from, { replace: true });
        } catch (error) {
            // Error toast handled in context
        }
    };

    return (
        <div style={styles.page}>
            <div className="sparkle" style={{top: '10%', left: '20%'}}></div>
            <div className="sparkle" style={{top: '30%', left: '80%', animationDelay: '1s'}}></div>
            <div className="sparkle" style={{top: '70%', left: '15%', animationDelay: '0.5s'}}></div>
            <div className="sparkle" style={{top: '85%', left: '75%', animationDelay: '1.5s'}}></div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="glass" 
                style={styles.card}
            >
                <div style={styles.branding}>
                    <h1 style={{...styles.logo, fontFamily: "'Playfair Display', serif", letterSpacing: '2px'}}>EVERGREEN <span className="gold-text">ELEGANCE</span></h1>
                    <div style={styles.divider}></div>
                </div>

                <h2 style={styles.title}>
                    {role === 'admin' ? 'Administrative ' : 'Client '}
                    <span className="gold-text">Access</span>
                </h2>
                
                {/* Role Selector */}
                <div style={styles.roleSelector}>
                    <button 
                        onClick={() => setRole('user')}
                        style={{...styles.roleBtn, ...(role === 'user' ? styles.roleBtnActive : {})}}
                    >
                        <UserIcon size={16} /> User
                    </button>
                    <button 
                        onClick={() => setRole('admin')}
                        style={{...styles.roleBtn, ...(role === 'admin' ? styles.roleBtnActive : {})}}
                    >
                        <ShieldCheck size={16} /> Admin
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Identity</label>
                        <div style={styles.inputWrapper}>
                            <Mail size={18} style={styles.icon} />
                            <input 
                                type="email" 
                                placeholder={role === 'admin' ? "admin@evergreen-elegance.com" : "your@email.com"} 
                                style={styles.input} 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                            />
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <label style={styles.label}>Passkey</label>
                        </div>
                        <div style={styles.inputWrapper}>
                            <Lock size={18} style={styles.icon} />
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="••••••••" 
                                style={styles.input} 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                            <div onClick={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </div>
                        </div>
                        <div style={{textAlign: 'right'}}>
                            <Link to="/forgot-password" style={styles.forgotLink}>Forgot Password?</Link>
                        </div>
                    </div>

                    <button type="submit" className="gold-button" style={styles.submitBtn}>
                        Enter Portal <ArrowRight size={18} />
                    </button>
                </form>

                {role === 'user' && (
                    <p style={styles.footerText}>
                        New to the Legacy? <Link to="/register" style={{color: 'var(--color-gold-primary)', fontWeight: '600'}}>Begin Your Journey</Link>
                    </p>
                )}
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
        padding: '2rem',
    },
    card: {
        width: '100%',
        maxWidth: '450px',
        backgroundColor: '#111111',
        padding: '3rem',
        borderRadius: '8px',
        border: '1px solid #333333',
    },
    branding: {
        marginBottom: '2rem',
    },
    logo: {
        fontSize: '1.8rem',
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
        fontSize: '2rem',
        marginBottom: '2rem',
        fontFamily: 'var(--font-serif)',
    },
    roleSelector: {
        display: 'flex',
        gap: '0.5rem',
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: '0.3rem',
        borderRadius: '50px',
        marginBottom: '2.5rem',
    },
    roleBtn: {
        flex: 1,
        padding: '0.7rem',
        borderRadius: '50px',
        border: 'none',
        backgroundColor: 'transparent',
        color: 'var(--color-text-muted)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        fontSize: '0.85rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    roleBtnActive: {
        backgroundColor: 'var(--color-gold-primary)',
        color: 'var(--color-black)',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.8rem',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
        textAlign: 'left',
    },
    label: {
        fontSize: '0.8rem',
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
    eyeIcon: {
        position: 'absolute',
        right: '1.2rem',
        color: 'var(--color-text-muted)',
        cursor: 'pointer',
    },
    input: {
        width: '100%',
        padding: '1.1rem 1.1rem 1.1rem 3.5rem',
        backgroundColor: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(212, 175, 55, 0.15)',
        borderRadius: '12px',
        color: 'var(--color-white)',
        outline: 'none',
        fontSize: '1rem',
        transition: 'all 0.3s ease',
    },
    forgotLink: {
        fontSize: '0.8rem',
        color: 'var(--color-gold-primary)',
        textDecoration: 'none',
        opacity: 0.8,
        transition: 'opacity 0.3s',
    },
    submitBtn: {
        marginTop: '1rem',
        width: '100%',
    },
    footerText: {
        marginTop: '2.5rem',
        fontSize: '0.9rem',
        color: 'var(--color-text-muted)',
    }
};

export default Login;

