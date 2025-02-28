import React, {useState, useEffect} from 'react';
import {parseUnits} from 'viem';
import {toast} from 'react-toastify';
import InputModal from "../InputModal";
import WarningModal from "../WarningModal";
import ButtonModal from "../ButtonModal";
import {isValidNumber} from "../../../utils/format";
import useSupply from "../../../hooks/useSupply";
import useApprove from "../../../hooks/useApprove";
import DetailsSection from "./DetailsSection";

const SupplyTab = ({market, address, healthFactor, openConnectModal}) => {
    const [needApprove, setNeedApprove] = useState(false);
    const [amount, setAmount] = useState('0.00');

    // TODO add logic or remove add check collateral first
    const [useAsCollateral, setUseAsCollateral] = useState(false);
    const handleCollateralToggle = () => {
        setUseAsCollateral(!useAsCollateral);
    };

    const {handleWriteSupply, isSupplying, isSupplySuccess, isSupplyError , supplyError} = useSupply(market, address);
    const {userBalance, userAllowance, handleWriteApproveSpending, isApproving, isApproveSuccess, isApproveError, approveError} = useApprove(market, address);


    const handleAmountChange = (e) => {
        const inputValue = e.target.value;
        const regex = /^\d*\.?\d{0,18}$/;

        if (regex.test(inputValue) && inputValue >= 0) {
            setAmount(inputValue);
            const amountInWei = parseUnits(e.target.value, market.decimals);
            if (isValidNumber(userAllowance) && isValidNumber(amountInWei)) {
                setNeedApprove(amountInWei > userAllowance);
            }
        }
    };

    const handleSupply = async () => {
        if (!address) {
            openConnectModal?.();
            return;
        }
        const amountInWei = parseUnits(amount, market.decimals);

        if (isValidNumber(userAllowance) && isValidNumber(amountInWei)) {
            if (amountInWei > userAllowance) {
                await handleWriteApproveSpending(amountInWei);
            } else {
                await handleWriteSupply(amountInWei);
            }
        }
    };

    useEffect(() => {
        if (isApproveSuccess) {
            toast.success('Successfully approved spending!');
            setNeedApprove(false);
            userAllowance?.toString();
        }
        if (isApproveError) {
            const errorMessage = approveError?.message.includes("User rejected the request")
                ? "User rejected the request."
                : `Error supplying tokens: ${approveError?.message}`;

            toast.error(`Error approving spending: ${errorMessage}`);
        }
    }, [isApproveSuccess, isApproveError, approveError]);

    useEffect(() => {
        if (isSupplySuccess) {
            toast.success('Supply successful!');
            userAllowance?.toString(); // TODO delete
            // TODO wait until i get  tr reciept
            // onClose();
        }
        if (isSupplyError) {
            const errorMessage = supplyError?.message.includes("User rejected the request")
                ? "User rejected the request."
                : `Error supplying tokens: ${supplyError?.message}`;
            toast.error(`Error supplying tokens: ${errorMessage}`);
        }
    }, [isSupplySuccess, isSupplyError, supplyError]);

    const details = [
        {
            label: "Amount Supplied",
            value: `${amount} ${market.asset}`
        },
        {
            label: "",
            value: `$${(parseFloat(amount) * market.price).toFixed(2)}`
        },
        {
            label: "LTV",
            value: `${market.ltv}%`
        },
        {
            label: "Increase in Borrow Limit",
            value: "TODO" // Add calculation when ready
        },
        {
            label: "Supply APY",
            value: `${market?.supplyApy || 0}%`
        }
    ];

    return (
        <div className="space-y-4">
   
            <InputModal 
                    handleAmountChange={handleAmountChange} 
                    name={"Amount to deposit"} 
                    asset={market.asset}
                    amount={amount}
                    userBalance={userBalance}
                    price={market.price}
            />

            <DetailsSection 
                showCollateral={true}
                useAsCollateral={useAsCollateral}
                onCollateralToggle={handleCollateralToggle}
                details={details}
            />

            {!useAsCollateral && <WarningModal/>}
            <ButtonModal
                address={address} isDisabled={isApproving}
                isProcessing={isSupplying}
                openConnectModal={openConnectModal}
                buttonLabel={needApprove ? 'Approve' : isApproving ? 'Approving...' : isSupplying ? 'Supplying...' : 'Supply'}
                handleAction={handleSupply}/>
            {/*TODO delete*/}
            <p>Current Allowance: {userAllowance?.toString()}</p>
        </div>
    );
};

export default SupplyTab;
