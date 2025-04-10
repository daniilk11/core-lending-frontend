import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import UserDocs from "../../components/UserDocs";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white text-purple-900">
      <Header />
      <UserDocs />
      <Footer />
    </div>
  );
}
