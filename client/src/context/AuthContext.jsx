import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '@/api/axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = '/api/auth';

    useEffect(() => {
        const savedUser = localStorage.getItem('viva_gold_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post(`${API_URL}/login`, { email, password });
            setUser(data);
            localStorage.setItem('viva_gold_user', JSON.stringify(data));
            toast.success(`Welcome back, ${data.name}!`);
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
            throw error;
        }
    };

    const register = async (name, email, password, phone) => {
        try {
            const { data } = await axios.post(`${API_URL}/register`, { name, email, password, phone });
            setUser(data);
            localStorage.setItem('viva_gold_user', JSON.stringify(data));
            toast.success("Account created successfully!");
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('viva_gold_user');
        toast.info("Logged out successfully");
    };

    const isAdmin = user && user.role === 'admin';

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isAdmin, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
