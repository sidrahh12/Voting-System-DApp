"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Link from "next/link";
import { ArrowLeft, Vote, Clock, User } from "lucide-react";

// Replace with your actual contract ABI
const CONTRACT_ABI = [
  "function getCandidates() view returns (tuple(uint256 id, string name, uint256 voteCount)[])",
  "function votingStart() view returns (uint256)",
  "function votingEnd() view returns (uint256)",
  "function vote(uint256 candidateId)"
];

const CONTRACT_ADDRESS = "0x25f31F5234E47Af845774ac5e324673B4237637B"; // Your contract address

export default function CurrentElections() {
  const [candidates, setCandidates] = useState([]);
  const [candidateId, setCandidateId] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [votingActive, setVotingActive] = useState(true);

  // Fetch contract data
  useEffect(() => {
    const fetchContractData = async () => {
      try {
        const provider = new ethers.providers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/_RakxxPKio4vab0Ix5ugoF9cYvhrwQZE");
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

        // Fetch candidates
        const candidatesData = await contract.getCandidates();
        const formattedCandidates = candidatesData.map(candidate => ({
          id: candidate.id.toString(),
          name: candidate.name,
          votes: candidate.voteCount.toString(),
          description: getRandomDescription(), // Add mock descriptions
          image: `https://i.pravatar.cc/150?img=${candidate.id}` // Generate avatars
        }));
        setCandidates(formattedCandidates);

        // Fetch voting period
        const startTime = await contract.votingStart();
        const endTime = await contract.votingEnd();
        updateTimer(endTime);
      } catch (error) {
        console.error("Error fetching contract data:", error);
      }
    };

    fetchContractData();
  }, []);

  // Timer logic based on contract's votingEnd
  const updateTimer = (endTimestamp) => {
    const timer = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const diff = endTimestamp - now;

      if (diff <= 0) {
        clearInterval(timer);
        setVotingActive(false);
        return;
      }

      const days = Math.floor(diff / (60 * 60 * 24));
      const hours = Math.floor((diff % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((diff % (60 * 60)) / 60);
      const seconds = Math.floor(diff % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  };

  // Helper for mock descriptions
  const getRandomDescription = () => {
    const descriptions = [
      "Experienced leader with a vision for innovation",
      "Community advocate with proven results",
      "Innovative thinker with fresh ideas",
      "Dedicated to transparency and accountability",
      "Proponent of decentralized governance"
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        setIsConnected(true);
        setTransactionStatus("Wallet connected successfully!");
      } catch (error) {
        console.error("Error connecting wallet:", error);
        setTransactionStatus("Failed to connect wallet.");
      }
    } else {
      setTransactionStatus("MetaMask is not installed.");
    }
  };

  const handleVote = async () => {
    if (!isConnected) {
      setTransactionStatus("Please connect your wallet first.");
      return;
    }

    setIsLoading(true);
    setTransactionStatus("Processing your vote...");

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.vote(candidateId);
      await tx.wait();

      // Refresh candidates after voting
      const updatedCandidates = await contract.getCandidates();
      const formattedCandidates = updatedCandidates.map(candidate => ({
        id: candidate.id.toString(),
        name: candidate.name,
        votes: candidate.voteCount.toString(),
        description: getRandomDescription(),
        image: `https://i.pravatar.cc/150?img=${candidate.id}`
      }));
      setCandidates(formattedCandidates);

      setTransactionStatus("Your vote has been recorded successfully!");
      setCandidateId("");
    } catch (error) {
      console.error("Error voting:", error);
      setTransactionStatus("Failed to vote. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 relative">
      {/* Back Button */}
      <Link href="/" className="absolute top-6 left-6 z-50">
        <button className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-all">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </Link>

      {/* Timer */}
      <div className="absolute top-6 right-6 bg-gray-800/50 backdrop-blur-md px-4 py-2 rounded-full border border-gray-700 flex items-center gap-2">
        <Clock className="w-5 h-5 text-cyan-400" />
        <span className="font-mono">
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </span>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-12 pt-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          Current Elections
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          {votingActive ? "Participate in ongoing elections" : "Voting has ended"}
        </p>
      </div>

      {/* Candidates Grid */}
      <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
        {candidates.map((candidate) => (
          <div 
            key={candidate.id}
            className="group relative overflow-hidden rounded-2xl border border-gray-700 bg-gray-800/50 backdrop-blur-md p-6 transition-all hover:shadow-lg hover:shadow-blue-500/10"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                <img src={candidate.image} alt={candidate.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{candidate.name}</h2>
                <p className="text-sm text-gray-400">ID: {candidate.id}</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6">{candidate.description}</p>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-cyan-400">
                <Vote className="w-5 h-5" />
                <span>{candidate.votes} votes</span>
              </div>
              <button 
                onClick={() => setCandidateId(candidate.id)}
                disabled={!votingActive}
                className={`px-4 py-2 rounded-full text-sm font-medium ${!votingActive ? "bg-gray-700 text-gray-500" : candidateId === candidate.id ? "bg-cyan-500 text-white" : "bg-gray-700 hover:bg-gray-600"}`}
              >
                {votingActive ? "Select" : "Closed"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Voting Section */}
      {votingActive && (
        <div className="max-w-2xl mx-auto bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <User className="text-cyan-400" />
            <span>Cast Your Vote</span>
          </h2>
          
          {!isConnected ? (
            <button
              onClick={connectWallet}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
            >
              Connect Wallet
            </button>
          ) : (
            <>
              <div className="mb-6">
                <label className="block text-gray-400 mb-2">Selected Candidate ID</label>
                <input
                  type="text"
                  value={candidateId}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              
              <button
                onClick={handleVote}
                disabled={!candidateId || isLoading}
                className={`w-full py-3 rounded-xl font-medium transition-all ${!candidateId || isLoading ? "bg-gray-700 text-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-green-600 to-emerald-500 hover:shadow-lg hover:shadow-emerald-500/30"}`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : "Submit Vote"}
              </button>
            </>
          )}

          {/* Status Message */}
          {transactionStatus && (
            <div className={`mt-6 p-4 rounded-lg ${transactionStatus.includes("success") ? "bg-green-900/30 text-green-400" : "bg-blue-900/30 text-blue-400"}`}>
              {transactionStatus}
            </div>
          )}
        </div>
      )}
    </div>
  );
}