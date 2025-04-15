"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, User, BarChart, FileText, Globe, Award } from "lucide-react";
// import VotingABI from "../abi/VotingABI.json";

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

export default function ResourceCenter() {
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [votingActive, setVotingActive] = useState(false);
  const [activeTab, setActiveTab] = useState('proposals');

  // Sample DAO proposals data
  const proposals = [
    {
      id: 1,
      title: "Treasury Allocation for Developer Grants",
      description: "Proposal to allocate 15% of treasury funds to developer grants for ecosystem growth",
      status: "Voting Active",
      deadline: "2025-06-15",
      link: "https://snapshot.org/#/proofofhumanity.eth/proposal/0x123..."
    },
    {
      id: 2,
      title: "Protocol Upgrade v2.0",
      description: "Implementation of new smart contract architecture with improved gas efficiency",
      status: "Upcoming",
      deadline: "2025-08-10",
      link: "https://forum.proofofhumanity.org/t/protocol-upgrade-v2-0/123"
    }
  ];

  // Educational resources
  const resources = [
    {
      title: "Proof of Humanity Documentation",
      description: "Complete guide to the Proof of Humanity sybil-resistant identity system",
      link: "https://docs.proofofhumanity.org",
      icon: <FileText className="w-5 h-5" />
    },
    {
      title: "DAO Governance 101",
      description: "Learn how decentralized governance works in practice",
      link: "https://ethereum.org/en/dao/",
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      title: "Voting Best Practices",
      description: "How to make informed decisions in decentralized governance",
      link: "https://medium.com/ethereum-optimism/dao-voting-best-practices",
      icon: <Award className="w-5 h-5" />
    }
  ];

  // Decentralized initiatives
  const initiatives = [
    {
      name: "Gitcoin Grants",
      description: "Quadratic funding for public goods in the Ethereum ecosystem",
      link: "https://gitcoin.co",
      category: "Funding"
    },
    {
      name: "ENS Domains",
      description: "Decentralized naming for wallets, websites, and more",
      link: "https://ens.domains",
      category: "Identity"
    },
    {
      name: "Snapshot",
      description: "Off-chain gasless voting platform for DAOs",
      link: "https://snapshot.org",
      category: "Governance"
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const provider = new ethers.providers.AlchemyProvider("sepolia", "_RakxxPKio4vab0Ix5ugoF9cYvhrwQZE");
        const contract = new ethers.Contract(CONTRACT_ADDRESS, VotingABI, provider);

        const [candidatesData, startTime, endTime] = await Promise.all([
          contract.getCandidates(),
          contract.votingStart(),
          contract.votingEnd()
        ]);

        setCandidates(candidatesData.map(c => ({
          id: c.id.toString(),
          name: c.name,
          votes: c.voteCount.toString(),
          image: `https://i.pravatar.cc/150?img=${c.id}`,
          bio: getRandomBio()
        })));

        startTimer(endTime);
        setVotingActive(await contract.isVotingActive());
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const startTimer = (endTimestamp) => {
    const timer = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const diff = endTimestamp - now;

      if (diff <= 0) {
        clearInterval(timer);
        setVotingActive(false);
        return;
      }

      setTimeLeft({
        d: Math.floor(diff / 86400),
        h: Math.floor((diff % 86400) / 3600),
        m: Math.floor((diff % 3600) / 60),
        s: Math.floor(diff % 60)
      });
    }, 1000);

    return () => clearInterval(timer);
  };

  const getRandomBio = () => {
    const bios = [
      "Advocate for decentralized governance with 5 years experience in DAOs",
      "Blockchain developer focused on identity solutions",
      "Community organizer passionate about fair voting systems",
      "Economist researching tokenomics and governance models"
    ];
    return bios[Math.floor(Math.random() * bios.length)];
  };

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
          Resource Center
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Everything you need to make informed voting decisions
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto mb-8 border-b border-gray-700">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('proposals')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'proposals' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-400 hover:text-gray-300'}`}
          >
            Proposals
          </button>
          <button
            onClick={() => setActiveTab('candidates')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'candidates' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-400 hover:text-gray-300'}`}
          >
            Candidates
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'resources' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-400 hover:text-gray-300'}`}
          >
            Learning Resources
          </button>
          <button
            onClick={() => setActiveTab('initiatives')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'initiatives' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-400 hover:text-gray-300'}`}
          >
            Ecosystem Initiatives
          </button>
        </nav>
      </div>

      {isLoading ? (
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p>Loading resources...</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Election Status Card */}
          <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">Current Election Status</h2>
                <p className="text-gray-300">
                  {votingActive ? (
                    `Active - ${timeLeft.d}d ${timeLeft.h}h ${timeLeft.m}m remaining`
                  ) : "No active election"}
                </p>
              </div>
              <Link 
                href="/current-elections" 
                className="px-4 py-2 bg-cyan-600 rounded-lg hover:bg-cyan-500 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="rotate-180 w-4 h-4" />
                {votingActive ? "Go Vote Now" : "View Elections"}
              </Link>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'proposals' && (
            <div className="grid gap-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FileText className="text-cyan-400" />
                Active Proposals
              </h2>
              
              {proposals.map((proposal) => (
                <div key={proposal.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-cyan-500/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{proposal.title}</h3>
                      <p className="text-gray-300 mb-4">{proposal.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className={`px-3 py-1 rounded-full ${proposal.status === "Voting Active" ? "bg-green-900/30 text-green-400" : "bg-blue-900/30 text-blue-400"}`}>
                          {proposal.status}
                        </span>
                        <span className="text-gray-400">Deadline: {proposal.deadline}</span>
                      </div>
                    </div>
                    <a 
                      href={proposal.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm flex items-center gap-2"
                    >
                      View Details <ArrowLeft className="rotate-180 w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'candidates' && (
            <div className="grid gap-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <User className="text-cyan-400" />
                Election Candidates
              </h2>
              
              {candidates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {candidates.map((candidate) => (
                    <div key={candidate.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-cyan-500/50 transition-colors">
                      <div className="flex items-center gap-4 mb-4">
                        <img src={candidate.image} alt={candidate.name} className="w-16 h-16 rounded-full" />
                        <div>
                          <h3 className="text-xl font-bold">{candidate.name}</h3>
                          <p className="text-sm text-gray-400">Candidate ID: {candidate.id}</p>
                        </div>
                      </div>
                      <p className="text-gray-300 mb-4">{candidate.bio}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-cyan-400">
                          <BarChart className="w-5 h-5" />
                          <span>{candidate.votes} votes</span>
                        </div>
                        {votingActive && (
                          <Link 
                            href="/current-elections" 
                            className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                          >
                            Vote for this candidate <ArrowLeft className="rotate-180 w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  No candidates registered for current election
                </div>
              )}
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="grid gap-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <BookOpen className="text-cyan-400" />
                Learning Resources
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource, index) => (
                  <a 
                    key={index} 
                    href={resource.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-cyan-500/50 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-cyan-500/10 rounded-lg mb-4 flex items-center justify-center text-cyan-400">
                      {resource.icon}
                    </div>
                    <h3 className="text-lg font-bold mb-2 group-hover:text-cyan-400 transition-colors">{resource.title}</h3>
                    <p className="text-gray-300">{resource.description}</p>
                    <div className="mt-4 text-cyan-400 flex items-center gap-1 text-sm">
                      Learn more <ArrowLeft className="rotate-180 w-4 h-4" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'initiatives' && (
            <div className="grid gap-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Globe className="text-cyan-400" />
                Ecosystem Initiatives
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initiatives.map((initiative, index) => (
                  <a 
                    key={index} 
                    href={initiative.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-cyan-500/50 transition-colors group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold group-hover:text-cyan-400 transition-colors">{initiative.name}</h3>
                      <span className="px-2 py-1 bg-gray-700 rounded-full text-xs">{initiative.category}</span>
                    </div>
                    <p className="text-gray-300 mb-4">{initiative.description}</p>
                    <div className="text-cyan-400 flex items-center gap-1 text-sm">
                      Visit website <ArrowLeft className="rotate-180 w-4 h-4" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}