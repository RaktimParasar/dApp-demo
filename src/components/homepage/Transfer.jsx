const Transfer = ({
	connected,
	handleTransfer,
	transferAmount,
	transferToAddress,
	handleTransferAmount,
	handleTransferAddress,
}) => {
	return (
		<>
			{connected ? (
				<section className="transfer approve">
					<h3>Transfer Method</h3>
					<form onSubmit={handleTransfer}>
						<input
							type="text"
							placeholder="Address"
							required
							value={transferToAddress}
							onChange={handleTransferAddress}
						/>
						<input
							type="text"
							placeholder="Amount"
							required
							value={transferAmount}
							onChange={handleTransferAmount}
						/>
						<button type="Submit">Transfer</button>
					</form>
				</section>
			) : null}
		</>
	);
};

export default Transfer;
