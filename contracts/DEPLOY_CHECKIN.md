# Check-In Contract v2 — Deployment

## Проблема (старий контракт)

Старий контракт використовував 24-годинний cooldown: якщо check-in був о 9:00, наступний можливий тільки о 9:00 наступного дня. UI показував кнопку активною після 00:00 (локальний час), але транзакція падала до 9:00.

## Рішення (новий контракт)

Новий контракт використовує **UTC day boundary**: один check-in на UTC-день. Після 00:00 UTC (2:00 EET) check-in проходить відразу.

---

## Як задеплоїти на Remix

1. Відкрий [Remix](https://remix.ethereum.org)
2. Створи файл `BaseInvadersCheckIn.sol` (або скопіюй з `contracts/BaseInvadersCheckIn.sol`)
3. Compile: Solidity 0.8.20+, Compiler → Compile
4. Deploy:
   - Environment: **Injected Provider** (MetaMask / Warpcast wallet)
   - Network: **Base Mainnet**
   - Deploy `BaseInvadersCheckIn`
5. Після деплою скопіюй адресу нового контракту

---

## Оновити адресу в гри

У файлі `miniapp.js` заміни `CHECKIN_ADDR` на адресу нового контракту:

```javascript
const CHECKIN_ADDR = '0x...';  // <- встав свою нову адресу
```

---

## Технічна різниця

|                    | Старий (24h cooldown) | Новий (UTC day)      |
|--------------------|------------------------|----------------------|
| Перевірка          | `block.timestamp >= lastCheckIn + 24h` | `block.timestamp / 1 days > lastCheckInDay` |
| Час доступності    | Через 24 години        | Після 00:00 UTC      |
| Для EET (UTC+2)    | 9:00 → 9:00            | 00:00 UTC = 2:00 EET |

UI (кнопка, відлік) лишається на локальному часі — не чіпаємо.
