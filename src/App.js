import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { notification } from "antd";
import { useStateWithCallbackLazy } from "use-state-with-callback";
import Container from "@material-ui/core/Container";

import { ConnectModal } from "./components/modals";
import { Navbar, Account, Approve, Allowance } from "./components";
import {
	getETHBalance,
	getTNodeBalance,
	approveToken,
	getAllowance,
} from "./utils/contractHelpers";

function App() {
	const [type, setType] = useState("");
	const [modal, setModal] = useState(false);
	const [connecting, setConnecting] = useStateWithCallbackLazy(false);
	const [connected, setConnected] = useState(false);
	const [ownerAddress, setOwnerAddress] = useState("");
	const [allowanceSpenderAddress, setAllowanceSpenderAddress] = useState("");
	const [signer, setSigner] = useState(null);
	const [ethBalance, setEthBalance] = useState("");
	const [tNodeBalance, setTNodeBalance] = useState("");
	const [approving, setApproving] = useState(false);
	const [approvedAmount, setApprovedAmount] = useState("0");
	const [spenderAddress, setSpenderAddress] = useState("");
	const [allowance, setAllowance] = useState("");

	// 0x874b6cA6143102Ebd8aAc31Be0Bd1Ac4210aA250

	const open = () => {
		setModal(true);
	};

	const cancel = () => {
		setModal(false);
		setConnecting(false);
	};

	const connect = (type) => {
		setConnecting(true);
		if (type === "metamask") {
			connectToMetaMask();
		}
	};

	const disconnect = () => {
		setType("");
		setConnected(false);
		setConnecting(false);
		setOwnerAddress("");
	};

	const connectToMetaMask = async () => {
		try {
			if (window.ethereum !== undefined) {
				const provider = new ethers.providers.Web3Provider(window.ethereum);
				await window.ethereum.request({ method: "eth_requestAccounts" });
				const address = await provider.listAccounts();
				const signer = await provider.getSigner();
				if (provider.network.chainId === 42) {
					setType("Metamask");
					setOwnerAddress(address[0]);
					setSigner(signer);
					setConnected(true);
					setModal(false);
				} else {
					setConnecting(false, () => {
						notification["error"]({
							message: "Wrong network detected. Please connect to Kovan Test Network",
						});
					});
				}
			} else {
				setConnecting(false, () => {
					console.log("error");
					notification["error"]({
						message:
							"Metamask is not installed. Please check if your browser has metamask installed",
					});
				});
			}
		} catch (e) {
			setConnecting(false);
			console.log(e);
		}
	};

	const fetchETHBalance = useCallback(() => {
		getETHBalance(ownerAddress)
			.then((res) => {
				setEthBalance(parseFloat(res.balance));
			})
			.catch((err) => {
				console.log(err.message);
			});
	}, [ownerAddress]);

	const fetchTNodeBalance = useCallback(async () => {
		try {
			const data = await getTNodeBalance(ownerAddress);
			setTNodeBalance(data.balance);
		} catch (err) {
			console.log(err.message);
		}
	}, [ownerAddress]);

	const handleChange = (e) => {
		setAllowanceSpenderAddress(e.target.value);
	};

	const fetchAllowance = (e) => {
		e.preventDefault();
		getAllowance(ownerAddress, allowanceSpenderAddress)
			.then((res) => {
				console.log(res.allowance);
				setAllowance(parseFloat(res.allowance));
			})
			.catch((err) => {
				console.log(err.message);
			});
		setAllowanceSpenderAddress("");
	};

	useEffect(() => {
		if (connected) {
			fetchETHBalance();
			fetchTNodeBalance();
		}
	}, [connected, fetchETHBalance, fetchTNodeBalance]);

	const handleSpenderAddress = (e) => {
		setSpenderAddress(e.target.value);
	};

	const handleAmount = (e) => {
		setApprovedAmount(e.target.value);
	};

	const handleApprove = (e) => {
		e.preventDefault();
		setApproving(true);
		const amount = parseFloat(approvedAmount).toFixed(10);
		approveToken(spenderAddress, amount, signer)
			.then(async (response) => {
				notification["info"]({
					key: "approval-processing-notification",
					message: "Transaction processing",
					description: `Your approval of ${approvedAmount} is being processed. You can view the transaction here`,
					btn: (
						<a
							href={`https://kovan.etherscan.io/tx/${response.data.hash}`}
							target="_blank"
							rel="noreferrer noopener"
						>
							View on Etherscan
						</a>
					),
					duration: 0,
				});
				await response.data.wait();
				notification.close("approval-processing-notification");
				notification["success"]({
					message: "Transaction successful",
					description: `Your approval of ${approvedAmount} is successful. You can view the transaction here`,
					btn: (
						<a
							href={`https://kovan.etherscan.io/tx/${response.data.hash}`}
							target="_blank"
							rel="noreferrer noopener"
						>
							View on Etherscan
						</a>
					),
					duration: 3,
				});
				setApproving(false);
				setAllowance(approvedAmount);
			})
			.catch((err) => {
				notification["error"]({
					message: "Transaction error",
					description: `Your approval of ${approvedAmount} couldn't be processed. Something went wrong. Please try again`,
				});
				setApproving(false);
				console.log(err.message);
			});
		setApprovedAmount("");
		setSpenderAddress("");
	};

	return (
		<>
			<Container maxWidth="sm" className="main-container">
				<Navbar walletConnected={connected} type={type} onModalOpen={open} />
				<Account
					connected={connected}
					ownerAddress={ownerAddress}
					ethBalance={ethBalance}
					tNodeBalance={tNodeBalance}
				/>
				<Allowance
					connected={connected}
					fetchAllowance={fetchAllowance}
					allowanceSpenderAddress={allowanceSpenderAddress}
					handleChange={handleChange}
					allowance={allowance}
				/>
				<Approve
					connected={connected}
					handleAmount={handleAmount}
					handleApprove={handleApprove}
					spenderAddress={spenderAddress}
					handleSpenderAddress={handleSpenderAddress}
					approvedAmount={approvedAmount}
				/>
			</Container>
			<ConnectModal
				modal={modal}
				cancel={cancel}
				connect={connect}
				connecting={connecting}
				connected={connected}
				address={ownerAddress}
				disconnect={disconnect}
			/>
		</>
	);
}

export default App;
