import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const JewelrySlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1920',
      title: 'Timeless Elegance',
      subtitle: 'Discover Our Premium Gold Collection',
      cta: 'Shop Now'
    },
    {
      image: 'https://images.unsplash.com/photo-1601121141461-9d6ec1ad3028?auto=format&fit=crop&q=80&w=1920',
      title: 'Exquisite Designs',
      subtitle: 'Handcrafted with Precision',
      cta: 'Explore'
    },
    {
      image: 'https://images.unsplash.com/photo-1610664921890-ebad05086414?auto=format&fit=crop&q=80&w=1920',
      title: 'Pure Luxury',
      subtitle: 'BIS Hallmarked Gold Jewelry',
      cta: 'Discover'
    },
    {
      image: 'https://images.unsplash.com/photo-1598560917807-1bae44bd2be8?auto=format&fit=crop&q=80&w=1920',
      title: 'Diamond Brilliance',
      subtitle: 'Sparkle with Every Moment',
      cta: 'View Collection'
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={styles.sliderContainer}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          style={styles.slide}
        >
          <div
            style={{
              ...styles.slideImage,
              backgroundImage: `url(${slides[currentIndex].image})`
            }}
          >
            <div style={styles.slideOverlay}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                style={styles.slideContent}
              >
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  style={styles.slideTitle}
                >
                  {slides[currentIndex].title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  style={styles.slideSubtitle}
                >
                  {slides[currentIndex].subtitle}
                </motion.p>
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                  className="gold-button"
                  style={styles.slideButton}
                  onClick={() => navigate('/products')}
                >
                  {slides[currentIndex].cta}
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <button onClick={prevSlide} style={{...styles.navButton, left: '30px'}}>
        <ChevronLeft size={32} />
      </button>
      <button onClick={nextSlide} style={{...styles.navButton, right: '30px'}}>
        <ChevronRight size={32} />
      </button>

      <div style={styles.dots}>
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            style={{
              ...styles.dot,
              backgroundColor: index === currentIndex ? 'var(--color-gold-primary)' : 'rgba(255,255,255,0.3)',
              width: index === currentIndex ? '30px' : '12px'
            }}
          />
        ))}
      </div>
    </div>
  );
};

const styles = {
  sliderContainer: {
    position: 'relative',
    width: '100%',
    height: '100vh',
    minHeight: '600px',
    overflow: 'hidden',
  },
  slide: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  slideImage: {
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  slideOverlay: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.6) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
  slideContent: {
    textAlign: 'center',
    padding: '2rem',
    maxWidth: '900px',
    width: '100%',
  },
  slideTitle: {
    fontSize: 'clamp(2.5rem, 8vw, 5rem)',
    fontWeight: '700',
    color: 'var(--color-white)',
    marginBottom: '1.5rem',
    textShadow: '2px 2px 20px rgba(0,0,0,0.5)',
    fontFamily: 'Playfair Display, serif',
    lineHeight: '1.1',
  },
  slideSubtitle: {
    fontSize: 'clamp(1rem, 3vw, 1.5rem)',
    color: 'var(--color-gold-primary)',
    marginBottom: '2.5rem',
    textTransform: 'uppercase',
    letterSpacing: 'clamp(1px, 2vw, 3px)',
    textShadow: '1px 1px 10px rgba(0,0,0,0.5)',
  },
  slideButton: {
    padding: 'clamp(0.8rem, 2vw, 1rem) clamp(2rem, 5vw, 3rem)',
    fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, var(--color-gold-primary) 0%, #b8860b 100%)',
    color: 'var(--color-dark)',
    boxShadow: '0 10px 30px rgba(212, 175, 55, 0.3)',
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(0,0,0,0.5)',
    border: '2px solid var(--color-gold-primary)',
    color: 'var(--color-gold-primary)',
    width: 'clamp(40px, 10vw, 60px)',
    height: 'clamp(40px, 10vw, 60px)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    zIndex: 10,
  },
  dot: {
    height: '12px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    margin: '0 5px',
  },
  dots: {
    position: 'absolute',
    bottom: '40px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '10px',
    zIndex: 10,
  },
};

export default JewelrySlider;
