import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, Camera, Link as LinkIcon, Star } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const ProductManagement = () => {
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: '', price: '', weight: '', category: 'Rings', purity: '22K', stock: '', description: '', images: [''], type: 'Gold'
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/products');
            setProducts(data);
            setLoading(false);
        } catch (error) {
            toast.error("Failed to fetch products");
            setLoading(false);
        }
    };

    const [imageFiles, setImageFiles] = useState([]);
    const [imageUrls, setImageUrls] = useState(['']);

    const openModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                ...product,
                images: product.images || []
            });
            setImageUrls(product.images || ['']);
        } else {
            setEditingProduct(null);
            setFormData({ name: '', price: '', weight: '', category: 'Rings', purity: '22K', stock: '', description: '', images: [''], type: 'Gold' });
            setImageUrls(['']);
        }
        setImageFiles([]);
        setIsModalOpen(true);
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setImageFiles(prev => [...prev, ...files]);
        }
    };

    const removeFile = (index) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    const removeUrl = (index) => {
        setImageUrls(prev => prev.filter((_, i) => i !== index));
    };

    const handleUrlChange = (index, value) => {
        const newUrls = [...imageUrls];
        newUrls[index] = value;
        setImageUrls(newUrls);
    };

    const addUrlField = () => {
        setImageUrls([...imageUrls, '']);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: { 
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };

            const data = new FormData();
            data.append('name', formData.name);
            data.append('price', formData.price);
            data.append('weight', formData.weight);
            data.append('category', formData.category);
            data.append('purity', formData.purity);
            data.append('stock', formData.stock);
            data.append('description', formData.description);
            data.append('type', formData.type);
            
            // Append existing URLs
            imageUrls.filter(url => url.trim() !== '').forEach(url => {
                data.append('images', url);
            });

            // Append new files
            imageFiles.forEach(file => {
                data.append('images', file);
            });

            if (editingProduct) {
                await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, data, config);
                toast.success("Jewelry updated!");
            } else {
                await axios.post('http://localhost:5000/api/products', data, config);
                toast.success("Added to boutique!");
            }
            setIsModalOpen(false);
            fetchProducts();
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                await axios.delete(`http://localhost:5000/api/products/${id}`, config);
                toast.error("Product removed from inventory");
                fetchProducts();
            } catch (error) {
                toast.error("Failed to delete product");
            }
        }
    };

    return (
        <div style={styles.page}>
            <div className="container">
                <div style={styles.header}>
                    <h1>Manage <span className="gold-text">Products</span></h1>
                    <button onClick={() => openModal()} className="gold-button" style={styles.addBtn}>
                        <Plus size={18} /> Add New Product
                    </button>
                </div>

                <div style={styles.cardGrid}>
                    {products.map(p => (
                        <div key={p._id} style={styles.productCard}>
                            <div style={styles.cardImageContainer}>
                                <img 
                                    src={p.images && p.images[0] ? (p.images[0].startsWith('http') ? p.images[0] : `http://localhost:5000${p.images[0]}`) : 'https://via.placeholder.com/200'} 
                                    alt={p.name} 
                                    style={styles.cardImage} 
                                />
                                <div style={styles.cardOverlay}>
                                    <button onClick={() => openModal(p)} style={styles.cardActionBtn} title="Edit"><Edit2 size={16}/></button>
                                    <button onClick={() => handleDelete(p._id)} style={{...styles.cardActionBtn, color: '#f44336'}} title="Delete"><Trash2 size={16}/></button>
                                </div>
                            </div>
                            <div style={styles.cardInfo}>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
                                    <span style={styles.cardCategory}>{p.category}</span>
                                    <span style={{
                                        ...styles.stockBadge,
                                        color: p.stock < 5 ? '#f44336' : '#4caf50',
                                        backgroundColor: p.stock < 5 ? '#f4433615' : '#4caf5015'
                                    }}>
                                        {p.stock} Qty
                                    </span>
                                </div>
                                <h3 style={styles.cardName}>{p.name}</h3>
                                <p style={styles.cardPrice}>${Number(p.price).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div style={styles.modalOverlay}>
                        <div style={styles.modal}>
                            <div style={styles.modalHeader}>
                                <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                                <button onClick={() => setIsModalOpen(false)} style={styles.closeBtn}><X size={24}/></button>
                            </div>
                            <form onSubmit={handleSave} style={styles.form}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Product Name</label>
                                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={styles.input} placeholder="e.g. Imperial Solitaire Ring" />
                                </div>
                                <div style={styles.formRow}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Price ($)</label>
                                        <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={styles.input} />
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Stock Quantity</label>
                                        <input type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} style={styles.input} />
                                    </div>
                                </div>
                                <div style={styles.formRow}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Category</label>
                                        <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={styles.input}>
                                            <option>Rings</option>
                                            <option>Chains</option>
                                            <option>Necklaces</option>
                                            <option>Bracelets</option>
                                            <option>Bangles</option>
                                            <option>Earrings</option>
                                            <option>Watches</option>
                                        </select>
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Material Type</label>
                                        <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={styles.input}>
                                            <option value="Gold">Gold</option>
                                            <option value="Diamond">Diamond</option>
                                            <option value="Silver">Silver</option>
                                            <option value="Platinum">Platinum</option>
                                            <option value="Rose Gold">Rose Gold</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={styles.formRow}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Purity / Hallmarking</label>
                                        <input type="text" value={formData.purity} onChange={e => setFormData({...formData, purity: e.target.value})} style={styles.input} placeholder="e.g. 22K, 925 Silver" />
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Weight (Grams)</label>
                                        <input type="number" step="0.01" required value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} style={styles.input} />
                                    </div>
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Product Description</label>
                                    <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={styles.input} placeholder="Describe the craftsmanship and design..."></textarea>
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Product Imagery</label>
                                    
                                    {/* Multi-Preview Grid */}
                                    <div style={styles.previewGrid}>
                                        {imageUrls.map((url, idx) => (
                                        <div key={`url-${idx}`} style={styles.previewCard}>
                                            <img src={url.startsWith('http') ? url : `http://localhost:5000${url}`} alt="" style={styles.previewImg} />
                                            <div style={styles.previewActions}>
                                                <button 
                                                    onClick={() => {
                                                        const newUrls = [...imageUrls];
                                                        const [removed] = newUrls.splice(idx, 1);
                                                        setImageUrls([removed, ...newUrls]);
                                                    }} 
                                                    style={{...styles.previewBtn, color: idx === 0 ? 'var(--color-gold-primary)' : '#fff'}}
                                                    title={idx === 0 ? "Primary Image" : "Set as Primary"}
                                                >
                                                    <Star size={14} fill={idx === 0 ? 'var(--color-gold-primary)' : 'none'} />
                                                </button>
                                                <button onClick={() => removeUrl(idx)} style={styles.previewBtn} title="Remove"><X size={14}/></button>
                                            </div>
                                        </div>
                                    ))}
                                    {imageFiles.map((file, idx) => (
                                        <div key={`file-${idx}`} style={styles.previewCard}>
                                            <img src={URL.createObjectURL(file)} alt="" style={styles.previewImg} />
                                            <div style={styles.previewActions}>
                                                <button 
                                                    onClick={() => {
                                                        const newFiles = [...imageFiles];
                                                        const [removed] = newFiles.splice(idx, 1);
                                                        setImageFiles([removed, ...newFiles]);
                                                    }} 
                                                    style={styles.previewBtn}
                                                    title="Set as Primary"
                                                >
                                                    <Star size={14} />
                                                </button>
                                                <button onClick={() => removeFile(idx)} style={styles.previewBtn} title="Remove"><X size={14}/></button>
                                            </div>
                                        </div>
                                    ))}
                                        {(imageUrls.filter(u => u).length + imageFiles.length) === 0 && (
                                            <div style={styles.noPreview}>No Images Selected</div>
                                        )}
                                    </div>

                                    <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                                        <div>
                                            <p style={{...styles.label, fontSize: '0.7rem', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem'}}>
                                                <Camera size={12} /> Upload Multiple Images
                                            </p>
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                multiple
                                                onChange={handleFileChange} 
                                                style={{...styles.input, width: '100%'}} 
                                            />
                                        </div>
                                        
                                        <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                                            <p style={{...styles.label, fontSize: '0.7rem', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem'}}>
                                                <LinkIcon size={12} /> External URLs
                                            </p>
                                            {imageUrls.map((url, idx) => (
                                                <div key={idx} style={{display: 'flex', gap: '0.5rem'}}>
                                                    <input 
                                                        type="text" 
                                                        value={url} 
                                                        onChange={e => handleUrlChange(idx, e.target.value)} 
                                                        style={{...styles.input, flex: 1}} 
                                                        placeholder="https://..." 
                                                    />
                                                    {imageUrls.length > 1 && (
                                                        <button type="button" onClick={() => removeUrl(idx)} style={{padding: '0 0.5rem', background: 'transparent', color: '#f44336'}}><Trash2 size={16}/></button>
                                                    )}
                                                </div>
                                            ))}
                                            <button type="button" onClick={addUrlField} style={{fontSize: '0.75rem', color: 'var(--color-gold-primary)', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', width: 'fit-content'}}>+ Add another URL</button>
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="gold-button" style={{width: '100%', marginTop: '1rem', padding: '1.2rem', fontWeight: 'bold'}}>
                                    {editingProduct ? '💾 UPDATE JEWELRY DETAILS' : '✨ ADD TO BOUTIQUE'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    cardGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(260px, 30vw, 300px), 1fr))',
        gap: 'clamp(1rem, 3vw, 2rem)',
        marginTop: 'clamp(1.5rem, 4vw, 2rem)'
    },
    productCard: {
        backgroundColor: '#111111',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid rgba(212, 175, 55, 0.1)',
        transition: 'all 0.3s ease',
        cursor: 'default',
    },
    cardImageContainer: {
        position: 'relative',
        height: 'clamp(200px, 40vw, 240px)',
        width: '100%',
        backgroundColor: '#000',
        overflow: 'hidden'
    },
    cardImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform 0.5s ease'
    },
    cardOverlay: {
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        opacity: 0,
        transition: 'opacity 0.3s ease',
        '.productCard:hover &': {
            opacity: 1
        }
    },
    cardActionBtn: {
        width: 'clamp(32px, 8vw, 36px)',
        height: 'clamp(32px, 8vw, 36px)',
        borderRadius: '50%',
        backgroundColor: 'rgba(10, 10, 10, 0.8)',
        color: '#2196f3',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid rgba(255,255,255,0.1)',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    },
    cardInfo: {
        padding: 'clamp(1rem, 3vw, 1.5rem)'
    },
    cardCategory: {
        fontSize: 'clamp(0.65rem, 2vw, 0.7rem)',
        color: 'rgba(212, 175, 55, 0.8)',
        textTransform: 'uppercase',
        letterSpacing: '1px'
    },
    cardName: {
        fontSize: 'clamp(0.95rem, 3vw, 1.1rem)',
        color: '#fff',
        margin: '0.5rem 0',
        fontWeight: '600'
    },
    cardPrice: {
        fontSize: 'clamp(1rem, 3vw, 1.2rem)',
        color: 'var(--color-gold-primary)',
        fontWeight: '700'
    },
    previewGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem', marginTop: '1rem' },
    previewCard: { position: 'relative', height: '120px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' },
    previewImg: { width: '100%', height: '100%', objectFit: 'cover' },
    previewActions: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', opacity: 0, transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' },
    previewBtn: { backgroundColor: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', padding: '0.4rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    noPreview: { gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#555', border: '1px dashed #333', borderRadius: '8px' },
    imagePreviewContainer: { width: '100%', height: '180px', backgroundColor: '#000', borderRadius: '4px', border: '1px solid #333', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    formImagePreview: { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' },
    page: {
        paddingTop: 'clamp(100px, 15vw, 120px)',
        paddingBottom: 'clamp(4rem, 10vw, 8rem)',
        backgroundColor: '#000000',
        minHeight: '100vh'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'clamp(2rem, 5vw, 3rem)',
        flexWrap: 'wrap',
        gap: '1rem'
    },
    addBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
        fontSize: 'clamp(0.85rem, 2vw, 0.9rem)',
        padding: 'clamp(0.6rem, 2vw, 0.8rem) clamp(1rem, 3vw, 1.5rem)'
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: 'clamp(1rem, 4vw, 2rem)'
    },
    modal: {
        backgroundColor: '#111111',
        width: '100%',
        maxWidth: '600px',
        padding: 'clamp(1.5rem, 4vw, 2.5rem)',
        borderRadius: '8px',
        border: '1px solid #c5a059',
        maxHeight: '90vh',
        overflowY: 'auto'
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 'clamp(1.5rem, 4vw, 2rem)'
    },
    closeBtn: {
        backgroundColor: 'transparent',
        color: '#ffffff'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
        flex: 1
    },
    formRow: {
        display: 'flex',
        gap: 'clamp(0.8rem, 2vw, 1rem)',
        flexWrap: 'wrap'
    },
    label: {
        fontSize: 'clamp(0.7rem, 2vw, 0.8rem)',
        color: '#888888',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    input: {
        padding: 'clamp(0.6rem, 2vw, 0.75rem)',
        backgroundColor: '#000000',
        border: '1px solid #333333',
        borderRadius: '4px',
        color: '#ffffff',
        fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
        outline: 'none'
    },
};

export default ProductManagement;
