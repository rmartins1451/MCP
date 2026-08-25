# losbeto-mcp     <!-- mcp-name: io.github.rmartins1451/losbeto -->

Losbeto x402 market intelligence as native tools in Claude Desktop, Claude Code, or Cursor.
Brazil central-bank macro, multi-oracle price consensus, launch risk, forex, commodities and crypto.
No signup. No API key. Paid tools settle automatically in USDC on Base via x402.

## Recommended: remote server (no install)
```json
{
  "mcpServers": {
    "losbeto": { "url": "https://api.losbeto.xyz/mcp" }
  }
}
```

## Install locally (Claude Desktop / Cursor)
```json
{
  "mcpServers": {
    "losbeto": {
      "command": "npx",
      "args": ["-y", "losbeto-mcp"],
      "env": { "LOSBETO_PRIVATE_KEY": "0x..." }
    }
  }
}
```
`LOSBETO_PRIVATE_KEY` = an EVM private key holding a little USDC on Base (optional — free tools work without it).

## Tools
FREE: `try_samples` (6 live samples in 1 call) · `welcome_free_call` (one real-time call, no wallet) · `launch_risk_preview` · `receipts` (audit our on-chain sales, honestly labeled)

PAID via x402: `launch_risk_brief` (~$0.10) · `br_macro` ($0.05, BCB data) · `oracle_consensus` ($0.03) · `fear_greed` ($0.01) · `sol_price` ($0.003)

Transparency: https://api.losbeto.xyz/receipts · Catalog: https://api.losbeto.xyz/get-pricing
