import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Truck, ShieldCheck, ArrowLeft, CheckCircle2, MapPin, Package, Wallet, ChevronRight, Plus, Gift } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Checkout = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [currentStep, setCurrentStep] = useState(1);
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
    
    const [selectedPayment, setSelectedPayment] = useState('razorpay');
    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: ''
    });

    const [isGift, setIsGift] = useState(false);
    const [giftMessage, setGiftMessage] = useState('');

    const ADMIN_UPI_ID = '9182030946-2@axl';

    useEffect(() => {
        if (user) {
            fetchAddresses();
        }
    }, [user]);

    const fetchAddresses = async () => {
        try {
            const { data } = await axios.get('/api/auth/addresses', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setSavedAddresses(data);
            if (data.length > 0) {
                const defaultAddr = data.find(a => a.isDefault) || data[0];
                setSelectedAddressId(defaultAddr._id);
                setFormData(defaultAddr);
            } else {
                setIsAddingNewAddress(true);
            }
        } catch (error) {
            console.error("Failed to fetch addresses");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectAddress = (addr) => {
        setSelectedAddressId(addr._id);
        setFormData(addr);
        setIsAddingNewAddress(false);
    };

    const handleAddNewAddress = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/auth/address', formData, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setSavedAddresses(data);
            const newAddr = data[data.length - 1];
            setSelectedAddressId(newAddr._id);
            setIsAddingNewAddress(false);
            toast.success("Address saved successfully");
        } catch (error) {
            toast.error("Failed to save address");
        }
    };

    const handlePayment = async (e) => {
        if (e) e.preventDefault();

        if (!user) {
            toast.warning("Please login to proceed with payment.");
            navigate('/login');
            return;
        }

        if (cart.length === 0) {
            toast.error("Your cart is empty.");
            return;
        }

        // For direct UPI payment, show confirmation dialog
        if (selectedPayment === 'upi') {
            const confirmed = window.confirm(
                `Please complete the UPI payment to:\n\n${ADMIN_UPI_ID}\n\nAmount: ₹${cartTotal.toLocaleString()}\n\nAfter payment, click OK to confirm and place your order.`
            );
            if (!confirmed) return;
        }

        try {
            toast.info("Initializing Acquisition...");

            const formattedItems = cart.map(item => ({
                product: item._id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                images: item.images
            }));

            // 1. Create order on backend
            const { data: orderData } = await axios.post('/api/orders', {
                items: formattedItems,
                totalAmount: cartTotal,
                shippingAddress: formData,
                paymentMethod: selectedPayment,
                isGift,
                giftMessage
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            // 2. If Razorpay, open the modal
            if (selectedPayment === 'razorpay') {
                if (orderData.isDemo) {
                    toast.info("Demo Mode: Simulating secure payment...");
                    setTimeout(async () => {
                        try {
                            const verifyData = {
                                razorpayPaymentId: 'demo_pay_' + Date.now(),
                                razorpayOrderId: orderData.razorpayOrderId,
                                razorpaySignature: 'demo_sig'
                            };

                            const { data: verifyResponse } = await axios.post(
                                '/api/orders/verify',
                                verifyData,
                                { headers: { Authorization: `Bearer ${user.token}` } }
                            );

                            clearCart();
                            toast.success("Demo Payment Successful!");
                            navigate('/success', { state: { order: verifyResponse.order } });
                        } catch (err) {
                            toast.error("Demo verification failed.");
                        }
                    }, 2000);
                    return;
                }

                if (!window.Razorpay) {
                    toast.error("Razorpay SDK failed to load. Please check your internet connection.");
                    return;
                }

                const options = {
                    key: orderData.key_id,
                    amount: orderData.amount,
                    currency: orderData.currency,
                    name: "Evergreen Elegance",
                    description: "Luxury Jewelry Acquisition",
                    image: "/logo.png",
                    order_id: orderData.razorpayOrderId,
                    handler: async function (response) {
                        try {
                            const verifyData = {
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpayOrderId: response.razorpay_order_id,
                                razorpaySignature: response.razorpay_signature,
                            };

                            const { data: verifyResponse } = await axios.post(
                                '/api/orders/verify',
                                verifyData,
                                { headers: { Authorization: `Bearer ${user.token}` } }
                            );

                            clearCart();
                            navigate('/success', { state: { order: verifyResponse.order } });
                        } catch (err) {
                            toast.error("Payment verification failed.");
                        }
                    },
                    prefill: {
                        name: formData.fullName,
                        email: formData.email,
                        contact: formData.phone
                    },
                    theme: { color: "#c5a059" }
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
                return;
            }

            // 3. For COD or UPI
            clearCart();
            navigate('/success', { state: { order: orderData.order } });

        } catch (error) {
            console.error('Order error:', error);
            toast.error(error.response?.data?.message || "Order placement failed");
        }
    };

    if (cart.length === 0) {
        return (
            <div style={styles.emptyContainer}>
                <Package size={64} color="var(--color-gold-primary)" />
                <h2 style={{marginTop: '2rem'}}>Your cart is empty</h2>
                <Link to="/products" className="gold-button" style={{marginTop: '2rem'}}>Browse Collection</Link>
            </div>
        );
    }

    const steps = [
        { id: 1, name: 'Delivery', icon: MapPin },
        { id: 2, name: 'Payment', icon: Wallet },
        { id: 3, name: 'Review', icon: Package },
    ];

    return (
        <div style={styles.page}>
            <div className="container">
                <div style={{display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem'}}>
                    <button onClick={() => navigate('/cart')} style={styles.backBtn}>
                        <ArrowLeft size={20} /> Back to Cart
                    </button>
                </div>
                {/* Amazon-style Progress Bar */}
                <div style={styles.stepper}>
                    {steps.map((step, idx) => (
                        <React.Fragment key={step.id}>
                            <div 
                                style={{
                                    ...styles.step, 
                                    color: currentStep >= step.id ? 'var(--color-gold-primary)' : '#555'
                                }}
                                onClick={() => currentStep > step.id && setCurrentStep(step.id)}
                            >
                                <div style={{
                                    ...styles.stepIcon,
                                    backgroundColor: currentStep >= step.id ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                                    borderColor: currentStep >= step.id ? 'var(--color-gold-primary)' : '#333'
                                }}>
                                    {currentStep > step.id ? <CheckCircle2 size={20} /> : <step.icon size={20} />}
                                </div>
                                <span style={styles.stepName}>{step.name}</span>
                            </div>
                            {idx < steps.length - 1 && (
                                <div style={{
                                    ...styles.stepLine,
                                    backgroundColor: currentStep > step.id ? 'var(--color-gold-primary)' : '#333'
                                }} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <div style={styles.grid}>
                    <div style={styles.mainContent}>
                        <AnimatePresence mode="wait">
                            {currentStep === 1 && (
                                <motion.div 
                                    key="step1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                >
                                    <h2 style={styles.stepTitle}>Select a delivery address</h2>
                                    
                                    <div style={styles.addressGrid}>
                                        {savedAddresses.map(addr => (
                                            <div 
                                                key={addr._id} 
                                                style={{
                                                    ...styles.addressCard,
                                                    borderColor: selectedAddressId === addr._id ? 'var(--color-gold-primary)' : '#333'
                                                }}
                                                onClick={() => handleSelectAddress(addr)}
                                            >
                                                <div style={styles.addressHeader}>
                                                    <strong>{addr.fullName}</strong>
                                                    {addr.isDefault && <span style={styles.defaultBadge}>Default</span>}
                                                </div>
                                                <p style={styles.addressText}>{addr.address}</p>
                                                <p style={styles.addressText}>{addr.city}, {addr.state} - {addr.zipCode}</p>
                                                <p style={styles.addressText}>Phone: {addr.phone}</p>
                                                
                                                <button 
                                                    style={styles.useAddressBtn}
                                                    onClick={() => {
                                                        handleSelectAddress(addr);
                                                        setCurrentStep(2);
                                                    }}
                                                >
                                                    Use this address
                                                </button>
                                            </div>
                                        ))}
                                        
                                        {!isAddingNewAddress ? (
                                            <div style={styles.addNewAddressCard} onClick={() => setIsAddingNewAddress(true)}>
                                                <Plus size={32} />
                                                <span>Add a new address</span>
                                            </div>
                                        ) : (
                                            <form style={styles.newAddressForm} onSubmit={handleAddNewAddress}>
                                                <h3 style={{marginBottom: '1.5rem'}}>Add Address</h3>
                                                <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required style={styles.input} />
                                                <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required style={styles.input} />
                                                <input type="text" name="address" placeholder="Street Address" value={formData.address} onChange={handleChange} required style={styles.input} />
                                                <div style={styles.formRow}>
                                                    <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required style={styles.input} />
                                                    <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} required style={styles.input} />
                                                </div>
                                                <input type="text" name="zipCode" placeholder="ZIP Code" value={formData.zipCode} onChange={handleChange} required style={styles.input} />
                                                <div style={styles.formActions}>
                                                    <button type="button" onClick={() => setIsAddingNewAddress(false)} style={styles.cancelBtn}>Cancel</button>
                                                    <button type="submit" className="gold-button">Save & Deliver Here</button>
                                                </div>
                                            </form>
                                        )}
                                    </div>
                                    
                                    {savedAddresses.length > 0 && !isAddingNewAddress && (
                                        <div style={{marginTop: '2rem', display: 'flex', justifyContent: 'flex-end'}}>
                                            <button className="gold-button" onClick={() => setCurrentStep(2)}>
                                                CONTINUE TO PAYMENT <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {currentStep === 2 && (
                                <motion.div 
                                    key="step2"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                >
                                    <h2 style={styles.stepTitle}>Select a payment method</h2>
                                    
                                    <div style={styles.paymentContainer}>
                                        <div 
                                            style={{...styles.paymentRow, borderColor: selectedPayment === 'razorpay' ? 'var(--color-gold-primary)' : '#333'}}
                                            onClick={() => setSelectedPayment('razorpay')}
                                        >
                                            <input type="radio" checked={selectedPayment === 'razorpay'} readOnly />
                                            <div style={styles.paymentInfo}>
                                                <strong>Razorpay Secure Gateway</strong>
                                                <p>Cards, NetBanking, UPI, Wallets</p>
                                            </div>
                                        </div>

                                        <div 
                                            style={{...styles.paymentRow, borderColor: selectedPayment === 'upi' ? 'var(--color-gold-primary)' : '#333'}}
                                            onClick={() => setSelectedPayment('upi')}
                                        >
                                            <input type="radio" checked={selectedPayment === 'upi'} readOnly />
                                            <div style={styles.paymentInfo}>
                                                <strong>Direct UPI Transfer</strong>
                                                <p>Pay manually to our business UPI ID</p>
                                            </div>
                                        </div>

                                        <div 
                                            style={{...styles.paymentRow, borderColor: selectedPayment === 'cod' ? 'var(--color-gold-primary)' : '#333'}}
                                            onClick={() => setSelectedPayment('cod')}
                                        >
                                            <input type="radio" checked={selectedPayment === 'cod'} readOnly />
                                            <div style={styles.paymentInfo}>
                                                <strong>Cash on Delivery (COD)</strong>
                                                <p>Pay when your jewelry arrives</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{marginTop: '2rem', display: 'flex', justifyContent: 'space-between'}}>
                                        <button style={styles.backBtnAction} onClick={() => setCurrentStep(1)}>
                                            <ArrowLeft size={18} /> Back to Delivery
                                        </button>
                                        <button className="gold-button" onClick={() => setCurrentStep(3)}>
                                            REVIEW ORDER <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 3 && (
                                <motion.div 
                                    key="step3"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                >
                                    <h2 style={styles.stepTitle}>Review your order</h2>
                                    
                                    <div style={styles.reviewGrid}>
                                        <div style={styles.reviewSection}>
                                            <div style={styles.reviewHeader}>
                                                <h3>Delivery Address</h3>
                                                <button style={styles.editBtn} onClick={() => setCurrentStep(1)}>Edit</button>
                                            </div>
                                            <p>{formData.fullName}</p>
                                            <p>{formData.address}, {formData.city}, {formData.state} {formData.zipCode}</p>
                                            <p>Phone: {formData.phone}</p>
                                        </div>

                                        <div style={styles.reviewSection}>
                                            <div style={styles.reviewHeader}>
                                                <h3>Payment Method</h3>
                                                <button style={styles.editBtn} onClick={() => setCurrentStep(2)}>Edit</button>
                                            </div>
                                            <p>{selectedPayment.toUpperCase()}</p>
                                        </div>

                                        <div style={styles.reviewSection}>
                                            <div style={styles.reviewHeader}>
                                                <h3>Gifting Options</h3>
                                                <button style={styles.editBtn} onClick={() => setIsGift(!isGift)}>{isGift ? 'Remove' : 'Add'}</button>
                                            </div>
                                            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                                <Gift size={16} color={isGift ? "var(--color-gold-primary)" : "#555"} />
                                                <span>{isGift ? 'Luxury Gift Packaging' : 'Standard Packaging'}</span>
                                            </div>
                                            {isGift && (
                                                <div style={{marginTop: '1rem'}}>
                                                    <p style={{fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem'}}>Message:</p>
                                                    <textarea 
                                                        value={giftMessage}
                                                        onChange={(e) => setGiftMessage(e.target.value)}
                                                        placeholder="Write a heartfelt message..."
                                                        style={styles.giftTextarea}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div style={styles.reviewItems}>
                                        <h3 style={{marginBottom: '1rem'}}>Items</h3>
                                        {cart.map(item => (
                                            <div key={item._id} style={styles.reviewItem}>
                                                <img src={item.images[0].startsWith('http') ? item.images[0] : `${item.images[0]}`} alt="" style={styles.reviewImg} />
                                                <div style={{flex: 1}}>
                                                    <div style={styles.itemName}>{item.name}</div>
                                                    <div style={styles.itemQty}>Quantity: {item.quantity}</div>
                                                </div>
                                                <div style={styles.itemPrice}>₹{(item.price * item.quantity).toLocaleString()}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                        <button style={styles.backBtnAction} onClick={() => setCurrentStep(2)}>
                                            <ArrowLeft size={18} /> Back to Payment
                                        </button>
                                        <div style={styles.finalActions}>
                                            <div style={styles.finalTotal}>
                                                <span>Order Total:</span>
                                                <strong className="gold-text">₹{cartTotal.toLocaleString()}</strong>
                                            </div>
                                            <button className="gold-button" onClick={handlePayment} style={styles.placeOrderBtn}>
                                                PLACE YOUR ORDER
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Sidebar Summary */}
                    <div style={styles.sidebar}>
                        <div style={styles.summaryCard}>
                            <h3 style={{marginBottom: '1.5rem', fontSize: '1.1rem'}}>Order Summary</h3>
                            <div style={styles.summaryRow}>
                                <span>Items:</span>
                                <span>₹{cartTotal.toLocaleString()}</span>
                            </div>
                            <div style={styles.summaryRow}>
                                <span>Delivery:</span>
                                <span style={{color: '#4caf50'}}>FREE</span>
                            </div>
                            <div style={styles.totalRow}>
                                <span>Order Total:</span>
                                <span>₹{cartTotal.toLocaleString()}</span>
                            </div>
                            
                            {currentStep < 3 && (
                                <button 
                                    className="gold-button" 
                                    style={{width: '100%', marginTop: '1.5rem'}}
                                    onClick={() => setCurrentStep(prev => prev + 1)}
                                >
                                    CONTINUE
                                </button>
                            )}
                            
                            <div style={styles.securityInfo}>
                                <ShieldCheck size={16} />
                                <span>Safe and Secure Payments. 100% Authentic Jewelry.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: { paddingTop: '120px', paddingBottom: '8rem', backgroundColor: '#000', minHeight: '100vh' },
    emptyContainer: { padding: '200px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    stepper: { display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4rem', maxWidth: '800px', margin: '0 auto 4rem' },
    step: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', flex: 1 },
    stepIcon: { width: '40px', height: '40px', borderRadius: '50%', border: '2px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' },
    stepName: { fontSize: '0.85rem', fontWeight: '600', letterSpacing: '0.5px' },
    stepLine: { height: '2px', flex: 1, margin: '0 10px', marginTop: '-20px' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 350px', gap: '3rem', alignItems: 'start' },
    mainContent: { backgroundColor: '#0a0a0a', padding: '2rem', borderRadius: '12px', border: '1px solid #222' },
    stepTitle: { fontSize: '1.5rem', marginBottom: '2rem', fontFamily: "'Playfair Display', serif" },
    addressGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' },
    addressCard: { padding: '1.5rem', borderRadius: '8px', border: '1px solid', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: '#111' },
    addressHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' },
    defaultBadge: { fontSize: '0.7rem', backgroundColor: 'rgba(212, 175, 55, 0.2)', color: 'var(--color-gold-primary)', padding: '2px 8px', borderRadius: '4px' },
    addressText: { fontSize: '0.9rem', color: '#888', lineHeight: '1.5' },
    useAddressBtn: { width: '100%', marginTop: '1.5rem', padding: '0.6rem', backgroundColor: '#222', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' },
    addNewAddressCard: { border: '2px dashed #333', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: '#555', cursor: 'pointer', minHeight: '200px', transition: 'all 0.2s', '&:hover': { borderColor: 'var(--color-gold-primary)', color: 'var(--color-gold-primary)' } },
    newAddressForm: { gridColumn: '1 / -1', padding: '2rem', backgroundColor: '#111', borderRadius: '8px' },
    formRow: { display: 'flex', gap: '1rem' },
    input: { width: '100%', padding: '0.8rem', backgroundColor: '#000', border: '1px solid #333', borderRadius: '4px', color: '#fff', marginBottom: '1rem', outline: 'none' },
    formActions: { display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' },
    cancelBtn: { padding: '0.8rem 1.5rem', backgroundColor: 'transparent', color: '#888', border: 'none', cursor: 'pointer' },
    paymentContainer: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    paymentRow: { display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', borderRadius: '8px', border: '1px solid', cursor: 'pointer', backgroundColor: '#111' },
    paymentInfo: { flex: 1 },
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
    },
    backBtnAction: { display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'transparent', color: '#888', border: 'none', cursor: 'pointer' },
    reviewGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' },
    reviewSection: { padding: '1.5rem', backgroundColor: '#111', borderRadius: '8px', border: '1px solid #222' },
    reviewHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
    editBtn: { color: 'var(--color-gold-primary)', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.9rem' },
    reviewItems: { borderTop: '1px solid #222', paddingTop: '2rem' },
    reviewItem: { display: 'flex', gap: '1.5rem', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid #111' },
    reviewImg: { width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' },
    itemName: { fontWeight: '600' },
    itemQty: { fontSize: '0.85rem', color: '#666' },
    itemPrice: { fontWeight: '700' },
    finalActions: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' },
    finalTotal: { fontSize: '1.2rem', display: 'flex', gap: '1rem' },
    placeOrderBtn: { padding: '1rem 3rem', fontSize: '1.1rem' },
    sidebar: { position: 'sticky', top: '120px' },
    summaryCard: { backgroundColor: '#0a0a0a', padding: '2rem', borderRadius: '12px', border: '1px solid #222' },
    summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.95rem', color: '#888' },
    totalRow: { display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #222', fontSize: '1.2rem', fontWeight: '700' },
    securityInfo: { marginTop: '2rem', display: 'flex', gap: '0.8rem', fontSize: '0.75rem', color: '#555', lineHeight: '1.4' },
    giftTextarea: {
        width: '100%',
        padding: '0.8rem',
        backgroundColor: '#0a0a0a',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        borderRadius: '4px',
        color: '#fff',
        fontSize: '0.85rem',
        minHeight: '80px',
        outline: 'none',
        resize: 'none',
        marginTop: '0.5rem'
    }
};

export default Checkout;
