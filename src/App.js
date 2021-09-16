import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { notification } from "antd";
import { useStateWithCallbackLazy } from "use-state-with-callback";
import Container from "@material-ui/core/Container";

import { ConnectModal } from "./components/modals";
import { Navbar } from "./components";
import { getETHBalance, getTNodeBalance } from "./utils/contractHelpers";

function App() {
	const [type, setType] = useState("");
	const [modal, setModal] = useState(false);
	const [connecting, setConnecting] = useStateWithCallbackLazy(false);
	const [connected, setConnected] = useState(false);
	const [address, setAddress] = useState("");
	const [signer, setSigner] = useState(null);
	const [ethBalance, setEthBalance] = useState("");
	const [tNodeBalance, setTNodeBalance] = useState("");

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

	useEffect(() => {
		if (connected) {
			fetchETHBalance();
			fetchTNodeBalance();
		}
	}, [connected, fetchETHBalance, fetchTNodeBalance]);

	return (
		<>
			<Container maxWidth="sm">
				<Navbar walletConnected={connected} type={type} onModalOpen={open} />
				<main className="main-wallet">
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
				</main>
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
