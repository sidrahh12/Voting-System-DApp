"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Link from "next/link";
import { ArrowLeft, Settings, Clock, User, Plus, RefreshCw, AlertTriangle, Trophy } from "lucide-react";

const CONTRACT_ADDRESS = "0x25f31F5234E47Af845774ac5e324673B4237637B";

const VotingABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_additionalMinutes", "type": "uint256"}
    ],
    "name": "extendVoting",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCandidates",
    "outputs": [
      {
        "components": [
          {"internalType": "uint256", "name": "id", "type": "uint256"},
          {"internalType": "string", "name": "name", "type": "string"},
          {"internalType": "uint256", "name": "voteCount", "type": "uint256"}
        ],
        "internalType": "struct Voting.Candidate[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getRemainingTime",
    "outputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "_voter", "type": "address"}
    ],
    "name": "getVoterStatus",
    "outputs": [
      {"internalType": "bool", "name": "", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getWinner",
    "outputs": [
      {"internalType": "uint256", "name": "winnerId", "type": "uint256"},
      {"internalType": "string", "name": "winnerName", "type": "string"},
      {"internalType": "string", "name": "note", "type": "string"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "isVotingActive",
    "outputs": [
      {"internalType": "bool", "name": "", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {"internalType": "address", "name": "", "type": "address"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_durationInMinutes", "type": "uint256"},
      {"internalType": "string[]", "name": "_names", "type": "string[]"}
    ],
    "name": "resetVoting",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_durationInMinutes", "type": "uint256"},
      {"internalType": "string[]", "name": "_names", "type": "string[]"}
    ],
    "name": "startVoting",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_candidateId", "type": "uint256"}
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "votingEnd",
    "outputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "votingStart",
    "outputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export default function AdminPanel() {
  const [isOwner, setIsOwner] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [votingActive, setVotingActive] = useState(false);
  const [newCandidateName, setNewCandidateName] = useState("");
  const [duration, setDuration] = useState(60);
  const [status, setStatus] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [remainingTime, setRemainingTime] = useState("");
  const [winner, setWinner] = useState(null);
  const [currentAccount, setCurrentAccount] = useState("");

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask!");
      }

      const accounts = await window.ethereum.request({ 
        method: "eth_requestAccounts" 
      });
      setCurrentAccount(accounts[0]);
      setIsConnected(true);
      
      // Verify ownership
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, VotingABI, signer);
      
      const owner = await contract.owner();
      setIsOwner(accounts[0].toLowerCase() === owner.toLowerCase());
      
      // Fetch data after connecting
      await fetchData();
      
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setStatus(`Error: ${error.message}`);
    }
  };

  const checkOwner = async () => {
    if (window.ethereum && currentAccount) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, VotingABI, signer);
        
        const owner = await contract.owner();
        setIsOwner(currentAccount.toLowerCase() === owner.toLowerCase());
      } catch (error) {
        console.error("Error checking ownership:", error);
      }
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, VotingABI, provider);
      
      const [candidatesData, isActive, remainingTimeRaw] = await Promise.all([
        contract.getCandidates(),
        contract.isVotingActive(),
        contract.getRemainingTime()
      ]);
      
      setCandidates(candidatesData);
      setVotingActive(isActive);
      setRemainingTime(formatTime(remainingTimeRaw));
      
      if (!isActive) {
        const [winnerId, winnerName, note] = await contract.getWinner();
        if (note.includes("successful")) {
          setWinner({ id: winnerId, name: winnerName, note });
        } else {
          setWinner(null);
        }
      } else {
        setWinner(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    if (seconds.eq(0)) return "Voting Ended";
    const mins = seconds.div(60);
    const secs = seconds.mod(60);
    return `${mins.toString()}m ${secs.toString()}s remaining`;
  };

  const startVoting = async () => {
    if (!isConnected || !isOwner) return;
    setIsLoading(true);
    setStatus("Starting voting session...");
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, VotingABI, signer);
      
      const candidateNames = candidates.map(c => c.name);
      if (newCandidateName.trim()) {
        candidateNames.push(newCandidateName.trim());
      }
      
      const tx = await contract.startVoting(duration, candidateNames);
      await tx.wait();
      
      setStatus("Voting started successfully!");
      setNewCandidateName("");
      setWinner(null);
      await fetchData();
    } catch (error) {
      console.error("Error starting voting:", error);
      setStatus(`Error: ${error.reason || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetVoting = async () => {
    if (!isConnected || !isOwner) return;
    setIsLoading(true);
    setStatus("Resetting voting session...");
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, VotingABI, signer);
      
      const candidateNames = candidates.map(c => c.name);
      if (newCandidateName.trim()) {
        candidateNames.push(newCandidateName.trim());
      }
      
      const tx = await contract.resetVoting(duration, candidateNames);
      await tx.wait();
      
      setStatus("Voting reset successfully!");
      setNewCandidateName("");
      setWinner(null);
      await fetchData();
    } catch (error) {
      console.error("Error resetting voting:", error);
      setStatus(`Error: ${error.reason || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const extendVoting = async () => {
    if (!isConnected || !isOwner) return;
    setIsLoading(true);
    setStatus("Extending voting session...");
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, VotingABI, signer);
      
      const tx = await contract.extendVoting(duration);
      await tx.wait();
      
      setStatus(`Voting extended by ${duration} minutes!`);
      await fetchData();
    } catch (error) {
      console.error("Error extending voting:", error);
      setStatus(`Error: ${error.reason || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkOwner();
  }, [currentAccount]);

  useEffect(() => {
    if (isConnected) {
      fetchData();
      const interval = setInterval(fetchData, 10000);
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        setIsConnected(false);
        setIsOwner(false);
        setCurrentAccount("");
      } else if (accounts[0] !== currentAccount) {
        setCurrentAccount(accounts[0]);
      }
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, [currentAccount]);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 relative">
        <div className="max-w-2xl mx-auto text-center py-12">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Wallet Not Connected</h2>
          <p className="text-gray-400 mb-6">
            Please connect your wallet to access the admin panel
          </p>
          <button
            onClick={connectWallet}
            className="px-4 py-2 bg-cyan-600 rounded-lg hover:bg-cyan-500 transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 relative">
        <div className="max-w-2xl mx-auto text-center py-12">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-400 mb-6">
            Only the contract owner can access this panel
          </p>
          <div className="mb-4 text-sm">
            Connected as: {`${currentAccount.substring(0, 6)}...${currentAccount.substring(currentAccount.length - 4)}`}
          </div>
          <Link href="/" className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 relative">
      <Link href="/" className="absolute top-6 left-6 z-50">
        <button className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-all">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </Link>

      <div className="max-w-7xl mx-auto text-center mb-12 pt-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          Admin Panel
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Manage voting sessions and candidates
        </p>
        <div className="text-sm text-gray-400 mt-2">
          Connected as admin: {`${currentAccount.substring(0, 6)}...${currentAccount.substring(currentAccount.length - 4)}`}
        </div>
      </div>

      <div className="max-w-4xl mx-auto grid gap-8">
        <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Settings className="text-cyan-400" />
            <span>Voting Controls</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-gray-400 mb-2">Duration (minutes)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                min="1"
              />
            </div>
            
            <div>
              <label className="block text-gray-400 mb-2">New Candidate</label>
              <input
                type="text"
                value={newCandidateName}
                onChange={(e) => setNewCandidateName(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                placeholder="Candidate name"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={startVoting}
              disabled={isLoading || votingActive}
              className={`px-6 py-3 rounded-xl font-medium flex items-center justify-center ${
                isLoading || votingActive ? "bg-gray-700 cursor-not-allowed" : "bg-green-600 hover:bg-green-500"
              }`}
            >
              <Plus className="w-5 h-5 mr-2" />
              Start New Session
            </button>
            
            <button
              onClick={resetVoting}
              disabled={isLoading || !votingActive}
              className={`px-6 py-3 rounded-xl font-medium flex items-center justify-center ${
                isLoading || !votingActive ? "bg-gray-700 cursor-not-allowed" : "bg-yellow-600 hover:bg-yellow-500"
              }`}
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Reset Session
            </button>
            
            <button
              onClick={extendVoting}
              disabled={isLoading || !votingActive}
              className={`px-6 py-3 rounded-xl font-medium flex items-center justify-center ${
                isLoading || !votingActive ? "bg-gray-700 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"
              }`}
            >
              <Clock className="w-5 h-5 mr-2" />
              Extend Session
            </button>
          </div>

          {votingActive && remainingTime && (
            <div className="mt-6 text-center text-lg">
              <span className="font-bold">Status:</span>{" "}
              <span className="text-green-400">Active</span> •{" "}
              <span className="text-cyan-400">{remainingTime}</span>
            </div>
          )}

          {winner && (
            <div className="mt-6 bg-gradient-to-r from-green-900/30 to-cyan-900/30 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="font-bold">Winner:</span>
                <span className="text-xl">{winner.name}</span>
              </div>
              <div className="text-sm text-gray-300">{winner.note}</div>
            </div>
          )}
        </div>

        {status && (
          <div className={`p-4 rounded-lg text-center ${
            status.includes("Error") ? "bg-red-900/30" : "bg-green-900/30"
          }`}>
            {status}
          </div>
        )}

        <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <User className="text-cyan-400" />
            <span>Candidates</span>
            <span className="ml-auto text-sm bg-gray-700 px-3 py-1 rounded-full">
              {votingActive ? "Voting Active" : "Voting Inactive"}
            </span>
          </h2>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
              <p>Loading candidates...</p>
            </div>
          ) : candidates.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No candidates registered
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidates.map((candidate, index) => (
                <div key={index} className="bg-gray-700/50 p-4 rounded-lg hover:bg-gray-700/70 transition-colors">
                  <div className="flex items-center gap-4">
                    <img 
                      src={`https://i.pravatar.cc/150?img=${index}`} 
                      className="w-12 h-12 rounded-full" 
                      alt={`Candidate ${candidate.name}`}
                    />
                    <div className="flex-1">
                      <h3 className="font-bold">{candidate.name}</h3>
                      <p className="text-sm text-gray-400">ID: {candidate.id.toString()}</p>
                    </div>
                    <div className="text-cyan-400 font-bold">
                      {candidate.voteCount.toString()} votes
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}