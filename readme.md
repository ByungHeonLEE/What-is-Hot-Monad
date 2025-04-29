# What is Hot Monad - Hot Contract Analyzer via MCP

What is Hot Monad is a lightweight MCP server that enables AI models (such as Claude) to **analyze the hottest contracts & activities** on the **Monad testnet**.

It reads on-chain transaction logs from recent blocks and identifies the most active contracts, displaying both their addresses and associated Dapp names — all in a fully automated, natural language format.

---

## ✨ What is MCP?

The **Model Context Protocol (MCP)** is a protocol that allows AI models to interact with external tools and services via structured JSON-RPC communication.

This project creates an MCP server that lets Claude Desktop connect to a blockchain (Monad testnet) and analyze contract activities programmatically.

---

## 📋 Prerequisites

- Node.js (v18 or later recommended)
- `npm` package manager
- Claude Desktop (installed and configured)

---

## 🚀 Getting Started

### 1. Clone this repository

```bash
git clone https://github.com/ByungHeonLEE/What-is-Hot-Monad.git
cd what-is-hot-monad
```

### 2. Install dependencies

```bash
npm install
```

### 3. Build the project

```bash
npm run build
```

This will compile the TypeScript source into the `/dist` directory and copy the Dapp names mapping file.

### 4. Run the MCP server

```bash
npm start
```

✅ The server will start and listen via stdio for MCP communication.

You should see:

```
Monad testnet MCP Server running on stdio
```

---

## 🛠️ How it Works

The MCP server provides two main tools:

1. **analyze-hot-contracts**
   - Analyzes a specified range of recent blocks
   - Identifies the most active smart contracts based on transaction interactions
   - Automatically includes Dapp names for known contracts
   - Returns a human-readable summary of findings

2. **lookup-dapp-name**
   - Looks up Dapp names for specific contract addresses
   - Returns "Unknown" for addresses not in the mapping

**Example Hot Contract Analysis:**   
  ![Image path](/static/summary.png)

✅ **No private key required**  
✅ **Only public blockchain data analyzed**  
✅ **Safe, scalable, AI-integrated**

### Example Prompts:

1. **Basic Analysis:**
```
Please analyze the hot contracts on Monad testnet for the last 20 blocks.
```

2. **Specific Lookup:**
```
Please look up the Dapp names for these contract addresses: ["0x123...", "0x456..."]
```

3. **Advanced:**
```
Please analyze the hot contracts on Monad testnet for the last 20 blocks. For each contract found, show both the contract address and its Dapp name (from the saved mapping). If the Dapp name is unknown, indicate that as well.
```

---

## ⚙️ Claude Desktop Configuration

1. Open **Claude Desktop**
2. Navigate to:  
   **Claude > Settings > Developer > MCP Servers**
3. Open or edit `claude_desktop_config.json`
4. Add this configuration:

```json
{
  "mcpServers": {
    "what-is-hot-monad": {
      "command": "node",
      "args": ["/<your-local-path-to-project>/dist/index.js"]
    }
  }
}
```

5. Save and **restart** Claude Desktop.
  ![Image path](/static/demo.gif)

---

## 🌟 Using the MCP Tool (in Claude)

Once setup:

1. Go to **Claude > Tools** and activate **What-is-hot-Monad**.
2. Ask Claude questions like:

> "Please analyze the hot contracts on Monad testnet for the last 20 blocks."

Claude will use the MCP server to fetch the blockchain data and generate a list of the most active contracts and their Dapp names!

---

## 📚 Further Resources

- [Monad Official Documentation](https://docs.monad.xyz/)
- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction)
- [Viem Blockchain Client](https://viem.sh/)
- [Claude Desktop](https://www.anthropic.com/index/claude)

---

## 🤔 Notes

- The server dynamically scans a configurable range of recent blocks
- Dapp names are maintained in a local JSON file for easy updates

---

## ⚡ Future Improvements

- Dynamic detection of emerging DApps
- Historical analysis over larger block ranges
- Supporting multiple chain RPCs (EVM-compatible)
- Automated Dapp name discovery and verification

