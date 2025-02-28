import { useWriteContract} from 'wagmi';
import {contractABI, lendingContractAddress} from "../config/config";


const useSupply = (market, address) => {

    const {
        writeContract: writeSupply,
        isLoading: isSupplying,
        isSuccess: isSupplySuccess,
        isError: isSupplyError,
        error: supplyError
    } = useWriteContract();

    const handleWriteSupply = async (amountInWei) => {
        const config = {
            address: lendingContractAddress,
            abi: contractABI,
            functionName: 'deposit',
            args: [market?.address, amountInWei],
        };
        writeSupply(config);
    };


    return {
        handleWriteSupply,
        isSupplying,
        isSupplySuccess,
        isSupplyError,
        supplyError
    };
};

export default useSupply;
