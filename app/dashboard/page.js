'use client'

import React from 'react';
import Header from '../../components/Header';
import Dashboard from '../../components/dashboard/Dashboard.js';
import Footer from "../../components/Footer";

const DashboardPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white text-purple-900">
            <Header />
            <Dashboard />
            <Footer />
        </div>
    );
};

export default DashboardPage;