const Allowance = ({
	connected,
	fetchAllowance,
	allowanceSpenderAddress,
	handleChange,
	allowance,
}) => {
	return (
		<>
			{connected ? (
				<section className="allowance">
					<h3>Allowance Method</h3>
					<form onSubmit={fetchAllowance}>
						<input
							type="text"
							placeholder="Spender address"
							required
							value={allowanceSpenderAddress}
							onChange={handleChange}
						/>
						<button type="submit">Submit</button>
					</form>
					<div className="display-allowance">
						Allowance: {allowance ? parseFloat(allowance).toFixed(2) : "0.00"}
					</div>
				</section>
			) : null}
		</>
	);
};

export default Allowance;
