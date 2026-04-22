import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, User, MapPin, Settings, LogOut, ChevronRight, FileText, XCircle, ArrowUpRight, ShoppingCart, Gift } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SEO from '../components/common/SEO';

const UserDashboard = () => {
    const { user, logout } = useAuth();
    const { cart, wishlist } = useCart();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user?.token) return;
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                const { data } = await axios.get('/api/orders/myorders', config);
                setOrders(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching orders:", error);
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user?.token]);

    if (loading) return <div style={{padding: '200px', textAlign: 'center'}}>Loading Your Dashboard...</div>;

    return (
        <div style={styles.page}>
            <SEO title="My Legacy" />
            <div className="container">
                <div style={styles.header}>
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 style={styles.title}>Boutique <span className="gold-text">Portfolio</span></h1>
                        <p style={styles.subtitle}>Welcome back, {user?.name || 'Valued Guest'}</p>
                    </motion.div>
                    <button onClick={logout} style={styles.logoutBtn}>
                        <LogOut size={18} /> Logout
                    </button>
                </div>

                <div style={styles.grid}>
                    {/* Sidebar/Profile Info */}
                    <div style={styles.sidebar}>
                        <div className="glass" style={styles.profileCard}>
                            <div style={styles.avatar}>
                                <User size={40} color="var(--color-gold-primary)" />
                            </div>
                            <h3 style={{marginTop: '1rem'}}>{user?.name}</h3>
                            <p style={{fontSize: '0.8rem', color: 'var(--color-text-muted)'}}>{user?.email}</p>
                            <div style={styles.membershipBadge}>Gold Member</div>
                        </div>

                        <div style={styles.navMenu}>
                            <div style={styles.navItemActive}><ShoppingBag size={18}/> My Orders</div>
                            <Link to="/wishlist" style={styles.navItem}><Heart size={18}/> Wishlist ({wishlist.length})</Link>
                            <div style={styles.navItem}><MapPin size={18}/> Saved Addresses</div>
                            <div style={styles.navItem}><Settings size={18}/> Security Settings</div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div style={styles.main}>
                        {/* Quick Stats */}
                        <div style={styles.statsGrid}>
                            <div className="glass" style={styles.statCard}>
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <p style={styles.statLabel}>Orders Placed</p>
                                    <ShoppingBag size={16} color="var(--color-gold-primary)" />
                                </div>
                                <h2 style={styles.statValue}>{orders.length}</h2>
                            </div>
                            <div className="glass" style={styles.statCard}>
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <p style={styles.statLabel}>Privilege Points</p>
                                    <ArrowUpRight size={16} color="var(--color-gold-primary)" />
                                </div>
                                <h2 style={styles.statValue} className="gold-text">{(orders.length * 100).toLocaleString()}</h2>
                            </div>
                            <div className="glass" style={styles.statCard}>
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <p style={styles.statLabel}>In Your Bag</p>
                                    <ShoppingCart size={16} color="var(--color-gold-primary)" />
                                </div>
                                <h2 style={styles.statValue}>{cart.length}</h2>
                            </div>
                        </div>

                        {/* Cart Summary Section */}
                        {cart.length > 0 && (
                            <div className="glass" style={styles.cartPanel}>
                                <div style={styles.panelHeader}>
                                    <h3>Boutique Bag Summary</h3>
                                    <Link to="/cart" style={styles.viewAll}>View Bag <ChevronRight size={16}/></Link>
                                </div>
                                <div style={styles.cartItemsScroll}>
                                    {cart.map((item, idx) => (
                                        <div key={idx} style={styles.cartItemMini}>
                                            <img 
                                                src={item.images && item.images[0] ? (item.images[0].startsWith('http') ? item.images[0] : `${item.images[0]}`) : 'https://via.placeholder.com/60'} 
                                                alt={item.name} 
                                                style={styles.cartThumb} 
                                            />
                                            <div style={{flex: 1}}>
                                                <p style={{fontWeight: '600', fontSize: '0.9rem'}}>{item.name}</p>
                                                <p style={{fontSize: '0.8rem', color: 'var(--color-gold-primary)'}}>₹{item.price.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Link to="/checkout" className="gold-button" style={{width: '100%', marginTop: '1rem', textAlign: 'center', textDecoration: 'none'}}>PROCEED TO CHECKOUT</Link>
                            </div>
                        )}

                        {/* Recent Orders */}
                        <div className="glass" style={styles.ordersPanel}>
                            <h3 style={{marginBottom: '2rem'}}>Recent Acquisitions</h3>
                            <div style={styles.ordersList}>
                                {orders.length === 0 ? (
                                    <div style={{textAlign: 'center', padding: '2rem'}}>
                                        <p style={{color: 'var(--color-text-muted)', marginBottom: '1rem'}}>You haven't made any acquisitions yet.</p>
                                        <Link to="/products" className="gold-button">Explore Collections</Link>
                                    </div>
                                ) : orders.map((order, i) => (
                                    <motion.div 
                                        key={order._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        style={styles.orderCard}
                                    >
                                        <div style={styles.orderInfo}>
                                            <p style={styles.orderId}>#{order._id.substring(0, 8)}</p>
                                            <p style={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div style={styles.orderItem}>
                                            <p style={{fontWeight: '500'}}>{order.items[0]?.name || 'Jewelry Item'} {order.items.length > 1 ? `+${order.items.length - 1} more` : ''}</p>
                                            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                                                <p style={{...styles.orderStatus, color: order.orderStatus === 'delivered' ? '#4caf50' : 'var(--color-gold-primary)'}}>{order.orderStatus.toUpperCase()}</p>
                                                {order.trackingId && (
                                                    <span style={{fontSize: '0.75rem', color: 'var(--color-text-muted)'}}>
                                                        Tracking: <span style={{color: 'var(--color-gold-primary)'}}>{order.trackingId}</span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div style={styles.orderActions}>
                                            <p style={{fontWeight: '700', color: 'var(--color-gold-primary)', marginBottom: '0.5rem'}}>₹{order.totalAmount.toLocaleString()}</p>
                                            <button 
                                                onClick={() => setSelectedOrder(order)}
                                                style={styles.manifestBtn}
                                            >
                                                <FileText size={14} /> Manifest
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Manifest Modal */}
            {selectedOrder && (
                <div style={styles.modalOverlay}>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass" 
                        style={styles.modal}
                    >
                        <div style={styles.modalHeader}>
                            <h2>Digital <span className="gold-text">Manifest</span></h2>
                            <button onClick={() => setSelectedOrder(null)} style={styles.closeBtn}><XCircle size={24}/></button>
                        </div>
                        <div style={styles.modalBody}>
                            <div style={styles.manifestMeta}>
                                <p><strong>Acquisition ID:</strong> {selectedOrder._id}</p>
                                <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                <p><strong>Payment Status:</strong> <span style={{color: '#4caf50'}}>AUTHENTICATED & SECURED</span></p>
                                {selectedOrder.isGift && (
                                    <div style={{marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(212, 175, 55, 0.1)', borderRadius: '8px', border: '1px solid rgba(212, 175, 55, 0.2)'}}>
                                        <p style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', color: 'var(--color-gold-primary)'}}>
                                            <Gift size={16} /> LUXURY GIFT SHIPMENT
                                        </p>
                                        {selectedOrder.giftMessage && (
                                            <p style={{marginTop: '0.5rem', fontStyle: 'italic', color: '#ccc'}}>"{selectedOrder.giftMessage}"</p>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div style={styles.manifestItems}>
                                {selectedOrder.items.map((item, idx) => (
                                    <div key={idx} style={styles.manifestItem}>
                                        <div style={{display: 'flex', flexDirection: 'column'}}>
                                            <span style={{fontWeight: '600'}}>{item.name}</span>
                                            <span style={{fontSize: '0.8rem', color: 'var(--color-text-muted)'}}>{item.purity || 'Standard Purity'} • Qty: {item.quantity}</span>
                                        </div>
                                        <span style={{fontWeight: '600', color: 'var(--color-gold-primary)'}}>₹{(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={styles.manifestFooter}>
                                <div style={styles.footerRow}>
                                    <span>Subtotal</span>
                                    <span>₹{selectedOrder.totalAmount.toLocaleString()}</span>
                                </div>
                                <div style={styles.footerRow}>
                                    <span>Insured Shipping</span>
                                    <span style={{color: '#4caf50'}}>COMPLIMENTARY</span>
                                </div>
                                <div style={styles.totalRow}>
                                    <span>Total Acquisition Value</span>
                                    <span className="gold-text">₹{selectedOrder.totalAmount.toLocaleString()}</span>
                                </div>
                            </div>
                            <div style={styles.guarantee}>
                                <FileText size={40} color="rgba(212, 175, 55, 0.2)" style={{marginBottom: '1rem'}} />
                                <p>This digital manifest serves as an official record of your acquisition from Evergreen Elegance. All pieces are hallmarked and guaranteed for their stated purity and craftsmanship.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

const styles = {
    page: {
        paddingTop: 'clamp(100px, 15vw, 120px)',
        paddingBottom: 'clamp(4rem, 10vw, 8rem)',
        minHeight: '100vh',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'clamp(2rem, 5vw, 4rem)',
        flexWrap: 'wrap',
        gap: '1rem',
    },
    title: {
        fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
        marginBottom: '0.5rem',
    },
    subtitle: {
        color: 'var(--color-text-muted)',
        fontSize: 'clamp(0.9rem, 2vw, 1rem)',
    },
    logoutBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: 'clamp(0.6rem, 2vw, 0.8rem) clamp(1rem, 3vw, 1.5rem)',
        borderRadius: '50px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backgroundColor: 'transparent',
        color: 'var(--color-text-main)',
        cursor: 'pointer',
        fontSize: 'clamp(0.85rem, 2vw, 0.9rem)',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'clamp(250px, 30vw, 300px) 1fr',
        gap: 'clamp(1.5rem, 4vw, 3rem)',
    },
    sidebar: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
    },
    profileCard: {
        padding: 'clamp(1.5rem, 4vw, 2.5rem)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        width: 'clamp(60px, 15vw, 80px)',
        height: 'clamp(60px, 15vw, 80px)',
        borderRadius: '50%',
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid var(--color-gold-primary)',
    },
    membershipBadge: {
        marginTop: '1.5rem',
        padding: '0.4rem 1rem',
        borderRadius: '20px',
        backgroundColor: 'var(--color-gold-primary)',
        color: 'var(--color-black)',
        fontSize: '0.75rem',
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    navMenu: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    navItem: {
        padding: 'clamp(0.8rem, 2vw, 1rem) clamp(1rem, 3vw, 1.5rem)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        color: 'var(--color-text-muted)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
    },
    navItemActive: {
        padding: 'clamp(0.8rem, 2vw, 1rem) clamp(1rem, 3vw, 1.5rem)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        color: 'var(--color-gold-primary)',
        backgroundColor: 'rgba(212, 175, 55, 0.05)',
        border: '1px solid rgba(212, 175, 55, 0.1)',
        fontWeight: '600',
        fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
    },
    main: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'clamp(1rem, 3vw, 1.5rem)',
    },
    statCard: {
        padding: 'clamp(1.5rem, 4vw, 2rem)',
    },
    statLabel: {
        fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
        color: 'var(--color-text-muted)',
        marginBottom: '0.5rem',
    },
    statValue: {
        fontSize: 'clamp(1.4rem, 4vw, 1.8rem)',
        fontWeight: '700',
    },
    ordersPanel: {
        padding: 'clamp(1.5rem, 4vw, 2.5rem)',
    },
    orderCard: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'clamp(1rem, 3vw, 1.5rem)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        flexWrap: 'wrap',
        gap: '1rem',
    },
    orderId: {
        fontWeight: '600',
        color: 'var(--color-white)',
        fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
    },
    orderDate: {
        fontSize: 'clamp(0.7rem, 2vw, 0.8rem)',
        color: 'var(--color-text-muted)',
    },
    orderStatus: {
        fontSize: 'clamp(0.7rem, 2vw, 0.8rem)',
        color: 'var(--color-gold-primary)',
    },
    orderActions: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'center',
        minWidth: 'clamp(100px, 25vw, 120px)',
    },
    manifestBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: 'clamp(0.3rem, 1vw, 0.4rem) clamp(0.6rem, 2vw, 0.8rem)',
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        borderRadius: '4px',
        color: 'var(--color-gold-primary)',
        fontSize: 'clamp(0.65rem, 2vw, 0.75rem)',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(1rem, 4vw, 2rem)',
    },
    modal: {
        width: '100%',
        maxWidth: '600px',
        backgroundColor: '#111',
        borderRadius: '12px',
        border: '1px solid #333',
        overflow: 'hidden',
        maxHeight: '90vh',
        overflowY: 'auto',
    },
    modalHeader: {
        padding: 'clamp(1.5rem, 4vw, 2rem)',
        borderBottom: '1px solid #222',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    closeBtn: {
        backgroundColor: 'transparent',
        color: 'var(--color-text-muted)',
    },
    modalBody: {
        padding: 'clamp(1.5rem, 4vw, 2rem)',
    },
    manifestMeta: {
        marginBottom: '2rem',
        fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
        lineHeight: '1.8',
        color: 'var(--color-text-muted)',
    },
    manifestItems: {
        marginBottom: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    manifestItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'clamp(0.8rem, 2vw, 1rem)',
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: '8px',
        flexWrap: 'wrap',
        gap: '1rem',
    },
    manifestFooter: {
        padding: 'clamp(1.5rem, 4vw, 2rem)',
        backgroundColor: 'rgba(212, 175, 55, 0.03)',
        borderRadius: '12px',
        marginBottom: '2rem',
    },
    footerRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '0.8rem',
        fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
        color: 'var(--color-text-muted)',
    },
    totalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '1.5rem',
        paddingTop: '1rem',
        borderTop: '1px solid rgba(212, 175, 55, 0.2)',
        fontWeight: '700',
        fontSize: 'clamp(1rem, 3vw, 1.2rem)',
    },
    guarantee: {
        textAlign: 'center',
        padding: 'clamp(1.5rem, 4vw, 2rem)',
        border: '1px dashed rgba(212, 175, 55, 0.2)',
        borderRadius: '12px',
        fontSize: 'clamp(0.7rem, 2vw, 0.8rem)',
        color: 'var(--color-text-muted)',
        lineHeight: '1.6',
    },
    cartPanel: { padding: 'clamp(1.5rem, 4vw, 2.5rem)', marginBottom: '2rem' },
    panelHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' },
    viewAll: { fontSize: 'clamp(0.75rem, 2vw, 0.85rem)', color: 'var(--color-gold-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' },
    cartItemsScroll: { display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '200px', overflowY: 'auto', paddingRight: '0.5rem' },
    cartItemMini: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px' },
    cartThumb: { width: '50px', height: '50px', borderRadius: '4px', objectFit: 'cover' }
};

export default UserDashboard;
