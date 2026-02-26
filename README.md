# 🏦 Online Bank Mini System

A fully functional web-based banking application built with **vanilla HTML, CSS, and JavaScript**.  
Assignment 4 — Round 2 submission.

---

## 🌐 Live Demo

> (https://online-mini-bank-system.netlify.app/)

---

## ✨ Features

| Feature | Description |
|---|---|
| **Create Account** | Register a new account with holder name, initial deposit, and KYC status |
| **Deposit Money** | Add funds to any existing account |
| **Withdraw Money** | Withdraw funds with balance validation |
| **Transfer Money** | Secure peer-to-peer transfer with KYC & balance checks |
| **All Accounts** | Live list of all accounts with stats panel |
| **Transaction Log** | Real-time output panel showing every operation |

---

## 🗂️ Data Model

| Field | Type | Description |
|---|---|---|
| `accountNo` | `string` | Unique auto-generated ID (e.g. `ACC-1001`) |
| `holderName` | `string` | Full name of the account holder |
| `balance` | `number` | Current account balance |
| `isKYCVerified` | `boolean` | KYC verification status — required for transfers |

---

## 🚦 Transfer Validations

```
TransferMoney(senderAccount, receiverAccount, amount)
```

1. ✅ **Sender must be KYC Verified** — else: `"Sender is not KYC verified"`  
2. ✅ **Sender must have sufficient balance** — else: `"Insufficient balance"`  
3. ✅ **Amount must be > 0** — else: `"Amount must be greater than zero"`  
4. ✅ **Sender ≠ Receiver** — else: `"Sender and receiver cannot be the same"`

---

## 🗃️ Project Structure

```
Online Bank Mini System/
├── index.html          # Single-page app — all UI screens
├── css/
│   └── styles.css      # Premium dark glassmorphism theme
├── js/
│   ├── bank.js         # BankAccount + BankSystem classes (core logic)
│   ├── ui.js           # DOM rendering, toast notifications, screen switching
│   └── app.js          # App init, demo seed accounts, event wiring
└── README.md
```

---

## 🚀 How to Run Locally

1. Clone or download the repository
2. Open `index.html` directly in any modern browser  
   *(No build step or server required)*

---

## 🧪 Demo Accounts (pre-loaded)

| Account No | Name | Balance | KYC |
|---|---|---|---|
| ACC-1001 | Alice Johnson | ₹50,000 | ✅ Verified |
| ACC-1002 | Bob Smith | ₹15,000 | ❌ Not Verified |
| ACC-1003 | Carol Davis | ₹30,000 | ✅ Verified |

Use these to test transfer scenarios immediately on load.

---

## 📋 Evaluation Criteria Addressed

| Area | Implementation |
|---|---|
| **Functionality** | All 4 operations implemented and working |
| **Logic** | Correct KYC + balance validation in `transferMoney()` |
| **UI** | 5 screens + live transaction log panel |
| **Code Quality** | Modular: `bank.js` (logic) · `ui.js` (rendering) · `app.js` (wiring) |
| **Error Handling** | Inline alerts + toast notifications for all invalid inputs |

---

## 🛠️ Tech Stack

- **HTML5** — Semantic structure, ARIA labels
- **CSS3** — Glassmorphism dark theme, CSS variables, animations
- **Vanilla JavaScript ES6+** — Classes, Map, arrow functions, modules pattern
