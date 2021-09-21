import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { notification } from "antd";
import { useStateWithCallbackLazy } from "use-state-with-callback";
import Container from "@material-ui/core/Container";

import { ConnectModal } from "./components/modals";
import { Navbar } from "./components";
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
	const [address, setAddress] = useState("");
	const [address2, setAddress2] = useState("");
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
		setAddress("");
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
					setAddress(address[0]);
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
		getETHBalance(address)
			.then((res) => {
				setEthBalance(parseFloat(res.balance));
			})
			.catch((err) => {
				console.log(err.message);
			});
	}, [address]);

	const fetchTNodeBalance = useCallback(async () => {
		try {
			const data = await getTNodeBalance(address);
			setTNodeBalance(data.balance);
		} catch (err) {
			console.log(err.message);
		}
	}, [address]);

	const handleChange = (e) => {
		setAddress2(e.target.value);
	};

	const fetchAllowance = (e) => {
		e.preventDefault();
		getAllowance(address, address2)
			.then((res) => {
				console.log(res.allowance);
				setAllowance(parseFloat(res.allowance));
			})
			.catch((err) => {
				console.log(err.message);
			});
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
		console.log("Hello");
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
	};

	return (
		<>
			<Container maxWidth="sm">
				<Navbar walletConnected={connected} type={type} onModalOpen={open} />
				<section className="main-wallet">
					{connected ? (
						<>
							<h3 className="main-header">Account Info</h3>
							<p className="wallet-address">
								Wallet Address:{" "}
								{`${address}`.substring(0, 6) + "..." + `${address}`.substring(37, 42)}
							</p>
							<p className="wallet-address">
								Wallet Balance:{" "}
								{parseFloat(ethBalance) > 0 ? parseFloat(ethBalance).toFixed(6) : "0.000000"} ETH
							</p>

							<p className="wallet-address">
								tNode Token Balance:{" "}
								{parseFloat(tNodeBalance) > 0 ? parseFloat(tNodeBalance).toFixed(2) : "0.00"} tNode
							</p>
						</>
					) : (
						<p>Connect Wallet to get wallet information</p>
					)}
				</section>
				{connected ? (
					<section className="allowance">
						<h3>Allowance Method</h3>
						<form onSubmit={fetchAllowance}>
							<input
								type="text"
								placeholder="Spender address"
								required
								value={address2}
								onChange={handleChange}
							/>
							<button type="submit">Submit</button>
						</form>
						<div className="display-allowance">
							Allowance: {allowance ? parseFloat(allowance).toFixed(2) : "0.00"}
						</div>
					</section>
				) : null}
				{connected ? (
					<section className="approve">
						<h3>Approve Method</h3>
						<form onSubmit={handleApprove}>
							<input
								type="text"
								placeholder="Spender address"
								required
								value={spenderAddress}
								onChange={handleSpenderAddress}
							/>
							<input
								type="text"
								placeholder="Amount"
								required
								value={approvedAmount}
								onChange={handleAmount}
							/>
							<button type="Submit">Approve</button>
						</form>
					</section>
				) : null}
			</Container>
			<ConnectModal
				modal={modal}
				cancel={cancel}
				connect={connect}
				connecting={connecting}
				connected={connected}
				address={address}
				disconnect={disconnect}
			/>
		</>
	);
}

export default App;
