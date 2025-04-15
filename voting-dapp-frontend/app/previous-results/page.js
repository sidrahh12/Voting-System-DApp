"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Link from "next/link";
import { ArrowLeft, Award, Calendar, Users, BarChart2 } from "lucide-react";

const CONTRACT_ADDRESS = "0x25f31F5234E47Af845774ac5e324673B4237637B";
const VotingABI = [
  // Paste your full contract ABI here
];

// Mock history data - in a real app you'd store this in a database or events
const mockHistory = [
  {
    id: 1,
    date: "2024-05-15",
    winner: "Alice",
    totalVotes: 42,
    candidates: [
      { name: "Alice", votes: 42 },
      { name: "Bob", votes: 38 }
    ]
  },
  {
    id: 2,
    date: "2023-12-10",
    winner: "Charlie",
    totalVotes: 65,
    candidates: [
      { name: "Charlie", votes: 65 },
      { name: "Dana", votes: 60 }
    ]
  }
];

export default function PreviousResults() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const provider = new ethers.providers.AlchemyProvider(
          "sepolia", 
          process.env.NEXT_PUBLIC_ALCHEMY_KEY
        );
        const contract = new ethers.Contract(CONTRACT_ADDRESS, VotingABI, provider);
        setContract(contract);
        
        // TODO: Replace with actual event fetching
        setHistory(mockHistory);
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    init();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4">Loading voting history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <Link href="/" className="fixed top-6 left-6 z-50">
        <button className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </Link>

      <div className="max-w-6xl mx-auto pt-16 pb-8">
        <h1 className="text-4xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          Previous Voting Results
        </h1>
        <p className="text-gray-400 text-center mb-12">
          Historical data from past voting sessions
        </p>

        <div className="grid gap-8">
          {history.map((session) => (
            <div key={session.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <Calendar className="text-cyan-400" />
                  <h2 className="text-xl font-bold">{session.date}</h2>
                </div>
                <div className="flex items-center gap-4">
                  <Award className="text-yellow-400" />
                  <span className="text-lg">Winner: {session.winner}</span>
                  <BarChart2 className="text-green-400" />
                  <span>Total Votes: {session.totalVotes}</span>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                  <Users className="text-cyan-400" />
                  Candidates Results
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {session.candidates.map((candidate, index) => (
                    <div key={index} className="bg-gray-700/30 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{candidate.name}</h4>
                          <div className="text-sm text-gray-400">
                            {((candidate.votes / session.totalVotes) * 100).toFixed(1)}% of votes
                          </div>
                        </div>
                        <div className="text-cyan-400 font-bold">
                          {candidate.votes} votes
                        </div>
                      </div>
                      <div className="mt-2 w-full bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-cyan-500 h-2 rounded-full" 
                          style={{ width: `${(candidate.votes / session.totalVotes) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}