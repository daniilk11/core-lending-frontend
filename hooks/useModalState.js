import { useState } from 'react';

export default function useModalState() {
    const [modalState, setModalState] = useState({
        isOpen: false,
        activeTab: '',
        selectedMarket: null
    });

    const openModal = (market, action) => {
        setModalState({
            isOpen: true,
            activeTab: action,
            selectedMarket: market
        });
    };

    const closeModal = () => {
        setModalState({
            isOpen: false,
            activeTab: '',
            selectedMarket: null
        });
    };

    return { modalState, openModal, closeModal };
} 