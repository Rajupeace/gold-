import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, ShieldCheck, Truck, RefreshCcw, Star, Plus, Minus, MessageCircle, X, Sparkles, ArrowLeft, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/common/SEO';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToCart, wishlist, toggleWishlist } = useCart();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState('');
    const [recentlyViewed, setRecentlyViewed] = useState([]);
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
    const [isZooming, setIsZooming] = useState(false);

    const fetchProduct = async () => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
            setProduct({
                ...data,
                specifications: [
                    { key: 'Metal', value: data.purity },
                    { key: 'Weight', value: `${data.weight}g` },
                    { key: 'Certified', value: data.category === 'Diamond' ? 'GIA' : 'BIS Hallmarked' }
                ]
            });
            setSelectedImage(0);

            // Add to recently viewed
            const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
            const updatedViewed = [data, ...viewed.filter(p => p._id !== data._id)].slice(0, 4);
            localStorage.setItem('recentlyViewed', JSON.stringify(updatedViewed));
            setRecentlyViewed(updatedViewed.filter(p => p._id !== data._id));
        } catch (error) {
            console.error("Error fetching product:", error);
        }
    };

    // API Fetch
    useEffect(() => {
        fetchProduct();
    }, [id]);

    const submitReview = async () => {
        if (!user) {
            toast.info("Please login to share your experience");
            navigate('/login', { state: { from: { pathname: `/product/${id}` } } });
            return;
        }
        if (!newComment) return toast.error("Please add a comment");

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`http://localhost:5000/api/products/${id}/reviews`, {
                rating: newRating,
                comment: newComment
            }, config);
            toast.success("Thank you for your review!");
            setNewComment('');
            fetchProduct();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit review");
        }
    };

    const getImageUrl = (path) => {
        if (!path) return 'https://via.placeholder.com/600x600?text=No+Image';
        return path.startsWith('http') ? path : `http://localhost:5000${path}`;
    };

    if (!product) return <div style={{padding: '200px', textAlign: 'center'}}>Loading...</div>;

    const isWishlisted = wishlist.find(item => item._id === product._id);

    const handleWhatsApp = () => {
        const text = `Hi, I'm interested in the ${product.name} (Code: ${product._id}). Could you provide more details?`;
        window.open(`https://wa.me/1234567890?text=${encodeURIComponent(text)}`, '_blank');
    };

    const handleBuyNow = () => {
        addToCart(product, quantity);
        navigate('/checkout');
    };

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left - window.scrollX) / width) * 100;
        const y = ((e.pageY - top - window.scrollY) / height) * 100;
        setZoomPos({ x, y });
    };

    return (
        <div style={styles.page}>
            <SEO 
                title={`${product.name} - ${product.purity} Gold`} 
                description={product.description}
                image={product.images[0]} 
            />
            <div className="container">
                <div style={{display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem'}}>
                    <button onClick={() => navigate(-1)} style={styles.backBtn}>
                        <ArrowLeft size={20} /> Back
                    </button>
                    <div style={styles.breadcrumb}>
                        <Link to="/">Home</Link> / <Link to="/products">Jewelry</Link> / <span>{product.name}</span>
                    </div>
                </div>

                <div style={styles.grid}>
                    {/* Image Gallery */}
                    <div style={styles.gallery}>
                        <div 
                            style={styles.mainImageContainer}
                            onMouseEnter={() => setIsZooming(true)}
                            onMouseLeave={() => setIsZooming(false)}
                            onMouseMove={handleMouseMove}
                        >
                            <motion.img 
                                key={selectedImage}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                src={getImageUrl(product.images[selectedImage])} 
                                alt={product.name} 
                                style={styles.mainImage}
                                onClick={() => setIsGalleryOpen(true)}
                            />

                            {/* Zoom Lens / Preview */}
                            {isZooming && (
                                <div style={{
                                    ...styles.zoomLens,
                                    backgroundImage: `url(${getImageUrl(product.images[selectedImage])})`,
                                    backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`
                                }} />
                            )}
                            
                            {/* Slider Navigation */}
                            {product.images.length > 1 && (
                                <>
                                    <button 
                                        style={{...styles.sliderBtn, left: '1rem'}} 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedImage(prev => prev === 0 ? product.images.length - 1 : prev - 1);
                                        }}
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button 
                                        style={{...styles.sliderBtn, right: '1rem'}} 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedImage(prev => prev === product.images.length - 1 ? 0 : prev + 1);
                                        }}
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </>
                            )}

                            <div style={styles.zoomHint}>
                                <Sparkles size={16} /> CLICK TO ZOOM GALLERY
                            </div>
                        </div>
                        
                        <div style={styles.thumbnails}>
                            {product.images.map((img, idx) => (
                                <div 
                                    key={idx} 
                                    style={{
                                        ...styles.thumbWrapper,
                                        borderColor: selectedImage === idx ? 'var(--color-gold-primary)' : 'transparent'
                                    }}
                                    onClick={() => setSelectedImage(idx)}
                                >
                                    <img src={getImageUrl(img)} alt="" style={styles.thumb} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div style={styles.info}>
                        <h1 style={styles.title}>{product.name}</h1>
                        <div style={styles.rating}>
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="var(--color-gold-primary)" color="var(--color-gold-primary)" />)}
                            <span style={styles.reviewsCount}>(48 Reviews)</span>
                        </div>
                        
                        <div style={styles.priceSection}>
                            <span style={styles.price}>₹{product.price ? product.price.toLocaleString() : '0'}</span>
                            <div style={styles.stockStatusContainer}>
                                {product.stock > 0 ? (
                                    product.stock < 5 ? (
                                        <div style={styles.lowStockBadge}>
                                            <Clock size={12} /> ONLY {product.stock} LEFT
                                        </div>
                                    ) : (
                                        <span style={{color: '#4caf50', fontSize: '0.9rem', fontWeight: '600'}}>● In Stock</span>
                                    )
                                ) : (
                                    <span style={{color: '#f44336', fontSize: '0.9rem', fontWeight: '600'}}>● Out of Stock</span>
                                )}
                            </div>
                        </div>

                        <p style={styles.description}>{product.description}</p>

                        <div style={styles.buyControls}>
                            <div style={styles.qtyBox}>
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={styles.qtyBtn}><Minus size={16}/></button>
                                <span style={styles.qtyNum}>{quantity}</span>
                                <button onClick={() => setQuantity(q => q + 1)} style={styles.qtyBtn}><Plus size={16}/></button>
                            </div>
                            <button onClick={() => addToCart(product, quantity)} className="gold-button" style={styles.addBtn}>
                                <ShoppingCart size={18} /> Add to Cart
                            </button>
                            <button onClick={handleBuyNow} className="gold-button" style={styles.buyBtn}>
                                BUY NOW
                            </button>
                            <button onClick={() => toggleWishlist(product)} style={styles.wishBtn}>
                                <Heart size={20} fill={isWishlisted ? "var(--color-gold-primary)" : "none"} color={isWishlisted ? "var(--color-gold-primary)" : "currentColor"} />
                            </button>
                        </div>

                        {/* Price Breakdown / Transparency */}
                        <div style={styles.transparencyCard}>
                            <div style={styles.transparencyHeader}>
                                <Sparkles size={16} color="var(--color-gold-primary)" />
                                <span style={{fontWeight: '600', fontSize: '0.9rem'}}>Price Transparency</span>
                            </div>
                            <div style={styles.transparencyGrid}>
                                <div style={styles.transparencyItem}>
                                    <span>Metal Value ({product.purity})</span>
                                    <span>₹{((product.price || 0) * 0.82).toLocaleString()}</span>
                                </div>
                                <div style={styles.transparencyItem}>
                                    <span>Craftsmanship (Making)</span>
                                    <span>₹{((product.price || 0) * 0.15).toLocaleString()}</span>
                                </div>
                                <div style={styles.transparencyItem}>
                                    <span>GST (3%) & Insurance</span>
                                    <span>₹{((product.price || 0) * 0.03).toLocaleString()}</span>
                                </div>
                                <div style={{...styles.transparencyItem, borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '0.5rem', paddingTop: '0.5rem', fontWeight: '700', color: 'var(--color-gold-primary)'}}>
                                    <span>Total Value</span>
                                    <span>₹{(product.price || 0).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div style={styles.extraActions}>
                            <button onClick={handleWhatsApp} style={styles.whatsappBtn}>
                                <MessageCircle size={18} /> Inquire on WhatsApp
                            </button>
                        </div>

                        <div style={styles.specs}>
                            <h3 style={styles.specTitle}>Specifications</h3>
                            <div style={styles.specGrid}>
                                {product.specifications?.map(spec => (
                                    <div key={spec.key} style={styles.specItem}>
                                        <span style={styles.specKey}>{spec.key}</span>
                                        <span style={styles.specVal}>{spec.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                            <h3 style={styles.specTitle}>Client Testimonials</h3>
                            <div style={styles.reviewsList}>
                                {product.reviews?.length > 0 ? product.reviews.map((review, idx) => (
                                    <div key={idx} style={styles.reviewItem}>
                                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                                            <span style={{fontWeight: '600'}}>{review.name}</span>
                                            <span style={{color: 'var(--color-text-muted)', fontSize: '0.8rem'}}>{new Date(review.date).toLocaleDateString()}</span>
                                        </div>
                                        <div style={{display: 'flex', gap: '0.2rem', marginBottom: '0.5rem'}}>
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} fill={i < review.rating ? "var(--color-gold-primary)" : "none"} color="var(--color-gold-primary)" />
                                            ))}
                                        </div>
                                        <p style={{fontSize: '0.9rem', color: 'var(--color-text-main)'}}>{review.comment}</p>
                                    </div>
                                )) : <p style={{color: 'var(--color-text-muted)'}}>No reviews yet for this masterpiece.</p>}
                            </div>
                            
                            {/* Review Form */}
                            <div style={styles.reviewForm}>
                                <h4 style={{marginBottom: '1rem'}}>Share Your Experience</h4>
                                <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}>
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <Star 
                                            key={star} 
                                            size={24} 
                                            style={{cursor: 'pointer'}} 
                                            fill={star <= newRating ? "var(--color-gold-primary)" : "none"} 
                                            color="var(--color-gold-primary)"
                                            onClick={() => setNewRating(star)}
                                        />
                                    ))}
                                </div>
                                <textarea 
                                    placeholder="Your thoughts on this jewelry..." 
                                    style={styles.reviewInput}
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                <button onClick={submitReview} className="gold-button" style={{marginTop: '1rem'}}>Submit Review</button>
                            </div>

                        <div style={styles.badges}>
                            <div style={styles.badgeItem}>
                                <ShieldCheck size={20} color="var(--color-gold-primary)" />
                                <span>Authenticity Guaranteed</span>
                            </div>
                            <div style={styles.badgeItem}>
                                <Truck size={20} color="var(--color-gold-primary)" />
                                <span>Secured Free Shipping</span>
                            </div>
                            <div style={styles.badgeItem}>
                                <RefreshCcw size={20} color="var(--color-gold-primary)" />
                                <span>Lifetime Buyback Policy</span>
                            </div>
                        </div>

                        {/* More Pics Show to User */}
                        <div style={styles.visualShowcase}>
                            <h3 style={styles.specTitle}>Visual Showcase</h3>
                            <div style={styles.imageGridDetails}>
                                {product.images.map((img, idx) => (
                                    <div key={idx} style={styles.showcaseCard} onClick={() => {setSelectedImage(idx); window.scrollTo({top: 0, behavior: 'smooth'});}}>
                                        <img src={getImageUrl(img)} alt="" style={styles.showcaseImg} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recently Viewed */}
                        {recentlyViewed.length > 0 && (
                            <div style={{marginTop: '6rem'}}>
                                <h2 style={{...styles.title, fontSize: '2rem', marginBottom: '2rem'}}>Recently <span className="gold-text">Viewed</span></h2>
                                <div style={styles.recentGrid}>
                                    {recentlyViewed.map(p => (
                                        <Link key={p._id} to={`/product/${p._id}`} style={styles.recentCard}>
                                            <img src={getImageUrl(p.images[0])} alt={p.name} style={styles.recentImg} />
                                            <div style={styles.recentInfo}>
                                                <p style={styles.recentName}>{p.name}</p>
                                                <p style={styles.recentPrice}>₹{p.price.toLocaleString()}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Gallery Modal / "Div Cards" */}
            {isGalleryOpen && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={styles.modalOverlay}
                >
                    <div style={styles.modalContent}>
                        <div style={styles.modalHeader}>
                            <h2 style={{color: 'var(--color-gold-primary)'}}>Product Gallery</h2>
                            <button onClick={() => setIsGalleryOpen(false)} style={styles.closeModalBtn}><X size={32}/></button>
                        </div>
                        <div style={styles.galleryCards}>
                            {product.images.map((img, idx) => (
                                <motion.div 
                                    key={idx}
                                    whileHover={{ scale: 1.02 }}
                                    style={styles.galleryCard}
                                >
                                    <img src={getImageUrl(img)} alt={`${product.name} view ${idx + 1}`} style={styles.galleryCardImg} />
                                    <div style={styles.cardIndex}>View {idx + 1}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

const styles = {
    page: {
        paddingTop: 'clamp(80px, 12vw, 120px)',
        paddingBottom: 'clamp(4rem, 8vw, 8rem)',
    },
    breadcrumb: {
        fontSize: '0.9rem',
        color: 'var(--color-text-muted)',
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
        '&:hover': {
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            borderColor: 'var(--color-gold-primary)'
        }
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(300px, 45vw, 500px), 1fr))',
        gap: 'clamp(2rem, 4vw, 4rem)',
        alignItems: 'start',
    },
    mainImageContainer: {
        width: '100%',
        aspectRatio: '1/1',
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: '#111',
        border: '1px solid rgba(212, 175, 55, 0.1)',
        position: 'relative',
    },
    zoomLens: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '200%',
        zIndex: 1,
    },
    mainImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        cursor: 'zoom-in',
    },
    sliderBtn: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        backgroundColor: 'rgba(0,0,0,0.4)',
        color: '#fff',
        border: 'none',
        borderRadius: '50%',
        width: '44px',
        height: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        zIndex: 2,
        '&:hover': {
            backgroundColor: 'var(--color-gold-primary)',
            color: '#000'
        }
    },
    zoomHint: {
        position: 'absolute',
        bottom: '1.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: 'var(--color-gold-primary)',
        padding: '0.6rem 1.2rem',
        borderRadius: '50px',
        fontSize: '0.8rem',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        pointerEvents: 'none',
        border: '1px solid rgba(212,175,55,0.3)',
        letterSpacing: '1px'
    },
    thumbnails: {
        display: 'flex',
        gap: '1rem',
        marginTop: '1.5rem',
    },
    thumb: {
        width: '80px',
        height: '80px',
        borderRadius: '4px',
        overflow: 'hidden',
        border: '2px solid transparent',
        cursor: 'pointer',
    },
    thumbImg: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    info: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    title: {
        fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
        color: 'var(--color-white)',
    },
    rating: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    reviewsCount: {
        fontSize: '0.9rem',
        color: 'var(--color-text-muted)',
    },
    priceSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
    },
    stockStatusContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    lowStockBadge: {
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        color: '#f44336',
        padding: '0.4rem 0.8rem',
        borderRadius: '4px',
        fontSize: '0.75rem',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        border: '1px solid rgba(244, 67, 54, 0.2)',
        letterSpacing: '1px',
        animation: 'pulse 2s infinite'
    },
    price: {
        fontSize: 'clamp(1.5rem, 3vw, 2rem)',
        fontWeight: '700',
        color: 'var(--color-gold-primary)',
    },
    description: {
        fontSize: '1rem',
        color: 'var(--color-text-muted)',
        lineHeight: '1.8',
    },
    buyControls: {
        display: 'flex',
        alignItems: 'center',
        gap: 'clamp(0.8rem, 2vw, 1.5rem)',
        marginTop: '1rem',
        flexWrap: 'wrap',
    },
    qtyBox: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'var(--color-dark-gray)',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        borderRadius: '4px',
    },
    qtyBtn: {
        padding: '0.8rem 1rem',
        backgroundColor: 'transparent',
        color: 'var(--color-white)',
    },
    qtyNum: {
        width: '40px',
        textAlign: 'center',
        fontWeight: '600',
    },
    addBtn: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.8rem',
    },
    buyBtn: {
        flex: 1,
        backgroundColor: '#ffffff',
        color: '#000000',
        fontWeight: 'bold',
        fontSize: '1rem',
        padding: '0.8rem 1.5rem',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: '1px solid #ffffff',
        '&:hover': {
            backgroundColor: 'transparent',
            color: '#ffffff'
        }
    },
    wishBtn: {
        width: '50px',
        height: '50px',
        borderRadius: '4px',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        backgroundColor: 'var(--color-dark-gray)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-white)',
    },
    extraActions: {
        marginTop: '0.5rem',
    },
    whatsappBtn: {
        width: '100%',
        padding: '1rem',
        backgroundColor: '#25D366',
        color: 'white',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.8rem',
        fontWeight: '600',
        fontSize: '1rem',
    },
    specs: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: '1.5rem',
        borderRadius: '8px',
        marginTop: '1rem',
    },
    specTitle: {
        fontSize: '1.2rem',
        marginBottom: '1rem',
        color: 'var(--color-white)',
    },
    specGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
    },
    specItem: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingBottom: '0.5rem',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
    },
    specKey: {
        color: 'var(--color-text-muted)',
        fontSize: '0.9rem',
    },
    specVal: {
        color: 'var(--color-white)',
        fontSize: '0.9rem',
        fontWeight: '500',
    },
    badges: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        marginTop: '1rem',
    },
    badgeItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        fontSize: '0.9rem',
        color: 'var(--color-text-main)',
    },
    transparencyCard: {
        backgroundColor: 'rgba(212, 175, 55, 0.05)',
        border: '1px solid rgba(212, 175, 55, 0.1)',
        borderRadius: '8px',
        padding: '1.2rem',
        marginTop: '0.5rem'
    },
    transparencyHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1rem',
        color: 'var(--color-gold-primary)'
    },
    transparencyGrid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
    },
    transparencyItem: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.85rem',
        color: 'var(--color-text-muted)'
    },
    reviewsList: { display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' },
    reviewItem: { padding: '1.5rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' },
    reviewForm: { padding: '2rem', backgroundColor: 'rgba(212, 175, 55, 0.03)', borderRadius: '8px', border: '1px solid rgba(212, 175, 55, 0.1)' },
    reviewInput: { width: '100%', padding: '1rem', backgroundColor: '#000', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '4px', color: '#fff', fontSize: '0.9rem', minHeight: '100px', outline: 'none' },
    zoomIcon: { position: 'absolute', bottom: '1.5rem', right: '1.5rem', backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(212,175,55,0.3)', pointerEvents: 'none' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 3000, overflowY: 'auto', padding: '2rem 1rem' },
    modalContent: { maxWidth: '1200px', margin: '0 auto' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', padding: '0 1rem' },
    closeModalBtn: { background: 'transparent', color: '#fff', border: 'none', cursor: 'pointer' },
    galleryCards: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' },
    galleryCard: { backgroundColor: '#111', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(212,175,55,0.1)', position: 'relative' },
    galleryCardImg: { width: '100%', height: '450px', objectFit: 'cover' },
    cardIndex: { position: 'absolute', top: '1rem', left: '1rem', backgroundColor: 'rgba(0,0,0,0.6)', padding: '0.3rem 0.8rem', borderRadius: '4px', color: 'var(--color-gold-primary)', fontSize: '0.8rem', fontWeight: 'bold' },
    visualShowcase: { marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem' },
    imageGridDetails: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem' },
    showcaseItem: { height: '120px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(212,175,55,0.1)', cursor: 'pointer' },
    showcaseImg: { width: '100%', height: '100%', objectFit: 'cover' },
    recentGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '1.5rem',
    },
    recentCard: {
        backgroundColor: '#0a0a0a',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.05)',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        '&:hover': {
            borderColor: 'var(--color-gold-primary)',
            transform: 'translateY(-5px)'
        }
    },
    recentImg: {
        width: '100%',
        height: '150px',
        objectFit: 'cover',
    },
    recentInfo: {
        padding: '1rem',
    },
    recentName: {
        color: '#fff',
        fontSize: '0.9rem',
        fontWeight: '600',
        marginBottom: '0.4rem',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    recentPrice: {
        color: 'var(--color-gold-primary)',
        fontSize: '0.85rem',
        fontWeight: '700'
    }
};

export default ProductDetails;
