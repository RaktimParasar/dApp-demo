import { Modal, Spin } from "antd";
import Metamask from "../../../assets/icn-metamask.svg";
import Arrow from "../../../assets/icn-build-arrows-green.svg";
import "./ConnectModal.css";

const ConnectModal = ({ modal, cancel, connecting, connect, connected, disconnect, address }) => {
	return (
		<Modal
			className="connect-modal"
			visible={modal}
			footer={false}
			onCancel={cancel}
			centered
			maskClosable={false}
		>
			{connected ? (
				<div className="modal-container">
					<h3>Wallet Connected</h3>
					<p className="wallet-address">
						{`${address}`.substring(0, 6) + "..." + `${address}`.substring(37, 42)}{" "}
					</p>
					<button type="secondary" className="disconnect-wallet" onClick={disconnect}>
						Disconnect Wallet
					</button>
				</div>
			) : !connecting ? (
				<div className="modal-container">
					<h3>Connect Wallet</h3>
					<p style={{ textAlign: "center" }}>To start using tNode</p>
					<div className="connect-container">
						<div
							role="button"
							tabIndex={-1}
							className="connect-item"
							onClick={() => connect("metamask")}
						>
							<img src={Metamask} alt="metamask-logo" />
							<h1>MetaMask</h1>
							<img src={Arrow} alt="right-arrow" />
						</div>
					</div>
					<p style={{ textAlign: "center" }}>By continuing, I accept the terms of use</p>
				</div>
			) : (
				<div className="modal-container">
					<h3>Unlock Wallet</h3>
					<p style={{ textAlign: "center" }}>You may need to click the extension.</p>
					<div className="spinner-container">
						<Spin size="large" />
					</div>
					<p style={{ textAlign: "center" }}>By continuing, I accept the terms of use</p>
				</div>
			)}
		</Modal>
	);
};

export default ConnectModal;
