import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { contractABI, contractAddress } from './contract';  // Smart contract ABI and address

const App = () => {
    const [account, setAccount] = useState('');
    const [donationAmount, setDonationAmount] = useState('');
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);

    useEffect(() => {
        loadWeb3();
    }, []);

    const loadWeb3 = async () => {
        if (window.ethereum) {
            const web3Instance = new Web3(window.ethereum);
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            setWeb3(web3Instance);

            const accounts = await web3Instance.eth.getAccounts();
            setAccount(accounts[0]);

            const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
            setContract(contractInstance);
        } else {
            alert('Metamask not detected');
        }
    };

    const donate = async () => {
        if (!contract || !donationAmount) return;
        
        try {
            await contract.methods.donate().send({
                from: account,
                value: web3.utils.toWei(donationAmount, 'ether')
            });
            alert('Donation successful!');
        } catch (err) {
            console.error('Donation failed', err);
        }
    };

    return (
        <div>
            <h1>BlockDonate</h1>
            <p>Connected Account: {account}</p>
            <input
                type="text"
                placeholder="Enter donation amount in ETH"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
            />
            <button onClick={donate}>Donate</button>
        </div>
    );
};

export default App;
