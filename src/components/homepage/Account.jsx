const Account = ({ connected, ownerAddress, ethBalance, tNodeBalance }) => {
	return (
		<section className="main-wallet">
			{connected ? (
				<>
					<h3 className="main-header">Account Info</h3>
					<p className="wallet-address">
						Wallet Address:{" "}
						{`${ownerAddress}`.substring(0, 6) + "..." + `${ownerAddress}`.substring(37, 42)}
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
	);
};

export default Account;
