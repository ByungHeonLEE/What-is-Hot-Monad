import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { createPublicClient, formatUnits, http, getContract } from "viem";
import { monadTestnet } from "viem/chains";
import * as fs from 'fs';
import * as path from 'path';

const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: http(),
});

// Load dapp names from JSON file
const dappNamesPath = path.join(__dirname, 'dapp_names.json');
const dappNames = JSON.parse(fs.readFileSync(dappNamesPath, 'utf-8'));

// Initialize the MCP server with a name, version, and capabilities
const server = new McpServer({
  name: "what-is-hot-monad",
  version: "0.0.1",
//   capabilities: ["get-mon-balance"],
});

// Define a tool that gets the MON balance for a given address
server.tool(
  "analyze-hot-contracts",
  "Analyze hot contracts and activities on Monad testnet",
  {
    blockRange: z.string().describe("Number of blocks to analyze (e.g., '10' for last 10 blocks)"),
  },
  async ({ blockRange }) => {
    try {
      const currentBlock = await publicClient.getBlockNumber();
      const startBlock = currentBlock - BigInt(parseInt(blockRange));
      
      // Get recent transactions
      const contractInteractions = new Map<string, number>();
      
      for (let i = startBlock; i <= currentBlock; i++) {
        const block = await publicClient.getBlock({ blockNumber: i, includeTransactions: true });
        if (block?.transactions) {
          block.transactions.forEach(tx => {
            if (typeof tx === 'object' && 'to' in tx && tx.to) {
              const count = contractInteractions.get(tx.to) || 0;
              contractInteractions.set(tx.to, count + 1);
            }
          });
        }
      }

      // Sort contracts by interaction count
      const sortedContracts = Array.from(contractInteractions.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5); // Top 5 most active contracts

      return {
        content: [
          {
            type: "text",
            text: `Analysis of last ${blockRange} blocks (${startBlock} to ${currentBlock}):\n\n` +
                  `Most active contracts:\n${sortedContracts.map(([address, count]) => 
                    `- ${address} (${dappNames[address] || 'Unknown'}): ${count} interactions`
                  ).join('\n')}\n\n` +
                  `Total contracts analyzed: ${contractInteractions.size}`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to analyze contracts: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

// New tool to look up Dapp names
server.tool(
  "lookup-dapp-name",
  "Look up Dapp names for contract addresses",
  {
    addresses: z.array(z.string()).describe("List of contract addresses to look up"),
  },
  async ({ addresses }) => {
    try {
      const results = addresses.map(address => ({
        address,
        name: dappNames[address] || 'Unknown'
      }));

      return {
        content: [
          {
            type: "text",
            text: `Dapp names for the given addresses:\n${results.map(r => 
              `- ${r.address}: ${r.name}`
            ).join('\n')}`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to look up Dapp names: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

/**
 * Main function to start the MCP server
 * Uses stdio for communication with LLM clients
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Monad testnet MCP Server running on stdio");
}

// Start the server and handle any fatal errors
main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
