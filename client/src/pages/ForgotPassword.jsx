import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, ArrowLeft, Key, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & Reset
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            toast.success(data.message);
            setStep(2);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error sending verification code');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return toast.error('Passwords do not match');
        }
        setLoading(true);
        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/reset-password', { 
                email, 
                otp, 
                newPassword 
            });
            toast.success(data.message);
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error resetting password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass" 
                style={styles.card}
            >
                <Link to="/login" style={styles.backLink}>
                    <ArrowLeft size={18} /> Back to Access
                </Link>

                <div style={styles.branding}>
                    <h1 style={{...styles.logo, fontFamily: "'Playfair Display', serif"}}>RESET <span className="gold-text">ACCESS</span></h1>
                    <div style={styles.divider}></div>
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.div 
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <p style={styles.subtitle}>Enter your registered identity to receive a secure verification code.</p>
                            <form onSubmit={handleSendOTP} style={styles.form}>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Identity (Email)</label>
                                    <div style={styles.inputWrapper}>
                                        <Mail size={18} style={styles.icon} />
                                        <input 
                                            type="email" 
                                            placeholder="your@email.com" 
                                            style={styles.input} 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required 
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="gold-button" style={styles.submitBtn} disabled={loading}>
                                    {loading ? <RefreshCw className="spin" size={18} /> : <>Request Code <ArrowRight size={18} /></>}
                                </button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <p style={styles.subtitle}>A 6-digit code was sent to your terminal. Verify to restore access.</p>
                            <form onSubmit={handleResetPassword} style={styles.form}>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Verification Code</label>
                                    <div style={styles.inputWrapper}>
                                        <ShieldCheck size={18} style={styles.icon} />
                                        <input 
                                            type="text" 
                                            placeholder="123456" 
                                            style={styles.input} 
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            maxLength={6}
                                            required 
                                        />
                                    </div>
                                </div>

                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>New Passkey</label>
                                    <div style={styles.inputWrapper}>
                                        <Key size={18} style={styles.icon} />
                                        <input 
                                            type="password" 
                                            placeholder="••••••••" 
                                            style={styles.input} 
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required 
                                        />
                                    </div>
                                </div>

                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Confirm Passkey</label>
                                    <div style={styles.inputWrapper}>
                                        <Lock size={18} style={styles.icon} />
                                        <input 
                                            type="password" 
                                            placeholder="••••••••" 
                                            style={styles.input} 
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required 
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="gold-button" style={styles.submitBtn} disabled={loading}>
                                    {loading ? <RefreshCw className="spin" size={18} /> : <>Update Access <ShieldCheck size={18} /></>}
                                </button>
                                <button type="button" onClick={() => setStep(1)} style={styles.resendBtn}>
                                    Didn't receive code? Try again
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
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
        padding: 'clamp(1.5rem, 4vw, 2rem)',
    },
    card: {
        width: '100%',
        maxWidth: 'clamp(350px, 50vw, 450px)',
        backgroundColor: '#111111',
        padding: 'clamp(2rem, 5vw, 3rem)',
        borderRadius: '8px',
        border: '1px solid #333333',
        position: 'relative',
    },
    backLink: {
        position: 'absolute',
        top: 'clamp(1rem, 3vw, 1.5rem)',
        left: 'clamp(1rem, 3vw, 1.5rem)',
        color: 'var(--color-text-muted)',
        textDecoration: 'none',
        fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        transition: 'color 0.3s',
    },
    branding: {
        marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
        marginTop: 'clamp(0.8rem, 2vw, 1rem)',
    },
    logo: {
        fontSize: 'clamp(1.4rem, 4vw, 1.8rem)',
        letterSpacing: '4px',
        fontWeight: '300',
        marginBottom: '1rem',
        textAlign: 'center',
    },
    divider: {
        width: '40px',
        height: '2px',
        background: 'var(--color-gold-primary)',
        margin: '0 auto',
    },
    subtitle: {
        color: 'var(--color-text-muted)',
        textAlign: 'center',
        fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
        marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
        lineHeight: '1.5',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(1.5rem, 4vw, 1.8rem)',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
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
    submitBtn: {
        marginTop: 'clamp(0.8rem, 2vw, 1rem)',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.8rem',
    },
    resendBtn: {
        background: 'none',
        border: 'none',
        color: 'var(--color-text-muted)',
        fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
        cursor: 'pointer',
        marginTop: 'clamp(0.8rem, 2vw, 1rem)',
        textDecoration: 'underline',
    }
};

export default ForgotPassword;
