
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { useState } from 'react'
import { ethers } from 'ethers'
import MarketplaceAbi from '../contractsData/Marketplace.json'
import MarketplaceAddress from '../contractsData/Marketplace-address.json'
import NFTAbi from '../contractsData/NFT.json'
import NFTAddress from '../contractsData/NFT-address.json'
import Navigation from './Navbar'
import Loading from './Loading'
import Home from './Home'
import Create from './Create'
import MyListedItem from './MyListedItem'
import MyPurchases from './MyPurchases'

function App() {
	const [loading, setLoading] = useState(true);
	const [account, setAccount] = useState(null);
	const [nft, setNFT] = useState({});
	const [marketplace, setMarketplace] = useState({});

	// Matamask login/connect
	const web3Handler = async () => {
		const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
		setAccount(accounts[0]);
		// get provider from metamask
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		// set signer of the connected account from the provider
		const signer = provider.getSigner();
		loadContracts(signer);
	}

	const loadContracts = async (signer) => {
		// get deployed copies of contracts
		const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer)
		setMarketplace(marketplace);
		const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer);
		setNFT(nft);
		setLoading(false);
	}

	return (
		<BrowserRouter>
			<div className='App'>
				<Navigation
					web3Handler={web3Handler}
					account={account}
				/>
				{loading ? (
					<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', flexDirection: 'column' }}>
						<div>
							<Loading />
						</div>
						<br />
						<p className='mx-3 my-0' style={{ fontWeight: 'bold', fontSize: '25px' }}>Awaiting Metamask Connection...</p>
					</div>
				) : (
					<Routes>
						<Route
							path="/shelf"
							element={<Home marketplace={marketplace} nft={nft}/>}
						/>
						<Route 
							path="/create" 
							element={<Create marketplace={marketplace} nft={nft}/>}
						/>
						<Route 
							path="/my-listed-items" 
							element={<MyListedItem marketplace={marketplace} nft={nft} account={account}/>}
						/>
						<Route 
							path="/my-purchases" 
							element={<MyPurchases marketplace={marketplace} nft={nft} account={account}/>}
						/>
						<Route path="/" element={<Navigate replace to="/shelf" />} />
					</Routes>
				)}

			</div>
		</BrowserRouter>
	);
}

export default App;
