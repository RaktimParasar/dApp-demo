import { GoPrimitiveDot } from "react-icons/go";
import "./Navbar.css";

const Navbar = ({ onModalOpen, walletConnected, type }) => {
	return (
		<nav className="nav-container">
			<div className="logo">dApp dEmo</div>
			<button className="wallet-connect" onClick={onModalOpen}>
				{walletConnected && <GoPrimitiveDot size={20} color="#168804" />}
				{walletConnected ? `Connected to ${type}` : "Connect Wallet"}
			</button>
		</nav>
	);
};

export default Navbar;
