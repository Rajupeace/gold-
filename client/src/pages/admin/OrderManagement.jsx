import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, XCircle, Search, Eye, ExternalLink, MessageSquare } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const OrderManagement = () => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, [user.token]);

    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const { data } = await axios.get('/api/orders', config);
            setOrders(data);
            setLoading(false);
        } catch (error) {
            toast.error("Failed to fetch orders");
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            await axios.put(`/api/orders/${id}/status`, { orderStatus: newStatus }, config);
            setOrders(orders.map(o => o._id === id ? { ...o, orderStatus: newStatus } : o));
            toast.success(`Order status updated to ${newStatus}`);
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleWhatsApp = (phone, orderId) => {
        const message = `Hello, this is Evergreen Elegance regarding your order #${orderId.slice(-8).toUpperCase()}. We are currently processing your acquisition.`;
        const encodedMsg = encodeURIComponent(message);
        window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodedMsg}`, '_blank');
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'delivered': return '#4caf50';
            case 'shipped': return '#2196f3';
            case 'processing': return '#ff9800';
            case 'cancelled': return '#f44336';
            default: return 'var(--color-text-muted)';
        }
    };

    return (
        <div style={styles.page}>
            <div className="container">
                <header style={styles.header}>
                    <h1 style={{fontFamily: "'Playfair Display', serif"}}>Boutique <span className="gold-text">Orders</span></h1>
                    <div style={styles.searchBar}>
                        <Search size={20} style={styles.searchIcon} />
                        <input 
                            type="text" 
                            placeholder="Search by Order ID or Client..." 
                            style={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </header>

                <div style={styles.orderGrid}>
                    {orders.filter(o => 
                        o._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        o.user.name.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map(order => (
                        <div key={order._id} style={styles.orderCard}>
                            <div style={styles.orderHeader}>
                                <div>
                                    <span style={styles.orderIdLabel}>MANIFEST ID:</span>
                                    <span style={styles.orderIdValue}>{order._id.slice(-8).toUpperCase()}</span>
                                </div>
                                <div style={{display: 'flex', gap: '0.8rem', alignItems: 'center'}}>
                                    <button 
                                        onClick={() => handleWhatsApp(order.shippingAddress.phone, order._id)}
                                        style={styles.waIconBtn}
                                        title="Message Client"
                                    >
                                        <MessageSquare size={16} />
                                    </button>
                                    <span style={{
                                        ...styles.statusBadge,
                                        backgroundColor: `${getStatusColor(order.orderStatus)}15`,
                                        color: getStatusColor(order.orderStatus)
                                    }}>
                                        {order.orderStatus.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            <div style={styles.orderBody}>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <div style={styles.clientInfo}>
                                        <span style={styles.clientName}>{order.user.name}</span>
                                        <span style={styles.clientEmail}>{order.user.email}</span>
                                    </div>
                                    <div style={{textAlign: 'right'}}>
                                        <span style={styles.paymentLabel}>PAYMENT:</span>
                                        <span style={{
                                            ...styles.paymentStatus,
                                            color: order.paymentStatus === 'paid' ? '#4caf50' : '#ff9800'
                                        }}>
                                            {order.paymentStatus.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div style={styles.orderSummary}>
                                    <div style={styles.summaryItem}>
                                        <Package size={14} style={styles.summaryIcon} />
                                        <span>{order.items.length} {order.items.length === 1 ? 'Piece' : 'Pieces'}</span>
                                    </div>
                                    <div style={styles.summaryItem}>
                                        <span style={styles.totalLabel}>Acquisition Value:</span>
                                        <span style={styles.totalValue}>${order.totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div style={styles.orderFooter}>
                                <div style={styles.statusUpdate}>
                                    <select 
                                        value={order.orderStatus} 
                                        onChange={(e) => updateStatus(order._id, e.target.value)}
                                        style={styles.statusSelect}
                                    >
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                                <button onClick={() => setSelectedOrder(order)} style={styles.manifestBtn}>
                                    <Eye size={16} /> VIEW MANIFEST
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Details Modal */}
                {selectedOrder && (
                    <div style={styles.modalOverlay}>
                        <div style={styles.modal}>
                            <div style={styles.modalHeader}>
                                <h2>Order <span className="gold-text">Details</span></h2>
                                <button onClick={() => setSelectedOrder(null)} style={{backgroundColor: 'transparent', color: '#fff', border: 'none', cursor: 'pointer'}}><XCircle size={24}/></button>
                            </div>
                            
                            <div style={styles.modalContent}>
                                <div style={styles.modalSection}>
                                    <h4>Customer Info</h4>
                                    <p><strong>Name:</strong> {selectedOrder.user?.name}</p>
                                    <p><strong>Email:</strong> {selectedOrder.user?.email}</p>
                                </div>
                                
                                <div style={styles.modalSection}>
                                    <h4>Shipping Address</h4>
                                    <p>{selectedOrder.shippingAddress.address}</p>
                                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem'}}>
                                        <p style={{margin: 0}}><strong>Phone:</strong> {selectedOrder.shippingAddress.phone}</p>
                                        <button 
                                            onClick={() => handleWhatsApp(selectedOrder.shippingAddress.phone, selectedOrder._id)}
                                            style={styles.waModalBtn}
                                        >
                                            <MessageSquare size={14} /> Contact on WhatsApp
                                        </button>
                                    </div>
                                </div>

                                <div style={styles.modalSection}>
                                    <h4>Order Status</h4>
                                    <p><strong>Payment:</strong> <span style={{color: selectedOrder.paymentStatus === 'paid' ? '#4caf50' : '#ff9800'}}>{selectedOrder.paymentStatus.toUpperCase()}</span></p>
                                    {selectedOrder.razorpayPaymentId && (
                                        <p><strong>Transaction ID:</strong> <span className="gold-text" style={{fontFamily: 'monospace'}}>{selectedOrder.razorpayPaymentId}</span></p>
                                    )}
                                    <p><strong>Fulfillment:</strong> {selectedOrder.orderStatus.toUpperCase()}</p>
                                </div>

                                <div style={styles.modalSection}>
                                    <h4>Items</h4>
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} style={styles.modalItem}>
                                            <span>{item.name} x{item.quantity}</span>
                                            <span>${(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}
                                    <div style={styles.modalTotal}>
                                        <strong>Total Amount</strong>
                                        <strong className="gold-text">${selectedOrder.totalAmount.toLocaleString()}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    page: { paddingTop: '120px', paddingBottom: '8rem', backgroundColor: '#000', minHeight: '100vh' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3.5rem', flexWrap: 'wrap', gap: '1.5rem' },
    searchBar: { position: 'relative', width: '380px' },
    searchIcon: { position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gold-primary)' },
    searchInput: { width: '100%', padding: '0.9rem 1rem 0.9rem 3rem', backgroundColor: '#0a0a0a', border: '1px solid rgba(226, 156, 129, 0.2)', borderRadius: '8px', color: 'var(--color-white)', outline: 'none', transition: 'all 0.3s', '&:focus': { borderColor: 'var(--color-gold-primary)' } },
    orderGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '2rem'
    },
    orderCard: {
        backgroundColor: '#0a0a0a',
        borderRadius: '12px',
        border: '1px solid rgba(226, 156, 129, 0.1)',
        padding: '1.8rem',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        '&:hover': {
            transform: 'translateY(-5px)',
            borderColor: 'rgba(226, 156, 129, 0.3)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.6)'
        }
    },
    orderHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        paddingBottom: '1rem'
    },
    orderIdLabel: { fontSize: '0.65rem', color: 'var(--color-text-muted)', display: 'block', letterSpacing: '1px' },
    orderIdValue: { fontSize: '1rem', color: 'var(--color-gold-primary)', fontWeight: '700', fontFamily: "'Outfit', sans-serif" },
    statusBadge: { padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '1px' },
    orderBody: { display: 'flex', flexDirection: 'column', gap: '1.2rem' },
    clientInfo: { display: 'flex', flexDirection: 'column', gap: '0.2rem' },
    clientName: { fontSize: '1.1rem', color: '#fff', fontWeight: '600' },
    clientEmail: { fontSize: '0.85rem', color: 'var(--color-text-muted)' },
    paymentLabel: { fontSize: '0.65rem', color: 'var(--color-text-muted)', display: 'block', letterSpacing: '1px' },
    paymentStatus: { fontSize: '0.85rem', fontWeight: '700' },
    orderSummary: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '6px' },
    summaryItem: { display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#eee' },
    summaryIcon: { color: 'var(--color-gold-primary)' },
    totalLabel: { fontSize: '0.75rem', color: 'var(--color-text-muted)', marginRight: '0.5rem' },
    totalValue: { color: 'var(--color-gold-primary)', fontWeight: '700' },
    orderFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', gap: '1rem' },
    statusUpdate: { flex: 1 },
    statusSelect: { width: '100%', backgroundColor: '#000', color: '#fff', border: '1px solid #333', padding: '0.5rem', borderRadius: '4px', fontSize: '0.85rem', outline: 'none' },
    waIconBtn: { backgroundColor: 'transparent', border: '1px solid rgba(76, 175, 80, 0.3)', color: '#4caf50', borderRadius: '4px', padding: '0.4rem', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', '&:hover': { backgroundColor: 'rgba(76, 175, 80, 0.1)', borderColor: '#4caf50' } },
    waModalBtn: { backgroundColor: 'rgba(76, 175, 80, 0.1)', border: '1px solid rgba(76, 175, 80, 0.3)', color: '#4caf50', borderRadius: '4px', padding: '0.3rem 0.8rem', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s', '&:hover': { backgroundColor: 'rgba(76, 175, 80, 0.2)', borderColor: '#4caf50' } },
    manifestBtn: { backgroundColor: 'transparent', border: '1px solid rgba(226, 156, 129, 0.4)', color: 'var(--color-gold-primary)', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s', '&:hover': { backgroundColor: 'rgba(226, 156, 129, 0.1)' } },
    modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 },
    modal: { backgroundColor: '#0a0a0a', width: '90%', maxWidth: '650px', borderRadius: '12px', border: '1px solid var(--color-gold-primary)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)', overflow: 'hidden' },
    modalHeader: { padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    modalContent: { padding: '2.5rem', maxHeight: '75vh', overflowY: 'auto' },
    modalSection: { marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' },
    modalItem: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', fontSize: '0.95rem' },
    modalTotal: { display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', borderTop: '1px solid var(--color-gold-primary)', paddingTop: '1.5rem', fontSize: '1.2rem', fontWeight: '700' }
};

export default OrderManagement;
