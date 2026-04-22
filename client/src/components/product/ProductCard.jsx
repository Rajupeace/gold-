import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Eye, Package, AlertCircle, Share2, Facebook, Twitter, Instagram, MessageCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product, onQuickView }) => {
    const { addToCart, toggleWishlist, wishlist } = useCart();
    const isWishlisted = wishlist.find(item => item._id === product._id);
    const inStock = product.stock > 0;
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [lastTap, setLastTap] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const imageUrl = product.images && product.images[0]
        ? (product.images[0].startsWith('http') ? product.images[0] : `http://localhost:5000${product.images[0]}`)
        : 'https://via.placeholder.com/400x400?text=No+Image';

    const hoverImageUrl = product.images && product.images[1]
        ? (product.images[1].startsWith('http') ? product.images[1] : `http://localhost:5000${product.images[1]}`)
        : imageUrl;

    const shareUrl = `http://localhost:5173/product/${product._id}`;
    const shareText = `Check out this exquisite ${product.name} from Evergreen Elegance!`;

    const handleShare = (platform) => {
        let url = '';
        switch(platform) {
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
                break;
            case 'twitter':
                url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
                break;
            case 'whatsapp':
                url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
                break;
            default:
                return;
        }
        window.open(url, '_blank', 'width=600,height=400');
        setShowShareMenu(false);
    };

    const handleDoubleTap = () => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        if (tapLength < 300 && tapLength > 0) {
            toggleWishlist(product);
            setLastTap(0);
        } else {
            setLastTap(currentTime);
        }
    };

    return (
        <motion.div
            whileHover={{ y: -10 }}
            style={styles.card}
            onDoubleClick={handleDoubleTap}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={styles.imageContainer} onClick={() => onQuickView && onQuickView(product)}>
                <img 
                    src={isHovered ? hoverImageUrl : imageUrl} 
                    alt={product.name} 
                    style={{...styles.image, cursor: 'pointer', transition: 'all 0.5s ease'}} 
                />
                {product.images && product.images.length > 1 && (
                    <div style={styles.multiIndicator}>
                        <Sparkles size={12} /> MULTI-VIEW
                    </div>
                )}
                <div style={styles.overlay}>
                    <button onClick={() => toggleWishlist(product)} style={styles.iconBtn}>
                        <Heart size={18} fill={isWishlisted ? "var(--color-gold-primary)" : "none"} color={isWishlisted ? "var(--color-gold-primary)" : "currentColor"} />
                    </button>
                    <Link to={`/product/${product._id}`} style={styles.iconBtn}>
                        <Eye size={18} />
                    </Link>
                    <button onClick={() => setShowShareMenu(!showShareMenu)} style={styles.iconBtn}>
                        <Share2 size={18} />
                    </button>
                    {showShareMenu && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={styles.shareMenu}
                        >
                            <button onClick={() => handleShare('facebook')} style={styles.shareBtn} title="Share on Facebook">
                                <Facebook size={16} />
                            </button>
                            <button onClick={() => handleShare('twitter')} style={styles.shareBtn} title="Share on Twitter">
                                <Twitter size={16} />
                            </button>
                            <button onClick={() => handleShare('whatsapp')} style={styles.shareBtn} title="Share on WhatsApp">
                                <MessageCircle size={16} />
                            </button>
                        </motion.div>
                    )}
                </div>
                {!inStock && (
                    <div style={styles.outOfStockBadge}>
                        <AlertCircle size={16} />
                        <span>Out of Stock</span>
                    </div>
                )}
            </div>

            <div style={styles.info}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
                    <span style={styles.category}>{product.category}</span>
                    <span style={{
                        ...styles.typeBadge,
                        color: product.type === 'Diamond' ? 'var(--color-diamond)' : 'var(--color-gold-primary)',
                        borderColor: product.type === 'Diamond' ? 'rgba(224, 247, 250, 0.3)' : 'rgba(212, 175, 55, 0.3)'
                    }}>
                        {product.type}
                    </span>
                </div>
                <Link to={`/product/${product._id}`}><h3 style={styles.name}>{product.name}</h3></Link>
                <div style={styles.purity}>{product.purity} • {product.weight}g</div>
                <div style={styles.stockStatus}>
                    {inStock ? (
                        <span style={styles.inStock}>
                            <Package size={14} />
                            {product.stock} in stock
                        </span>
                    ) : (
                        <span style={styles.outOfStockText}>
                            <AlertCircle size={14} />
                            Out of stock
                        </span>
                    )}
                </div>
                <div style={styles.priceRow}>
                    <span style={product.type === 'Diamond' ? styles.diamondPrice : styles.price}>
                        ₹{product.price ? product.price.toLocaleString() : '0'}
                    </span>
                    <button
                        onClick={() => addToCart(product)}
                        style={{...styles.cartBtn, opacity: inStock ? 1 : 0.5, cursor: inStock ? 'pointer' : 'not-allowed'}}
                        disabled={!inStock}
                    >
                        <ShoppingCart size={16} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const styles = {
    card: {
        backgroundColor: 'var(--color-dark-gray)',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid rgba(212, 175, 55, 0.1)',
        transition: 'all 0.3s ease',
    },
    imageContainer: {
        position: 'relative',
        height: '250px',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform 0.5s ease',
    },
    multiIndicator: {
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        backgroundColor: 'rgba(0,0,0,0.6)',
        color: 'var(--color-gold-primary)',
        padding: '0.3rem 0.6rem',
        borderRadius: '4px',
        fontSize: '0.6rem',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        zIndex: 5,
        letterSpacing: '1px',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(212,175,55,0.2)'
    },
    overlay: {
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        opacity: 0,
        transition: 'opacity 0.3s ease',
        '.imageContainer:hover &': {
            opacity: 1,
        }
    },
    outOfStockBadge: {
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        backgroundColor: 'rgba(220, 38, 38, 0.9)',
        color: 'white',
        padding: '0.4rem 0.8rem',
        borderRadius: '4px',
        fontSize: '0.75rem',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '0.3rem',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    iconBtn: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: 'rgba(10, 10, 10, 0.8)',
        color: 'var(--color-white)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid rgba(212, 175, 55, 0.3)',
    },
    shareMenu: {
        position: 'absolute',
        top: '100%',
        right: 0,
        marginTop: '0.5rem',
        backgroundColor: 'rgba(10, 10, 10, 0.95)',
        borderRadius: '8px',
        padding: '0.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.3rem',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        zIndex: 10,
    },
    shareBtn: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: 'var(--color-white)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    info: {
        padding: '1.5rem',
    },
    category: {
        fontSize: '0.7rem',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        color: 'var(--color-gold-primary)',
        marginBottom: '0.5rem',
        display: 'block',
    },
    name: {
        fontSize: '1.1rem',
        color: 'var(--color-white)',
        marginBottom: '0.5rem',
        fontWeight: '600',
    },
    purity: {
        fontSize: '0.8rem',
        color: 'var(--color-text-muted)',
        marginBottom: '0.75rem',
    },
    stockStatus: {
        marginBottom: '1rem',
        fontSize: '0.8rem',
    },
    inStock: {
        color: '#22c55e',
        display: 'flex',
        alignItems: 'center',
        gap: '0.3rem',
    },
    outOfStockText: {
        color: '#ef4444',
        display: 'flex',
        alignItems: 'center',
        gap: '0.3rem',
    },
    priceRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: '1.2rem',
        fontWeight: '700',
        color: 'var(--color-gold-primary)',
    },
    diamondPrice: {
        fontSize: '1.2rem',
        fontWeight: '700',
        color: 'var(--color-diamond)',
        textShadow: '0 0 10px rgba(224, 247, 250, 0.2)',
    },
    typeBadge: {
        fontSize: '0.65rem',
        padding: '0.2rem 0.6rem',
        borderRadius: '50px',
        border: '1px solid',
        textTransform: 'uppercase',
        fontWeight: '700',
        letterSpacing: '1px',
    },
    cartBtn: {
        backgroundColor: 'var(--color-gold-primary)',
        color: 'var(--color-black)',
        padding: '0.5rem',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
    }
};

export default ProductCard;
