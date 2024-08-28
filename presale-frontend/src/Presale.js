// src/Presale.js
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';  // Correctly import ethers
import { PRESALE_ADDRESS, PRESALE_ABI, WELLCHAIN_ADDRESS, WELLCHAIN_ABI } from './contracts';

const Presale = () => {
  const [provider, setProvider] = useState(null);
  const [presaleContract, setPresaleContract] = useState(null);
  const [wellchainContract, setWellchainContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [contribution, setContribution] = useState('');
  const [presaleStatus, setPresaleStatus] = useState(null);

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum); // Correct provider initialization
        setProvider(provider);

        const signer = await provider.getSigner();
        
        const presaleContract = new ethers.Contract(PRESALE_ADDRESS, PRESALE_ABI, signer);
        setPresaleContract(presaleContract);

        const wellchainContract = new ethers.Contract(WELLCHAIN_ADDRESS, WELLCHAIN_ABI, signer);
        setWellchainContract(wellchainContract);

        const accounts = await provider.listAccounts();
        setAccount(accounts[0]);
        
        const status = await presaleContract.status();
        setPresaleStatus(status);
      } else {
        console.error("Ethereum object not found. Install MetaMask.");
      }
    };

    loadBlockchainData();
  }, []);

  const contributeToPresale = async () => {
    if (!presaleContract || !provider) return;

    try {
      const signer = await provider.getSigner();
      const tx = await presaleContract.connect(signer).contribute({ value: ethers.parseUnits(contribution, "ether") }); // Correctly parse contribution value
      await tx.wait();
      alert('Contribution successful!');
    } catch (error) {
      console.error('Error contributing to presale:', error);
      alert('Contribution failed!');
    }
  };

  return (
    <div>
      <h2>Presale</h2>
      <p>Status: {presaleStatus}</p>
      <div>
        <input 
          type="number" 
          placeholder="Contribution (ETH)" 
          value={contribution}
          onChange={(e) => setContribution(e.target.value)}
        />
        <button onClick={contributeToPresale}>Contribute</button>
      </div>
    </div>
  );
};

export default Presale;
