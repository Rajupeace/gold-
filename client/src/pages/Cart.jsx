import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, ShieldCheck, Truck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

    if (cart.length === 0) {
        return (
            <div style={styles.empty}>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                >
                    <ShoppingBag size={100} color="var(--color-gold-primary)" strokeWidth={1} />
                </motion.div>
                <h2 style={{fontFamily: 'var(--font-serif)', fontSize: '2.5rem'}}>Your Bag is Empty</h2>
                <p style={{color: 'var(--color-text-muted)'}}>The world of luxury awaits your first selection.</p>
                <Link to="/products" className="gold-button" style={{marginTop: '2rem'}}>Explore Boutique</Link>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            <div className="container">
                <div style={{display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem'}}>
                    <Link to="/products" style={styles.backBtn}>
                        <ArrowLeft size={20} /> Back to Boutique
                    </Link>
                </div>
                <header style={styles.header}>
                    <h1 style={styles.title}>Your Luxury <span className="gold-text">Selection</span></h1>
                    <p style={styles.subtitle}>{cart.length} Item(s) in your private collection</p>
                </header>
                
                <div style={styles.grid}>
                    {/* Items List */}
                    <div style={styles.itemList}>
                        {cart.map((item, i) => (
                            <motion.div 
                                key={item._id} 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass" 
                                style={styles.item}
                            >
                                <div style={styles.itemInfo}>
                                    <div style={styles.imgWrapper}>
                                        <img src={item.images[0].startsWith('http') ? item.images[0] : `http://localhost:5000${item.images[0]}`} alt={item.name} style={styles.itemImg} />
                                    </div>
                                    <div style={styles.details}>
                                        <h3 style={styles.itemName}>{item.name}</h3>
                                        <p style={styles.itemMeta}>{item.purity} • {item.weight}g</p>
                                        <p style={item.type === 'Diamond' ? styles.diamondPrice : styles.itemPrice}>
                                            ₹{item.price.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                
                                <div style={styles.controls}>
                                    <div style={styles.qtyBox}>
                                        <button onClick={() => updateQuantity(item._id, item.quantity - 1)} style={styles.qtyBtn}><Minus size={14}/></button>
                                        <span style={styles.qtyNum}>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item._id, item.quantity + 1)} style={styles.qtyBtn}><Plus size={14}/></button>
                                    </div>
                                    <div style={styles.subtotal}>
                                        ₹{(item.price * item.quantity).toLocaleString()}
                                    </div>
                                    <button onClick={() => removeFromCart(item._id)} style={styles.removeBtn}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="glass" style={styles.summary}>
                        <h3 style={styles.summaryTitle}>Investment Summary</h3>
                        <div style={styles.summaryRow}>
                            <span style={{color: 'var(--color-text-muted)'}}>Collection Subtotal</span>
                            <span>₹{cartTotal.toLocaleString()}</span>
                        </div>
                        <div style={styles.summaryRow}>
                            <span style={{color: 'var(--color-text-muted)'}}>Insured Shipping</span>
                            <span style={{color: '#4caf50', fontWeight: '700'}}>COMPLIMENTARY</span>
                        </div>
                        <div style={styles.summaryRow}>
                            <span style={{color: 'var(--color-text-muted)'}}>Luxury Surcharge</span>
                            <span>₹0.00</span>
                        </div>
                        <div style={styles.totalRow}>
                            <span>Total Acquisition</span>
                            <span className="gold-text">₹{cartTotal.toLocaleString()}</span>
                        </div>
                        
                        <Link to="/checkout" className="gold-button" style={styles.checkoutBtn}>
                            Secure Checkout <ArrowRight size={18} />
                        </Link>
                        
                        <div style={styles.badges}>
                            <div style={styles.badgeItem}>
                                <ShieldCheck size={16} color="var(--color-gold-primary)" />
                                <span>Authenticity & Purity Guaranteed</span>
                            </div>
                            <div style={styles.badgeItem}>
                                <Truck size={16} color="var(--color-gold-primary)" />
                                <span>Secured & Insured Transit</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: {
        paddingTop: '120px',
        paddingBottom: '8rem',
        minHeight: '100vh',
    },
    header: {
        marginBottom: '4rem',
    },
    title: {
        fontSize: '3rem',
        marginBottom: '0.5rem',
        fontFamily: 'var(--font-serif)',
    },
    subtitle: {
        color: 'var(--color-text-muted)',
        fontSize: '1.1rem',
    },
    backBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: 'transparent',
        color: 'var(--color-gold-primary)',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        transition: 'all 0.3s ease',
        textDecoration: 'none',
        width: 'fit-content'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: '1.6fr 1fr',
        gap: '3rem',
        alignItems: 'start',
    },
    itemList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    item: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '2rem',
        borderRadius: '15px',
    },
    itemInfo: {
        display: 'flex',
        gap: '2rem',
        alignItems: 'center',
    },
    imgWrapper: {
        width: '120px',
        height: '120px',
        borderRadius: '10px',
        overflow: 'hidden',
        border: '1px solid rgba(212, 175, 55, 0.2)',
    },
    itemImg: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.3rem',
    },
    itemName: {
        fontSize: '1.3rem',
        fontFamily: 'var(--font-serif)',
        color: 'var(--color-white)',
    },
    itemMeta: {
        fontSize: '0.85rem',
        color: 'var(--color-text-muted)',
    },
    itemPrice: {
        fontSize: '1.1rem',
        fontWeight: '700',
        color: 'var(--color-gold-primary)',
        marginTop: '0.5rem',
    },
    diamondPrice: {
        fontSize: '1.1rem',
        fontWeight: '700',
        color: 'var(--color-diamond)',
        marginTop: '0.5rem',
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        gap: '2.5rem',
    },
    qtyBox: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(212, 175, 55, 0.1)',
        borderRadius: '50px',
        padding: '0.2rem',
    },
    qtyBtn: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: 'transparent',
        color: 'var(--color-white)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.05)',
        }
    },
    qtyNum: {
        width: '30px',
        textAlign: 'center',
        fontSize: '1rem',
        fontWeight: '600',
    },
    subtotal: {
        fontWeight: '700',
        fontSize: '1.2rem',
        minWidth: '100px',
        textAlign: 'right',
        color: 'var(--color-white)',
    },
    removeBtn: {
        backgroundColor: 'transparent',
        color: 'rgba(255,255,255,0.3)',
        transition: 'all 0.3s ease',
        '&:hover': {
            color: '#f44336',
            transform: 'scale(1.1)',
        }
    },
    summary: {
        padding: '3rem',
        borderRadius: '20px',
        position: 'sticky',
        top: '120px',
    },
    summaryTitle: {
        fontSize: '1.8rem',
        fontFamily: 'var(--font-serif)',
        marginBottom: '2.5rem',
        color: 'var(--color-gold-primary)',
    },
    summaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        fontSize: '1rem',
    },
    totalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        paddingTop: '2rem',
        marginTop: '1.5rem',
        fontWeight: '700',
        fontSize: '1.5rem',
    },
    checkoutBtn: {
        width: '100%',
        marginTop: '3rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        fontSize: '1rem',
    },
    badges: {
        marginTop: '3rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    badgeItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        fontSize: '0.85rem',
        color: 'var(--color-text-muted)',
    },
    empty: {
        paddingTop: '20vh',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
    }
};

export default Cart;

