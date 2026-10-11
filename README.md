# losbeto-mcp

Losbeto x402 market intelligence as native tools in Claude Desktop, Claude Code, or Cursor. Base chain reads with ML on top, ERC-8004 agent reputation, Brazil central-bank macro, multi-oracle price consensus, launch risk, forex, commodities and crypto — plus an OpenAI-compatible LLM gateway. No signup. No API key. Paid tools settle automatically in USDC via x402 — **on Base, Solana, Algorand or Polygon**.

Registered ERC-8004 agent: [agentId 87048 on Base](https://8004scan.io/agents/base/87048).

## Recommended: remote server (no install)

```json
{
  "mcpServers": {
    "losbeto": { "url": "https://api.losbeto.xyz/mcp" }
  }
}
```

The remote server exposes **5 meta-tools** that cover the whole 117-endpoint catalog:

- `search_market_data` — FREE. Describe what you need in plain language; get matching endpoints with price and parameters
- `get_market_data` — fetch any endpoint (delayed sample FREE; live data at the endpoint's x402 price, from $0.001)
- `market_snapshot` — one call for a whole area: `brazil`, `global` or `crypto`
- `list_categories` — FREE. Every category, endpoint count, cheapest price
- `account_status` — FREE. Subscription/credit status for this connection

Without a key, free tools work and every paid tool returns a **real but delayed sample at no cost** — enough to judge the data before paying. For live data, add a credit key:

```json
{
  "mcpServers": {
    "losbeto": {
      "url": "https://api.losbeto.xyz/mcp",
      "headers": { "Authorization": "Bearer <credit-key>" }
    }
  }
}
```

Get a credit key with **one on-chain payment — Base, Solana, Algorand or Polygon, your choice**: `POST https://api.losbeto.xyz/buy-credits` (plans from $0.99 with bonus balance; machine-readable at `GET /plans`).

Chain intelligence + agent-native endpoints (all reachable through the meta-tools above):

| Endpoint | Price | What you get |
|---|---|---|
| `/chain-block` | $0.001 | Latest Base block: number, age, gas-used %, base fee |
| `/gas-price` | $0.001 | Gas now + ML forecast ~10 min ahead (self-fed Holt smoothing) with send/wait recommendation |
| `/chain-balance` | $0.002 | ETH + ERC-20 balances, nonce, wallet-class heuristic |
| `/chain-ens` | $0.002 | ENS forward and reverse resolution |
| `/chain-tx` | $0.002 | Tx status/value/fee/logs, optional LLM explanation (`explain=1`) |
| `/agent-reputation` | $0.010 | On-chain ERC-8004 identity + aggregated reputation for any registered agent |
| `/wallet-verdict` | $0.020 | Graded wallet verdict + LLM roast, idempotent, with shareable SVG card |
| `/x402-watch` | $0.050 | Watch any third-party x402 endpoint for 30 days — price/availability changes pushed to your webhook |

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

`LOSBETO_PRIVATE_KEY` = an EVM private key holding a little USDC on Base (optional — free tools work without it). For Solana, Algorand or Polygon payments, use the remote server with a credit key instead.

The npm package exposes the **classic 9-tool set**:

FREE: `try_samples` (6 live samples in 1 call) · `welcome_free_call` (one real-time call, no wallet) · `launch_risk_preview` · `receipts` (audit our on-chain sales, honestly labeled)

PAID via x402: `launch_risk_brief` · `br_macro` (BCB data) · `oracle_consensus` · `fear_greed` · `sol_price` — the exact current price always comes in the tool's own 402 challenge before you pay (typically $0.01–0.10).

For the full catalog (including the chain reads, ERC-8004 reputation and `/x402-watch`), use the remote server — the npm package is the classic fixed tool set.

## Transparency

- Receipts: https://api.losbeto.xyz/receipts
- Live funnel: https://api.losbeto.xyz/funnel.json
- Catalog: https://api.losbeto.xyz/get-pricing
- On-chain identity: https://8004scan.io/agents/base/87048
