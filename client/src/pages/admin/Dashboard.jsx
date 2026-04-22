import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Users, ShoppingCart, DollarSign, ArrowUpRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                const { data } = await axios.get('http://localhost:5000/api/orders/stats', config);
                
                const formattedStats = [
                    { label: 'Total Revenue', value: `$${data.stats.totalRevenue.toLocaleString()}`, icon: <DollarSign size={24}/>, color: '#4caf50' },
                    { label: 'Total Orders', value: data.stats.totalOrders.toLocaleString(), icon: <ShoppingCart size={24}/>, color: 'var(--color-gold-primary)' },
                    { label: 'Total Users', value: data.stats.totalUsers.toLocaleString(), icon: <Users size={24}/>, color: '#2196f3' },
                    { label: 'Active Products', value: data.stats.activeProducts.toLocaleString(), icon: <Package size={24}/>, color: '#ff9800' },
                ];
                
                setStats(formattedStats);
                setRecentOrders(data.recentOrders);
                setChartData(data.weeklyRevenue);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
                setLoading(false);
            }
        };
        fetchStats();
    }, [user.token]);

    if (loading) return <div style={{padding: '200px', textAlign: 'center'}}>Loading Luxury Dashboard...</div>;

    return (
        <div style={styles.page}>
            <div className="container">
                <div style={styles.header}>
                    <div>
                        <h1 style={{...styles.title, fontFamily: "'Playfair Display', serif"}}>Evergreen <span className="gold-text">Elegance</span></h1>
                        <p style={styles.subtitle}>Boutique Oversight & Analytics</p>
                    </div>
                    <div style={styles.adminActions}>
                        <Link to="/admin/products" className="gold-button">Manage Inventory</Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div style={styles.statsGrid}>
                    {stats.map((stat, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            style={styles.statCard}
                        >
                            <div style={{...styles.statIcon, backgroundColor: `${stat.color}15`, color: stat.color}}>
                                {stat.icon}
                            </div>
                            <div>
                                <p style={styles.statLabel}>{stat.label}</p>
                                <h3 style={styles.statValue}>{stat.value}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Chart Section */}
                <div style={styles.chartPanel}>
                    <h3 style={{marginBottom: '2rem'}}>Revenue Growth</h3>
                    <div style={{height: '350px', width: '100%', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '12px'}}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-gold-primary)" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="var(--color-gold-primary)" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="name" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip 
                                    contentStyle={{backgroundColor: 'var(--color-dark-gray)', border: '1px solid var(--color-gold-primary)', borderRadius: '8px', padding: '10px'}}
                                    itemStyle={{color: 'var(--color-gold-primary)', fontWeight: 'bold'}}
                                    cursor={{stroke: 'var(--color-gold-primary)', strokeWidth: 2}}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="var(--color-gold-primary)" fillOpacity={1} fill="url(#colorRev)" strokeWidth={4} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div style={styles.contentGrid}>
                    {/* Recent Orders */}
                    <div style={styles.recentPanel}>
                        <div style={styles.panelHeader}>
                            <h3>Recent Orders</h3>
                            <Link to="/admin/orders" style={styles.viewAll}>View All <ArrowUpRight size={16}/></Link>
                        </div>
                        <div style={styles.tableWrapper}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Amount</th>
                                        <th>Payment</th>
                                        <th>Fulfillment</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map(order => (
                                        <tr key={order._id}>
                                            <td>
                                                <img 
                                                    src={order.items[0]?.images && order.items[0]?.images[0] ? (order.items[0].images[0].startsWith('http') ? order.items[0].images[0] : `http://localhost:5000${order.items[0].images[0]}`) : 'https://via.placeholder.com/40x40'} 
                                                    alt="" 
                                                    style={{width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover'}}
                                                />
                                            </td>
                                            <td style={{fontWeight: '600', color: 'var(--color-gold-primary)'}}>#{order._id.substring(0, 8)}</td>
                                            <td>{order.user?.name || 'Guest'}</td>
                                            <td style={{fontWeight: '700'}}>${order.totalAmount.toLocaleString()}</td>
                                            <td>
                                                <span style={{
                                                    color: order.paymentStatus === 'paid' ? '#4caf50' : '#ff9800',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '700'
                                                }}>
                                                    {order.paymentStatus.toUpperCase()}
                                                </span>
                                            </td>
                                            <td>
                                                <span style={{
                                                    ...styles.statusBadge, 
                                                    backgroundColor: order.orderStatus === 'delivered' ? '#4caf5020' : 
                                                                    order.orderStatus === 'processing' ? '#ff980020' :
                                                                    order.orderStatus === 'shipped' ? '#2196f320' : '#f4433620',
                                                    color: order.orderStatus === 'delivered' ? '#4caf50' : 
                                                           order.orderStatus === 'processing' ? '#ff9800' :
                                                           order.orderStatus === 'shipped' ? '#2196f3' : '#f44336'
                                                }}>
                                                    {order.orderStatus}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Low Stock Alerts */}
                    <div style={styles.alertPanel}>
                        <h3 style={{marginBottom: '1.5rem'}}>Inventory Alerts</h3>
                        {stats.lowStockProducts?.length > 0 ? stats.lowStockProducts.map(p => (
                            <div key={p._id} style={styles.alertItem}>
                                <img 
                                    src={p.images && p.images[0] ? (p.images[0].startsWith('http') ? p.images[0] : `http://localhost:5000${p.images[0]}`) : 'https://via.placeholder.com/40x40'} 
                                    alt="" 
                                    style={{width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover'}}
                                />
                                <div>
                                    <p style={{fontWeight: '600'}}>{p.name}</p>
                                    <p style={{fontSize: '0.8rem', color: '#f44336'}}>Only {p.stock} units left</p>
                                </div>
                            </div>
                        )) : (
                            <p style={{color: 'var(--color-text-muted)', fontSize: '0.9rem'}}>Stock levels are healthy.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: {
        paddingTop: 'clamp(80px, 12vw, 120px)',
        paddingBottom: 'clamp(4rem, 8vw, 8rem)',
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
        fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
        marginBottom: '0.5rem',
    },
    subtitle: {
        color: 'var(--color-text-muted)',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(200px, 25vw, 260px), 1fr))',
        gap: 'clamp(1rem, 3vw, 2rem)',
        marginBottom: 'clamp(2rem, 4vw, 3rem)',
    },
    statCard: {
        backgroundColor: 'var(--color-dark-gray)',
        padding: '2rem',
        borderRadius: '12px',
        border: '1px solid rgba(212, 175, 55, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
    },
    statIcon: {
        width: '56px',
        height: '56px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statLabel: {
        fontSize: '0.85rem',
        color: 'var(--color-text-muted)',
        marginBottom: '0.3rem',
    },
    statValue: {
        fontSize: '1.5rem',
        fontWeight: '700',
        color: 'var(--color-white)',
    },
    chartPanel: {
        backgroundColor: 'var(--color-dark-gray)',
        padding: '2rem',
        borderRadius: '12px',
        border: '1px solid rgba(212, 175, 55, 0.1)',
        marginBottom: '3rem',
    },
    contentGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(300px, 40vw, 500px), 1fr))',
        gap: 'clamp(1.5rem, 3vw, 2rem)',
    },
    recentPanel: {
        backgroundColor: 'var(--color-dark-gray)',
        padding: '2rem',
        borderRadius: '12px',
        border: '1px solid rgba(212, 175, 55, 0.1)',
    },
    panelHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
    },
    viewAll: {
        fontSize: '0.9rem',
        color: 'var(--color-gold-primary)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left',
    },
    statusBadge: {
        padding: '0.4rem 0.8rem',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: '600',
    },
    alertPanel: {
        backgroundColor: 'var(--color-dark-gray)',
        padding: '2rem',
        borderRadius: '12px',
        border: '1px solid rgba(212, 175, 55, 0.1)',
    },
    alertItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem',
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: '8px',
        marginBottom: '1rem',
    },
    alertDot: {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: '#f44336',
    }
};

export default Dashboard;
