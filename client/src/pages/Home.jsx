import { ArrowRight, Star, ShieldCheck, Truck, RefreshCcw, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/common/SEO';
import JewelrySlider from '../components/common/JewelrySlider';

const Home = () => {
    return (
        <div style={styles.home}>
            <SEO title="Home" />
            {/* Professional Jewelry Slider */}
            <JewelrySlider />

            {/* Features Section */}
            <section style={styles.features}>
                <div className="container" style={styles.featuresContainer}>
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={styles.featuresHeader}
                    >
                        <Sparkles size={40} style={styles.headerIcon} />
                        <h2 style={styles.featuresTitle}>Why Choose <span className="gold-text">Us</span></h2>
                        <p style={styles.featuresSubtitle}>Experience the pinnacle of luxury and craftsmanship</p>
                    </motion.div>
                    <div style={styles.featuresGrid}>
                        {[
                            { icon: ShieldCheck, title: '100% Certified', desc: 'BIS Hallmarked Pure Gold' },
                            { icon: Truck, title: 'Global Delivery', desc: 'Insured & Tracked Shipping' },
                            { icon: RefreshCcw, title: 'Easy Returns', desc: '7-Day Replacement Policy' },
                            { icon: Star, title: 'Exquisite Design', desc: 'Unique Handcrafted Pieces' }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                                style={styles.featureItem}
                            >
                                <div style={styles.featureIconWrapper}>
                                    <feature.icon size={36} style={styles.featureIcon} />
                                </div>
                                <h4 style={styles.featureTitle}>{feature.title}</h4>
                                <p style={styles.featureDesc}>{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section style={styles.categories}>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={styles.sectionHeader}
                    >
                        <h2 style={styles.sectionTitle}>Shop by <span className="gold-text">Category</span></h2>
                        <p style={styles.sectionSubtitle}>Explore our curated collections</p>
                    </motion.div>
                    <div style={styles.categoryGrid}>
                        {[
                            { name: 'Rings', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600' },
                            { name: 'Chains', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600' },
                            { name: 'Earrings', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600' },
                            { name: 'Bracelets', img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600' }
                        ].map((cat, index) => (
                            <motion.div
                                key={cat.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.05, y: -10 }}
                                style={styles.categoryCard}
                            >
                                <div style={{...styles.categoryImage, backgroundImage: `url(${cat.img})`}}></div>
                                <div style={styles.categoryInfo}>
                                    <h3 style={styles.categoryTitle}>{cat.name}</h3>
                                    <Link to={`/products?category=${cat.name.toLowerCase()}`} style={styles.catLink}>
                                        Explore Collection <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Material Section */}
            <section style={styles.materialSection}>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={styles.sectionHeader}
                    >
                        <h2 style={styles.sectionTitle}>Shop by <span className="gold-text">Material</span></h2>
                        <p style={styles.sectionSubtitle}>Premium materials for timeless elegance</p>
                    </motion.div>
                    <div style={styles.categoryGrid}>
                        {[
                            { name: 'Gold', img: 'https://images.unsplash.com/photo-1610664921890-ebad05086414?auto=format&fit=crop&q=80&w=600' },
                            { name: 'Diamond', img: 'https://images.unsplash.com/photo-1598560917807-1bae44bd2be8?auto=format&fit=crop&q=80&w=600' },
                            { name: 'Silver', img: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&q=80&w=600' }
                        ].map((mat, index) => (
                            <motion.div
                                key={mat.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.05, y: -10 }}
                                style={styles.categoryCard}
                            >
                                <div style={{...styles.categoryImage, backgroundImage: `url(${mat.img})`}}></div>
                                <div style={styles.categoryInfo}>
                                    <h3 style={styles.categoryTitle}>{mat.name}</h3>
                                    <Link to={`/products?type=${mat.name.toLowerCase()}`} style={styles.catLink}>
                                        View All {mat.name} <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section style={styles.newsletter}>
                <div className="container" style={styles.newsletterContent}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={styles.newsletterInner}
                    >
                        <Sparkles size={50} style={styles.newsletterIcon} />
                        <h2 style={styles.newsletterTitle}>Join the <span className="gold-text">Elite</span></h2>
                        <p style={styles.newsletterText}>Subscribe to receive early access to new collections and exclusive offers.</p>
                        <form style={styles.newsletterForm} onSubmit={(e) => {e.preventDefault(); alert('Subscribed!');}}>
                            <input type="email" placeholder="Your Email Address" style={styles.newsletterInput} required />
                            <button type="submit" className="gold-button" style={styles.newsletterButton}>Subscribe</button>
                        </form>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

const styles = {
    home: {
        paddingTop: '0',
    },
    features: {
        padding: 'clamp(3rem, 8vw, 6rem) 0',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #050505 100%)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.1)',
    },
    featuresContainer: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 clamp(1rem, 4vw, 2rem)',
    },
    featuresHeader: {
        textAlign: 'center',
        marginBottom: 'clamp(2rem, 5vw, 4rem)',
    },
    headerIcon: {
        color: 'var(--color-gold-primary)',
        marginBottom: '1.5rem',
    },
    featuresTitle: {
        fontSize: 'clamp(2rem, 5vw, 3rem)',
        marginBottom: '1rem',
        fontFamily: 'Playfair Display, serif',
    },
    featuresSubtitle: {
        fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
        color: 'var(--color-text-muted)',
    },
    featuresGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 'clamp(1.5rem, 4vw, 2.5rem)',
    },
    featureItem: {
        textAlign: 'center',
        padding: 'clamp(1.5rem, 4vw, 2.5rem)',
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(0,0,0,0.3) 100%)',
        borderRadius: '12px',
        border: '1px solid rgba(212, 175, 55, 0.1)',
        transition: 'all 0.3s ease',
    },
    featureIconWrapper: {
        width: 'clamp(60px, 15vw, 80px)',
        height: 'clamp(60px, 15vw, 80px)',
        margin: '0 auto 1.5rem',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--color-gold-primary) 0%, #b8860b 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    featureIcon: {
        color: '#0a0a0a',
    },
    featureTitle: {
        fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
        marginBottom: '0.75rem',
        color: 'var(--color-white)',
    },
    featureDesc: {
        color: 'var(--color-text-muted)',
        fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
    },
    categories: {
        padding: 'clamp(4rem, 10vw, 8rem) 0',
        background: 'linear-gradient(180deg, #050505 0%, #0a0a0a 100%)',
    },
    sectionHeader: {
        textAlign: 'center',
        marginBottom: 'clamp(2rem, 5vw, 4rem)',
    },
    sectionTitle: {
        fontSize: 'clamp(2rem, 6vw, 3.5rem)',
        marginBottom: '1rem',
        fontFamily: 'Playfair Display, serif',
    },
    sectionSubtitle: {
        fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
        color: 'var(--color-text-muted)',
    },
    categoryGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 'clamp(1.5rem, 4vw, 2.5rem)',
    },
    categoryCard: {
        position: 'relative',
        height: 'clamp(350px, 50vw, 450px)',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
    },
    categoryImage: {
        width: '100%',
        height: '100%',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'transform 0.6s ease',
    },
    categoryInfo: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        padding: 'clamp(1.5rem, 4vw, 2.5rem)',
        background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 50%, transparent 100%)',
        color: 'var(--color-white)',
    },
    categoryTitle: {
        fontSize: 'clamp(1.5rem, 4vw, 2rem)',
        marginBottom: '0.75rem',
        fontFamily: 'Playfair Display, serif',
    },
    catLink: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: 'var(--color-gold-primary)',
        marginTop: '0.5rem',
        fontSize: 'clamp(0.9rem, 2vw, 1rem)',
        fontWeight: '500',
        textDecoration: 'none',
    },
    materialSection: {
        padding: 'clamp(4rem, 10vw, 8rem) 0',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #050505 100%)',
    },
    newsletter: {
        padding: 'clamp(4rem, 10vw, 8rem) 0',
        background: 'linear-gradient(135deg, #050505 0%, #0a0a0a 50%, #050505 100%)',
        borderTop: '1px solid rgba(212, 175, 55, 0.1)',
        position: 'relative',
        overflow: 'hidden',
    },
    newsletterContent: {
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
    },
    newsletterInner: {
        maxWidth: '700px',
        width: '100%',
    },
    newsletterIcon: {
        color: 'var(--color-gold-primary)',
        marginBottom: '2rem',
    },
    newsletterTitle: {
        fontSize: 'clamp(2rem, 5vw, 3rem)',
        marginBottom: '1.5rem',
        fontFamily: 'Playfair Display, serif',
    },
    newsletterText: {
        color: 'var(--color-text-muted)',
        marginBottom: '2.5rem',
        fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
        lineHeight: '1.6',
    },
    newsletterForm: {
        display: 'flex',
        gap: '1rem',
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto',
        flexDirection: 'row',
    },
    newsletterInput: {
        flex: 1,
        padding: 'clamp(0.8rem, 2vw, 1.2rem)',
        backgroundColor: 'rgba(212, 175, 55, 0.05)',
        border: '2px solid rgba(212, 175, 55, 0.2)',
        borderRadius: '8px',
        color: 'var(--color-white)',
        outline: 'none',
        fontSize: 'clamp(0.9rem, 2vw, 1rem)',
        transition: 'border-color 0.3s ease',
    },
    newsletterButton: {
        padding: 'clamp(0.8rem, 2vw, 1.2rem) clamp(1.5rem, 4vw, 2.5rem)',
        fontSize: 'clamp(0.9rem, 2vw, 1rem)',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        borderRadius: '8px',
    }
};

export default Home;
