"use client"; 

import Link from "next/link";
import { useState, useEffect } from "react";
import { Wallet, Vote, BarChart, BookOpen, Settings } from "lucide-react";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Mock wallet connection
  const connectWallet = () => {
    setIsConnected(true);
  };

  // Feature cards data
  const features = [
    {
      icon: <BarChart className="w-8 h-8" />,
      title: "Previous Results",
      desc: "View the results of past elections and analyze voting patterns",
      link: "/previous-results",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Vote className="w-8 h-8" />,
      title: "Current Elections",
      desc: "Connect your wallet and vote in ongoing elections",
      link: "/current-elections",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Resource Center",
      desc: "Learn more about candidates and proposals in current elections",
      link: "/resource-center",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Admin Panel",
      desc: "Manage elections and configure voting parameters",
      link: "/admin",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Animated Navbar */}
      <nav className="bg-gray-800/50 backdrop-blur-md p-4 flex justify-between items-center border-b border-gray-700 sticky top-0 z-50">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          Vote DeCentral
        </h1>
        <button
          onClick={connectWallet}
          className={`px-6 py-2 rounded-full font-medium transition-all ${isConnected ? "bg-green-500/20 text-green-400 border border-green-400/50" : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20"}`}
        >
          {isConnected ? "Connected" : "Connect Wallet"}
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 leading-tight">
            Decentralized Voting Platform
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            A transparent and secure way to participate in elections using blockchain technology
          </p>
          
          <div className="flex justify-center gap-4">
            <Link
              href="/current-elections"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all hover:scale-105"
            >
              Start Voting Now
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Link
              key={index}
              href={feature.link}
              className={`group relative overflow-hidden rounded-2xl p-1 bg-gradient-to-br ${feature.color}`}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative z-10 h-full bg-gray-800/90 p-6 rounded-xl transition-all duration-300 group-hover:bg-gray-800/70">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br mb-6 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.desc}</p>
              </div>
              
              {/* Animated background */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${hoveredCard === index ? "bg-[radial-gradient(400px_circle_at_var(--x)_var(--y),rgba(255,255,255,0.1)]" : ""}`}></div>
            </Link>
          ))}
        </div>
      </section>

      {/* Value Proposition */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-16">Why Use Our dApp?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              title: "Transparent",
              desc: "All votes are recorded on the blockchain and can be verified by anyone",
              icon: "🔍"
            },
            {
              title: "Secure",
              desc: "Cryptographic security ensures your vote cannot be tampered with",
              icon: "🔒"
            },
            {
              title: "Decentralized",
              desc: "No central authority controls the voting process or results",
              icon: "🌐"
            }
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-3xl">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Animated background elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl"></div>
        <div className="absolute top-2/3 right-1/3 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl"></div>
      </div>
    </div>
  );
}