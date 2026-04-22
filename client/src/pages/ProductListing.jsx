import { getImageUrl } from '@/utils/urls';
import React, { useState, useEffect } from 'react';
import ProductCard from '../components/product/ProductCard';
import { Search, Filter, Layers, Clock, X, Eye, ArrowLeft } from 'lucide-react';
import SEO from '../components/common/SEO';
import axios from '@/api/axios';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ProductListing = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All');
    const [sortOption, setSortOption] = useState('newest');
    const [loading, setLoading] = useState(true);
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

    const openQuickView = (product) => {
        setQuickViewProduct(product);
        setIsQuickViewOpen(true);
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const cat = queryParams.get('category');
        const typ = queryParams.get('type');
        
        if (cat) {
            setCategoryFilter(cat.charAt(0).toUpperCase() + cat.slice(1));
        }
        if (typ) {
            setTypeFilter(typ.charAt(0).toUpperCase() + typ.slice(1));
        }

        const fetchProducts = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get('/api/products');
                setProducts(data);
                setFilteredProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [location.search]);

    useEffect(() => {
        let result = products;

        if (searchTerm) {
            result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        if (categoryFilter !== 'All') {
            result = result.filter(p => p.category === categoryFilter);
        }

        if (typeFilter !== 'All') {
            result = result.filter(p => p.type === typeFilter);
        }

        if (sortOption === 'price-low') {
            result = [...result].sort((a, b) => a.price - b.price);
        } else if (sortOption === 'price-high') {
            result = [...result].sort((a, b) => b.price - a.price);
        }

        setFilteredProducts(result);
    }, [searchTerm, categoryFilter, typeFilter, sortOption, products]);

    return (
        <div style={styles.page}>
            <SEO 
                title="Our Collections" 
                description="Browse our exquisite collection of certified gold jewelry including rings, necklaces, and bangles." 
            />
            <div className="container">
                <div style={{display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem'}}>
                    <Link to="/" style={styles.backBtn}>
                        <ArrowLeft size={20} /> Back to Home
                    </Link>
                </div>
                <header style={styles.header}>
                    <motion.h1 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{...styles.title, fontFamily: "'Playfair Display', serif"}}
                    >
                        EVERGREEN <span className="gold-text">ELEGANCE</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        style={{...styles.subtitle, letterSpacing: '4px', fontWeight: '600'}}
                    >
                        TIMELESS SHINE, FOREVER YOURS
                    </motion.p>
                </header>

                <div style={styles.filterBar}>
                    <div style={styles.searchBox}>
                        <Search size={18} style={styles.searchIcon} />
                        <input 
                            type="text" 
                            placeholder="Search our treasury..." 
                            style={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div style={styles.filters}>
                        <div style={styles.filterItem}>
                            <Layers size={16} />
                            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={styles.select}>
                                <option value="All">All Categories</option>
                                <option value="Rings">Gold Rings</option>
                                <option value="Chains">Chains</option>
                                <option value="Necklaces">Necklaces</option>
                                <option value="Earrings">Earrings</option>
                                <option value="Bracelets">Bracelets</option>
                            </select>
                        </div>

                        <div style={styles.filterItem}>
                            <Filter size={16} />
                            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={styles.select}>
                                <option value="All">All Materials</option>
                                <option value="Gold">Gold</option>
                                <option value="Diamond">Diamond</option>
                                <option value="Silver">Silver</option>
                                <option value="Platinum">Platinum</option>
                            </select>
                        </div>

                        <div style={styles.filterItem}>
                            <Clock size={16} />
                            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} style={styles.select}>
                                <option value="newest">Newest Arrivals</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div style={styles.productGrid}>
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} style={styles.skeletonCard}>
                                <div style={styles.skeletonImg}></div>
                                <div style={styles.skeletonText}></div>
                                <div style={styles.skeletonTextSmall}></div>
                            </div>
                        ))}
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div style={styles.productGrid}>
                        {filteredProducts.map(product => (
                            <ProductCard key={product._id} product={product} onQuickView={openQuickView} />
                        ))}
                    </div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={styles.empty}
                    >
                        <div style={styles.emptyIcon}>✨</div>
                        <h3 style={styles.emptyTitle}>The Treasury is Quiet</h3>
                        <p style={styles.emptyText}>No items match your specific search or filters.</p>
                        <button 
                            onClick={() => {setSearchTerm(''); setCategoryFilter('All'); setTypeFilter('All');}} 
                            className="gold-button"
                            style={{ padding: '0.8rem 2rem' }}
                        >
                            Explore All Jewelry
                        </button>
                    </motion.div>
                )}
            </div>

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
    page: { paddingTop: 'clamp(80px, 12vw, 120px)', paddingBottom: 'clamp(4rem, 8vw, 8rem)' },
    backBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', color: 'var(--color-gold-primary)', border: '1px solid rgba(212, 175, 55, 0.3)', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.3s ease', textDecoration: 'none', width: 'fit-content' },
    header: { textAlign: 'center', marginBottom: 'clamp(2rem, 5vw, 4rem)' },
    title: { fontSize: 'clamp(1.8rem, 5vw, 3rem)', marginBottom: '1rem' },
    subtitle: { color: 'var(--color-text-muted)', fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)', textTransform: 'uppercase' },
    filterBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'clamp(2rem, 4vw, 3rem)', flexWrap: 'wrap', gap: 'clamp(1rem, 3vw, 1.5rem)' },
    searchBox: { position: 'relative', flex: '1', minWidth: 'clamp(250px, 40vw, 300px)' },
    searchIcon: { position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' },
    searchInput: { width: '100%', padding: '0.8rem 1rem 0.8rem 3rem', backgroundColor: '#111', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '4px', color: 'var(--color-white)', outline: 'none' },
    filters: { display: 'flex', gap: 'clamp(0.8rem, 2vw, 1.5rem)', flexWrap: 'wrap' },
    filterItem: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', backgroundColor: '#111', padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid rgba(212, 175, 55, 0.2)' },
    select: { backgroundColor: 'transparent', color: 'var(--color-white)', border: 'none', outline: 'none', fontSize: '0.9rem', cursor: 'pointer' },
    productGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(260px, 30vw, 300px), 1fr))', gap: 'clamp(1.5rem, 3vw, 2.5rem)' },
    empty: { textAlign: 'center', padding: '6rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', background: 'rgba(212, 175, 55, 0.03)', borderRadius: '12px', border: '1px dashed rgba(212, 175, 55, 0.2)' },
    emptyIcon: { fontSize: '3rem', filter: 'grayscale(0.5)' },
    emptyTitle: { fontSize: '1.5rem', color: '#fff' },
    emptyText: { color: 'var(--color-text-muted)', maxWidth: '400px' },
    skeletonCard: { background: '#111', borderRadius: '8px', overflow: 'hidden', height: '400px', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' },
    skeletonImg: { width: '100%', height: '250px', background: 'linear-gradient(90deg, #111, #1a1a1a, #111)', backgroundSize: '200% 100%', animation: 'skeleton 1.5s infinite linear' },
    skeletonText: { width: '70%', height: '20px', background: '#1a1a1a' },
    skeletonTextSmall: { width: '40%', height: '15px', background: '#1a1a1a' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(0.5rem, 3vw, 2rem)' },
    modalContent: { backgroundColor: '#0a0a0a', width: '100%', maxWidth: '1000px', maxHeight: '90vh', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.2)', overflowY: 'auto', position: 'relative' },
    modalHeader: { padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, backgroundColor: '#0a0a0a', zIndex: 10 },
    modalTitle: { fontSize: '1.8rem', color: '#fff', margin: 0 },
    modalSubtitle: { color: 'var(--color-gold-primary)', fontSize: '0.9rem', margin: '0.2rem 0 0' },
    closeBtn: { background: 'transparent', color: '#fff', border: 'none', cursor: 'pointer' },
    modalBody: { padding: '2rem' },
    imageGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' },
    imageCard: { borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', height: '250px' },
    cardImg: { width: '100%', height: '100%', objectFit: 'cover' },
    modalInfo: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    modalPrice: { fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-gold-primary)' },
    modalDesc: { color: 'var(--color-text-muted)', lineHeight: '1.6', fontSize: '1.1rem' },
    modalActions: { marginTop: '1rem' },
    fullDetailBtn: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', padding: '1.2rem' }
};

export default ProductListing;
