import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/product/ProductCard';
import { Heart, X, Star, Eye, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { motion, AnimatePresence } from 'framer-motion';

const Wishlist = () => {
    const { wishlist } = useCart();
    const navigate = useNavigate();
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

    const openQuickView = (product) => {
        setQuickViewProduct(product);
        setIsQuickViewOpen(true);
    };

    const getImageUrl = (path) => {
        if (!path) return 'https://via.placeholder.com/600x600?text=No+Image';
        return path.startsWith('http') ? path : `${path}`;
    };

    if (wishlist.length === 0) {
        return (
            <div style={styles.empty}>
                <SEO title="My Wishlist" />
                <Heart size={80} color="var(--color-gold-primary)" />
                <h2>Your wishlist is empty</h2>
                <p>Save your favorite gold pieces here to view them later.</p>
                <Link to="/products" className="gold-button" style={{marginTop: '2rem'}}>Explore Jewelry</Link>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            <SEO title="My Wishlist" />
            <div className="container">
                <h1 style={styles.title}>My <span className="gold-text">Wishlist</span></h1>
                
                <div style={styles.grid}>
                    {wishlist.map(product => (
                        <ProductCard key={product._id} product={product} onQuickView={openQuickView} />
                    ))}
                </div>
            </div>

            {/* Quick View Modal */}
            <AnimatePresence>
                {isQuickViewOpen && quickViewProduct && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={styles.modalOverlay}
                        onClick={() => setIsQuickViewOpen(false)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            style={styles.modalContent}
                            onClick={e => e.stopPropagation()}
                        >
                            <div style={styles.modalHeader}>
                                <div>
                                    <h2 style={styles.modalTitle}>{quickViewProduct.name}</h2>
                                    <p style={styles.modalSubtitle}>{quickViewProduct.category} • {quickViewProduct.purity}</p>
                                </div>
                                <button onClick={() => setIsQuickViewOpen(false)} style={styles.closeBtn}><X size={24}/></button>
                            </div>

                            <div style={styles.modalBody}>
                                <div style={styles.imageGrid}>
                                    {quickViewProduct.images && quickViewProduct.images.length > 0 ? (
                                        quickViewProduct.images.map((img, idx) => (
                                            <div key={idx} style={styles.imageCard}>
                                                <img src={getImageUrl(img)} alt={`${quickViewProduct.name} view ${idx + 1}`} style={styles.cardImg} />
                                                <div style={styles.cardTag}>Card {idx + 1}</div>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={styles.imageCard}>
                                            <img src="https://via.placeholder.com/400x400?text=No+Image" alt="Placeholder" style={styles.cardImg} />
                                        </div>
                                    )}
                                </div>
                                
                                <div style={styles.modalInfo}>
                                    <div style={styles.modalPrice}>₹{quickViewProduct.price?.toLocaleString()}</div>
                                    <p style={styles.modalDesc}>{quickViewProduct.description}</p>
                                    <div style={styles.modalActions}>
                                        <button onClick={() => {setIsQuickViewOpen(false); navigate(`/product/${quickViewProduct._id}`);}} className="gold-button" style={styles.fullDetailBtn}>
                                            <Eye size={18} /> VIEW FULL DETAILS
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const styles = {
    page: {
        paddingTop: '120px',
        paddingBottom: '8rem',
    },
    title: {
        fontSize: '2.5rem',
        marginBottom: '4rem',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '2.5rem',
    },
    empty: {
        paddingTop: '200px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
    },
    modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' },
    modalContent: { backgroundColor: '#111', width: '100%', maxWidth: '900px', maxHeight: '90vh', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.2)', overflowY: 'auto', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' },
    modalHeader: { padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, backgroundColor: '#111', zIndex: 10 },
    modalTitle: { fontSize: '1.8rem', color: '#fff', margin: 0 },
    modalSubtitle: { color: 'var(--color-gold-primary)', fontSize: '0.9rem', margin: '0.2rem 0 0' },
    closeBtn: { background: 'transparent', color: '#fff', border: 'none', cursor: 'pointer' },
    modalBody: { padding: '2rem' },
    imageGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' },
    imageCard: { position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', height: '250px' },
    cardImg: { width: '100%', height: '100%', objectFit: 'cover' },
    cardTag: { position: 'absolute', bottom: '0.5rem', right: '0.5rem', backgroundColor: 'rgba(0,0,0,0.7)', color: 'var(--color-gold-primary)', fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px' },
    modalInfo: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    modalPrice: { fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-gold-primary)' },
    modalDesc: { color: 'var(--color-text-muted)', lineHeight: '1.6', fontSize: '1rem' },
    modalActions: { marginTop: '1rem' },
    fullDetailBtn: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', padding: '1rem' }
};

export default Wishlist;
