'use client'

import React from 'react';
import Header from '../../components/Header';
import Markets from "../../components/markets/Markets";
import Footer from "../../components/Footer";

const MarketsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white text-purple-900">
      <Header />
      <Markets />
      <Footer />
    </div>
  );
};

export default MarketsPage;