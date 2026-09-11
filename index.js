#!/usr/bin/env node
/**
 * losbeto-mcp — Losbeto x402 tools inside Claude/Cursor.
 * v1.1.2: version aligned across npm/registry; 60s request timeout (node can
 * cold-start ~6s); sends "losbeto-mcp/1.1.2" User-Agent so operator can
 * measure npm-driven traffic in server logs; no other behavior changes.
 * Config: env LOSBETO_PRIVATE_KEY (EVM key with USDC on Base) enables paid tools.
 * Free tools work without any key.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const VERSION = "1.1.2";
const UA = `losbeto-mcp/${VERSION}`;
const BASE_URL = process.env.LOSBETO_URL || "https://api.losbeto.xyz";
const PK = process.env.LOSBETO_PRIVATE_KEY || "";

let payFetch = fetch; // fallback: free endpoints only
if (PK) {
  try {
    const { wrapFetchWithPayment } = await import("x402-fetch");
    const { privateKeyToAccount } = await import("viem/accounts");
    const account = privateKeyToAccount(PK.startsWith("0x") ? PK : `0x${PK}`);
    payFetch = wrapFetchWithPayment(fetch, account);
    console.error(`[losbeto-mcp] x402 payments enabled (Base) for ${account.address}`);
  } catch (e) {
    console.error(`[losbeto-mcp] payment setup failed, free tools only: ${e.message}`);
  }
}

const TOOLS = [
  { name: "try_samples", paid: false, path: "/try",
    description: "FREE: six live endpoint samples in one call — the fastest way to see what Losbeto data looks like.",
    inputSchema: { type: "object", properties: {} } },
  { name: "welcome_free_call", paid: false, path: "/welcome",
    description: "FREE: get a welcome token good for ONE real-time call on any endpoint, no wallet needed.",
    inputSchema: { type: "object", properties: {} } },
  { name: "launch_risk_preview", paid: false, path: "/launch-risk-preview",
    description: "FREE: latest Solana token launches + what the full risk brief includes.",
    inputSchema: { type: "object", properties: {} } },
  { name: "receipts", paid: false, path: "/receipts",
    description: "FREE: audit Losbeto's on-chain sales receipts (radical transparency, operator tests labelled).",
    inputSchema: { type: "object", properties: {} } },
  { name: "launch_risk_brief", paid: true, path: "/launch-risk",
    description: "PAID (~$0.10 USDC via x402): full launch risk brief — on-chain checks (mint authority, holder concentration), DEX liquidity/socials, risk score 0-100, AI verdict (AVOID/WATCH/SMALL-SIZE-ONLY). Optional token arg = Solana mint; omit to analyze the freshest launch.",
    inputSchema: { type: "object", properties: { token: { type: "string", description: "Solana mint address (optional)" } } } },
  { name: "fear_greed", paid: true, path: "/fear-greed",
    description: "PAID ($0.01): live crypto Fear & Greed index with interpretation.",
    inputSchema: { type: "object", properties: {} } },
  { name: "sol_price", paid: true, path: "/pyth-price",
    description: "PAID ($0.003): SOL/USD from Pyth Network oracle.",
    inputSchema: { type: "object", properties: {} } },
  { name: "br_macro", paid: true, path: "/br-macro",
    description: "PAID ($0.05): Brazil central-bank macro in one call — Selic, CDI, IPCA 12m, IGP-M, official PTAX and EUR/BRL, plus the real rate (Fisher relation).",
    inputSchema: { type: "object", properties: {} } },
  { name: "oracle_consensus", paid: true, path: "/oracle-consensus",
    description: "PAID ($0.03): price consensus across multiple oracles/exchanges — median, spread in bps, outlier detection and execution verdict. Optional symbol arg (default SOL).",
    inputSchema: { type: "object", properties: { symbol: { type: "string", description: "Asset symbol, e.g. BTC, ETH, SOL (optional)" } } } },
];

const server = new Server({ name: "losbeto", version: VERSION }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })),
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const tool = TOOLS.find(t => t.name === req.params.name);
  if (!tool) return { content: [{ type: "text", text: `Unknown tool: ${req.params.name}` }], isError: true };
  if (tool.paid && payFetch === fetch)
    return { content: [{ type: "text", text: "This tool is paid via x402. Set LOSBETO_PRIVATE_KEY (EVM key holding USDC on Base) to enable automatic micropayments." }], isError: true };
  const args = req.params.arguments || {};
  const qs = args.token ? `?token=${encodeURIComponent(args.token)}`
           : args.symbol ? `?symbol=${encodeURIComponent(args.symbol)}` : "";
  try {
    const r = await (tool.paid ? payFetch : fetch)(`${BASE_URL}${tool.path}${qs}`, {
      headers: { "User-Agent": UA, "Accept": "application/json" },
      signal: AbortSignal.timeout(60000),
    });
    const text = await r.text();
    return { content: [{ type: "text", text }], isError: !r.ok };
  } catch (e) {
    const msg = e.name === "TimeoutError" ? "request timed out after 60s (node may be cold-starting — try again)" : e.message;
    return { content: [{ type: "text", text: `Request failed: ${msg}` }], isError: true };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error(`[losbeto-mcp] ready (v${VERSION})`);
