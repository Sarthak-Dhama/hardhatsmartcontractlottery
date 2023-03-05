import { useWeb3Contract } from "react-moralis";
import { contractAddresses, abi } from "../constants";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

export default function LotteryEntrance() {
	const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
	const chainId = parseInt(chainIdHex);
	const lotteryAddress =
		chainId in contractAddresses ? contractAddresses[chainId][0] : null;
	const [entranceFee, setEntranceFee] = useState("0");
	const [numPlayers, setNumPlayers] = useState("0");
	const [recentWinner, setRecentWinner] = useState("0");
	const dispatch = useNotification();

	const {
		runContractFunction: enterLottery,
		isFetching,
		isLoading,
	} = useWeb3Contract({
		abi: abi,
		contractAddress: lotteryAddress,
		functionName: "enterLottery",
		params: {},
		msgValue: entranceFee,
	});

	const { runContractFunction: getEntranceFee } = useWeb3Contract({
		abi: abi,
		contractAddress: lotteryAddress,
		functionName: "getEntranceFee",
		params: {},
	});

	const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
		abi: abi,
		contractAddress: lotteryAddress,
		functionName: "getNumberOfPlayers",
		params: {},
	});

	const { runContractFunction: getRecentWinner } = useWeb3Contract({
		abi: abi,
		contractAddress: lotteryAddress,
		functionName: "getRecentWinner",
		params: {},
	});

	async function updateUI() {
		const entranceFeeFromCall = (await getEntranceFee()).toString();
		const numPlayersFromCall = (await getNumberOfPlayers()).toString();
		const recentWinnerFromCall = (await getRecentWinner()).toString();
		setEntranceFee(entranceFeeFromCall);
		setNumPlayers(numPlayersFromCall);
		setRecentWinner(recentWinnerFromCall);
	}

	useEffect(() => {
		if (isWeb3Enabled) {
			updateUI();
		}
	}, [isWeb3Enabled]);

	const handleSuccess = async (txn) => {
		await txn.wait(1);
		handleNewNotification(txn);
		updateUI();
	};

	const handleNewNotification = () => {
		dispatch({
			type: "info",
			message: "Transaction Complete",
			title: "Txn Notification",
			position: "topR",
			icon: "bell",
		});
	};

	return (
		<div className="p-5">
			Lottery Entrance
			{lotteryAddress ? (
				<div>
					<button
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded ml-auto"
						onClick={async () => {
							await enterLottery({
								onSuccess: handleSuccess,
								onError: (error) => console.log(error),
							});
						}}
						disabled={isFetching || isLoading}
					>
						{isFetching || isLoading ? (
							<div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
						) : (
							<div>Enter Lottery</div>
						)}
					</button>
					<div>
						Entrance Fee:
						{ethers.utils.formatUnits(entranceFee, "ether")}Eth
					</div>
					<div>Number Of Players:{numPlayers}</div>
					<div>Recent Winner:{recentWinner}</div>
				</div>
			) : (
				<div>Please switch to a supported chain</div>
			)}
		</div>
	);
}
