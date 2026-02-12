# Leaderboard contract (on-chain)

The global leaderboard is stored on **Base** at:

- **Address:** `0xAC89DA9d8508d0865c55083552da91894537aC89`
- **Creator:** penzlik.base.eth (see [BaseScan](https://basescan.org/address/0xAC89DA9d8508d0865c55083552da91894537aC89))

## Why new entries may not appear after ~9 Feb

The contract is **not verified** on BaseScan. From the bytecode:

- There is a constant **0x64 (100)** in the contract, which strongly suggests a **top-100 (or similar) limit**.
- When the leaderboard is full, new submissions either:
  - **Revert** (tx fails), or
  - Succeed but **do not add** a new row (only replace if the new score is in the top N).

So: **the app sends the transaction correctly and it can be signed; the limitation is in the contract logic**, not in the frontend.

## What was changed in the app

1. **miniapp.js**
   - We wait for **transaction confirmation** before showing “Success”. If the tx reverts (e.g. “leaderboard full” or “score too low”), the user now sees an error instead of a false success.
   - Revert message was clarified: *"Transaction reverted. Leaderboard may be full (top 100 only) or score too low."*
   - Comment added that the contract may keep only top N entries.

2. **UI (game.js + locales)**
   - After a successful submit we show: *"Submitted! If you don't see your score, the leaderboard may only show top 100."*
   - Same idea is reflected in EN / HI / UK locales.

## How to fix it for good

You need to change the **contract** (or deploy a new one):

1. **If you have the source code**
   - Increase the maximum number of entries (e.g. from 100 to 500), or
   - Change logic so that when the table is full, a new score **replaces the lowest** in the list instead of reverting/doing nothing.
   - Redeploy and update `LEADERBOARD_ADDR` in `miniapp.js` if you deploy a new contract.

2. **If you don’t have the source**
   - Ask the deployer (penzlik.base.eth) for the contract source or for an upgraded contract with a higher limit / replace-lowest logic.
   - BaseScan shows the contract was created recently (~9 days before the last check); the deployer may still have the code.

3. **Verify the contract on BaseScan**
   - After any change, verify and publish the source on BaseScan so the logic (and limit) is clear.

The frontend (ABI, address, parameters, and submit flow) matches the contract interface used until 9 Feb; the behaviour change is due to the on-chain leaderboard limit, not the app code.
