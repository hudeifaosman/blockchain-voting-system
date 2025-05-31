# Build → Run → Test Cryptopia

## Prerequisites

- **Node.js ≥ 14.x** (we used 16.x LTS).
    
    We recommend managing versions with [nvm](https://github.com/nvm-sh/nvm).
    
- **npm** (comes with Node)
- **MetaMask** installed in your browser
- **Python 3** (optional, for `python3 -m http.server`)

## 1. Clone & install

```bash
git clone https://github.com/hudeifaosman/blockchain-voting-system
cd blockchain-voting-system

# ensure correct Node version
nvm install --lts
nvm use --lts

# install project dependencies
npm install
```

> This pulls in Hardhat, ethers.js v5, the Hardhat-Ethers plugin, and any front-end libs.
> 

## 2. Run your local chain

We’ll use Ganache-CLI (no install needed):

```bash
npx ganache-cli
```

This starts a JSON-RPC node at `http://127.0.0.1:8545` with a handful of funded accounts.

> Leave this running in its own terminal window/tab.
> 

## 3. Compile & deploy

In a fresh terminal (inside your project):

```bash
# compile your upgraded 0.8.x Solidity
npx hardhat compile

# deploy to Ganache
npx hardhat run scripts/deploy.js --network localhost
```

You should see:

```
Nothing to compile   # or “Compiled 1 Solidity file successfully…”
Voting deployed to: 0x…YourContractAddress…
```

## 4. Serve & test in browser

MetaMask will only inject on HTTP—so run:

- **Option A (Python)**
    
    ```bash
    
    python3 -m http.server 8000
    ```
    
    → browse to [http://localhost:8000/ui](http://localhost:8000/ui)
    
- **Option B (Node)**
    
    ```bash
    npx http-server -c-1
    ```
    
    → use the URL it prints (e.g. [http://127.0.0.1:8080](http://127.0.0.1:8080/))
    

Once the page loads:

1. Click **Connect Wallet** → approve in MetaMask (ensure MetaMask’s network is set to “Localhost 8545”).
2. Your address should appear on-page.
3. Click **Vote** for any candidate → MetaMask will prompt for the transaction.
4. Confirm → you should see “Tx sent: 0x…” and the vote counts update live.

### Switch MetaMask to your local network

1. Open MetaMask and click the network selector at the top (it currently says “Ethereum Mainnet”).
2. Choose **Add network** (or **Custom RPC**).
3. Enter these details:
    - **Network Name:** Localhost 8545
    - **RPC URL:** `http://127.0.0.1:8545`
    - **Chain ID:** `1337` (Ganache’s default)
    - **Currency Symbol:** ETH
    - **Block Explorer URL:** *(leave blank)*
4. Save and then **switch** to **Localhost 8545** in the MetaMask network dropdown.