# Voting System DApp 🗳️🔗

A decentralized voting application built on Ethereum (Sepolia Testnet) that enables secure, transparent, and tamper-proof elections using modern Web3 tools.

![DApp Screenshot](screenshot.png) *(Add your screenshot here)*

## Table of Contents
- [Description](#description-)
- [Features](#features-)
- [Tech Stack](#tech-stack-)
- [Smart Contract Details](#smart-contract-details-)
- [Installation](#installation-)
- [Deployment](#deployment-)
- [Usage](#usage-)
- [Contributing](#contributing-)
- [License](#license-)

## Description 📖
This Voting System DApp leverages Ethereum's Sepolia Testnet to provide:
- 🛡️ Immutable vote recording
- 🔍 Fully transparent voting history
- 🔒 MetaMask wallet authentication
- 📊 Real-time results tracking
- ⏱️ Configurable voting periods

Deployed using Alchemy infrastructure with Foundry for smart contract development.

## Features ✨
- ✅ Vote creation and management
- ✅ Voter whitelisting system
- ✅ Time-bound voting sessions
- ✅ Real-time vote tracking
- ✅ Results verification

## Tech Stack 💻
**Frontend:**
- Next.js (React Framework)
- Tailwind CSS
- Ethers.js

**Smart Contracts:**
- Solidity
- Foundry (Forge, Cast)
- OpenZeppelin Contracts

**Infrastructure:**
- Sepolia Testnet
- Alchemy RPC & API
- Vercel (Frontend Hosting)

## Smart Contract Details 📜
**Network:** Sepolia Testnet  
**Contract Address:** `0x...` *(Add your contract address here)*  
**Verified on:** [Etherscan](https://sepolia.etherscan.io/) *(Add link)*  

Key contract functions:
- `createVote()` - Admin creates new voting session
- `addCandidate()` - Add voting options
- `vote()` - Cast a vote
- `getResults()` - View current results

## Installation ⚙️
1. Clone the repository:
```bash
git clone https://github.com/sidrahh12/Voting-System-DApp.git
cd Voting-System-DApp
