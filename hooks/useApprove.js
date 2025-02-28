import {useBalance, useReadContract, useWriteContract} from 'wagmi';
import { erc20ABI, lendingContractAddress} from "../config/config";

const useApprove= (market, address) => {

    const {data: userBalance} = useBalance({
        address, token: market?.address
    });

    const {data: userAllowance} = useReadContract({
        address: market?.address,
        abi: erc20ABI,
        functionName: 'allowance',
        args: [address, lendingContractAddress],
        watch: true,
    });

    const {
        writeContract: writeApprove,
        isLoading: isApproving,
        isSuccess: isApproveSuccess,
        isError: isApproveError,
        error: approveError
    } = useWriteContract();

    const handleWriteApproveSpending = async (amountInWei) => {
        const config = {
            address: market?.address,
            abi: erc20ABI,
            functionName: 'approve',
            args: [lendingContractAddress, amountInWei],
        };
        await writeApprove(config);
    };

    return {
        userBalance,
        userAllowance,
        handleWriteApproveSpending,
        isApproving,
        isApproveSuccess,
        isApproveError,
        approveError
    };
};

export default useApprove;
