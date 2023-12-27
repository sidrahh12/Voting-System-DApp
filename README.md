# Voting System DApp
Welcome to our Decentralized Voting System DApp! This project is a secure, transparent, and efficient platform for voting, leveraging the capabilities of blockchain technology and modern web technologies.

**Description:**
This project is a decentralized application built with Solidity, HTML, CSS, and JavaScript. It allows users to register and vote for their preferred candidates in a secure and transparent manner. The system displays registered candidates and the leading candidate based on the votes received.

## Smart Contract

**Main Contract:** ```VotingSystem.sol``` 

**Features:**
- Register new candidates.
- Cast votes for a candidate.
- Retrieve information about registered candidates.
- Check the leading candidate.

## Installation

**Steps:**

1. Clone the repository to your local machine:
```git clone <https://github.com/sidrahh12/Voting-System-DApp>```

2. Navigate to the project directory:
```cd <project-directory>```

3. Install the required dependencies:
```npm install```

4. Compile the smart contract:
```npx hardhat compile```

5. Deploy the smart contract to your chosen Ethereum network. You'll need to set up a secrets.json file with your Ethereum wallet private key and network URL.
```npx hardhat run scripts/deploy.js --network <network-name>```
Replace <network-name> with your desired Ethereum network (e.g., rinkeby, mainnet, or localhost for local development).

6. Start the dApp locally:
```npm start```

The dApp should be accessible at http://localhost:3000.

## Usage

**Steps:**
1. Connect your Ethereum wallet (e.g., MetaMask) to the dApp.
2. Register a new candidate by providing the necessary details.
3. Vote for a candidate by selecting them.
4. View all registered candidates.
5. Check the leading candidate.

## License
This project is licensed under the MIT License.
