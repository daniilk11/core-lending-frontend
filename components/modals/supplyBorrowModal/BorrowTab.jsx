import React, {useState, useEffect} from 'react';
import {useWriteContract} from 'wagmi';
import {parseUnits} from 'viem';
import {toast} from 'react-toastify';
import {lendingContractAddress, contractABI} from "../../../config/config";
import InputModal from "../InputModal";
import WarningModal from "../WarningModal";
import ButtonModal from "../ButtonModal";
import DetailsSection from "./DetailsSection";

const BorrowTab = ({market, address, healthFactor, openConnectModal}) => {
    const [amount, setAmount] = useState('0.00');
    const [canBorrow, setCanBorrow] = useState(false);
    const [borrowLimit, setBorrowLimit] = useState(parseFloat(market?.totalSupply) * (1 - market?.reserveFactor) || 0);

    const handleAmountChange = (e) => {
        const inputValue = e.target.value;
        const regex = /^\d*\.?\d{0,18}$/;

        if (regex.test(inputValue) && inputValue >= 0) {
            setAmount(inputValue);

            if (parseFloat(inputValue) !== 0 && parseFloat(inputValue) <= borrowLimit && parseFloat(healthFactor) > 1.01) // TODO make new calculation healthFactor
                setCanBorrow(true);
            else
                setCanBorrow(false);
        }
    };

    const calculateNewHealthFactor = (totalBorrows, amount, borrowLimit) => {
        // (uint256 borrowedValueInUSD, uint256 collateralValueInUSD) = getAccountInformation(account);
        // if (borrowedValueInUSD == 0) return 1;
        // return collateralValueInUSD / borrowedValueInUSD * 1e8 ;
        
        const amountInAsset = parseFloat(amount) || 0;
        // TODO fix this take from contract  mb calculate in usd
        // const newTotalBorrowed = parseFloat(userData?.totalBorrows) + amountInAsset;

        const newTotalBorrowed = parseFloat(market?.totalBorrows) + amountInAsset;
        // collateral already decrease on LTV market
        // return (newTotalBorrowed / userData?.totalUsdCollateral);
        return ((newTotalBorrowed / borrowLimit) * 100) || 0;
    };


    const {
        writeContract: writeBorrow,
        isLoading: isBorrowing,
        isSuccess: isBorrowSuccess,
        isError: isBorrowError,
        error: borrowError
    } = useWriteContract();

    const handleBorrow = async () => {
        if (!address) {
            openConnectModal?.();
            return;
        }
        const amountInWei = parseUnits(amount, market.decimals);
        try {
            await writeBorrow({
                address: lendingContractAddress,
                abi: contractABI,
                functionName: 'borrow',
                args: [market?.address, amountInWei],
            });
        } catch (error) {
            toast.error("Borrow transaction failed");
        }
    };

    useEffect(() => {
        if (isBorrowSuccess) {
            toast.success('Borrow successful!');
            // TODO fix setBorrowLimit  need to call get user data and then update all
            setBorrowLimit(parseFloat(market?.totalSupply) * (1 - market?.reserveFactor))
        }
        if (isBorrowError) {
            const errorMessage = borrowError?.message.includes("User rejected the request")
                ? "User rejected the request."
                : `Error supplying tokens: ${borrowError?.message}`;
            toast.error(`Error borrowing tokens: ${errorMessage}`);
        }
    }, [isBorrowSuccess, isBorrowError, borrowError]);


    const details = [
        {
            label: "Max to borrow",
            value: `${borrowLimit} ${market.asset}`
        },
        {
            label: "Borrow Limit",
            value: `$${((market?.totalSupply * market?.ltv / 100 || 0) * market.price).toFixed(2)}`
        },
        {
            label: "Amount Borrowed",
            value: `${amount} ${market.asset}`
        },
        {
            label: "",
            value: `$${(parseFloat(amount) * market.price).toFixed(2)}`
        },
        {
            label: "New Health Factor",
            value: calculateNewHealthFactor()
        },
        {
            label: "Total Borrowed",
            value: `${market?.totalBorrows || 0} ${market.asset}`
        },
        {
            label: "",
            value: `$${((market?.totalBorrows || 0) * market.price).toFixed(2)}`
        },
        {
            label: "Borrow APY",
            value: `${market?.borrowApy || 0}%`
        }
    ];

    return (
        <div className="space-y-4">

            <InputModal 
                    handleAmountChange={handleAmountChange}
                    name={"Amount to borrow"}
                    asset={market.asset}
                    amount={amount}
                    price={market.price}
                />

            <DetailsSection details={details} />
            
            <WarningModal/>
            <ButtonModal
                address={address} isDisabled={canBorrow}
                isProcessing={isBorrowing}
                openConnectModal={openConnectModal}
                buttonLabel={isBorrowing ? 'Borrowing...' : 'Borrow'}
                handleAction={handleBorrow}/>

        </div>
    );
};

export default BorrowTab;
