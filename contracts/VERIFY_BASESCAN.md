# Верифікація контракту Leaderboard на BaseScan

Адреса контракту: **0xAC89DA9d8508d0865c55083552da91894537aC89**

## Кроки

1. Відкрий: https://basescan.org/address/0xAC89DA9d8508d0865c55083552da91894537aC89#code  
2. Натисни **"Verify and Publish"** (або "Verify & Publish Contract Source Code").  
3. Обери:
   - **Compiler Type:** Solidity (Single file)  
   - **Compiler Version:** **v0.8.20+commit.a1b79de6** (або v0.8.24, v0.8.23 — головне ^0.8.20).  
   - **Open Source License Type:** MIT  

4. Встав код з файлу **`contracts/BaseInvadersLeaderboardV2.sol`** у поле "Enter the Solidity Contract Code below".  
5. Натисни **"Continue"** / **"Verify and Publish"**.

### Якщо просить Optimization

- **Optimization:** спочатку спробуй **No**.  
- Якщо верифікація не пройде — спробуй **Yes**, Runs: **200**.

### Якщо просить Contract Name

- **Contract Name:** `BaseInvadersLeaderboardV2` (має збігатися з іменем контракту в коді).

Після успішної верифікації на BaseScan з’явиться вкладка "Contract" з читабельним кодом і можливістю виклику Read/Write функцій.
