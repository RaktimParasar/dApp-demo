const Approve = ({
	connected,
	handleAmount,
	handleApprove,
	spenderAddress,
	handleSpenderAddress,
	approvedAmount,
}) => {
	return (
		<>
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
		</>
	);
};

export default Approve;
