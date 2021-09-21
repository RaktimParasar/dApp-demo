import { ethers } from "ethers";
import { TOKEN_ABI, TOKEN_ADDRESS } from "./contracts";

const KOVAN_PROVIDER = new ethers.providers.InfuraProvider(
	"kovan",
	"857fdaf932a740ffbe04a50c51aaee8e"
);

export const getTNodeBalance = (address) =>
	new Promise(async (resolve, reject) => {
		try {
			const tNodeContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, KOVAN_PROVIDER);
			let balance = await tNodeContract.balanceOf(address);
			balance = ethers.utils.formatUnits(balance, 18);
			resolve({
				error: false,
				balance,
			});
		} catch (err) {
			reject({
				error: true,
				message: err.message,
			});
		}
	});

export const getETHBalance = (address) =>
	new Promise(async (resolve, reject) => {
		try {
			let balance = await KOVAN_PROVIDER.getBalance(address);
			balance = ethers.utils.formatEther(balance);
			resolve({
				error: false,
				balance,
			});
		} catch (err) {
			reject({
				error: true,
				message: err.message,
			});
		}
	});

export const getAllowance = (address, address2) => {
	new Promise(async (resolve, reject) => {
		try {
			const tokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, KOVAN_PROVIDER);
			let allowance = await tokenContract.allowance(address, address2);
			allowance = ethers.utils.formatUnits(allowance, 18);
			console.log(allowance);
			resolve({
				error: false,
				allowance,
			});
		} catch (err) {
			reject({
				error: true,
				message: err.message,
			});
		}
	});
};

export const approveToken = (address, amount, signer) => {
	new Promise(async (resolve, reject) => {
		try {
			const tokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);
			const result = await tokenContract.approve(address, ethers.utils.parseUnits(amount, 18));

			resolve({
				error: false,
				data: result,
			});
		} catch (err) {
			reject({
				error: true,
				message: err.message,
			});
		}
	});
};
