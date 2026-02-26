/**
 * bank.js
 * Core banking logic — BankAccount & BankSystem classes
 * Online Bank Mini System — Assignment 4
 */

// ─── BankAccount Model ───────────────────────────────────────────────────────

class BankAccount {
  /**
   * @param {string} accountNo    - Unique account identifier (auto-generated)
   * @param {string} holderName   - Full name of the account holder
   * @param {number} balance      - Initial balance (default 0)
   * @param {boolean} isKYCVerified - KYC verification status
   */
  constructor(accountNo, holderName, balance = 0, isKYCVerified = false) {
    this.accountNo    = accountNo;
    this.holderName   = holderName;
    this.balance      = balance;
    this.isKYCVerified = isKYCVerified;
    this.createdAt    = new Date();
  }

  /** Returns a plain object copy — safe for display / logging */
  toJSON() {
    return {
      accountNo:     this.accountNo,
      holderName:    this.holderName,
      balance:       this.balance,
      isKYCVerified: this.isKYCVerified,
      createdAt:     this.createdAt.toLocaleString(),
    };
  }
}

// ─── BankSystem ───────────────────────────────────────────────────────────────

class BankSystem {
  constructor() {
    /** @type {Map<string, BankAccount>} */
    this.accounts       = new Map();
    /** @type {Array<{timestamp, type, details, status}>} */
    this.transactionLog = [];
    this._counter       = 1000; // used for sequential account numbering
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  /** Generate a unique account number: ACC-XXXX */
  _generateAccountNo() {
    this._counter++;
    return `ACC-${this._counter}`;
  }

  /** Write an entry to the transaction log */
  _log(type, details, status = "SUCCESS") {
    this.transactionLog.unshift({
      id:        this.transactionLog.length + 1,
      timestamp: new Date().toLocaleString(),
      type,
      details,
      status,
    });
  }

  /** Look up an account; throws if not found */
  _requireAccount(accountNo) {
    const acc = this.accounts.get(accountNo.trim());
    if (!acc) throw new Error(`Account ${accountNo} not found.`);
    return acc;
  }

  // ── Core Operations ───────────────────────────────────────────────────────

  /**
   * Create a new bank account.
   * @param {string}  holderName
   * @param {number}  initialBalance  - Must be >= 0
   * @param {boolean} isKYCVerified
   * @returns {BankAccount} The newly created account
   */
  createAccount(holderName, initialBalance = 0, isKYCVerified = false) {
    holderName = holderName.trim();
    if (!holderName) throw new Error("Holder name cannot be empty.");
    if (isNaN(initialBalance) || initialBalance < 0)
      throw new Error("Initial balance must be a non-negative number.");

    const accountNo = this._generateAccountNo();
    const account   = new BankAccount(accountNo, holderName, Number(initialBalance), isKYCVerified);
    this.accounts.set(accountNo, account);

    this._log("CREATE_ACCOUNT", `Account ${accountNo} created for "${holderName}". Balance: ₹${initialBalance}. KYC: ${isKYCVerified ? "Verified" : "Not Verified"}.`);
    return account;
  }

  /**
   * Deposit money into an account.
   * @param {string} accountNo
   * @param {number} amount  - Must be > 0
   * @returns {BankAccount} Updated account
   */
  deposit(accountNo, amount) {
    amount = Number(amount);
    if (isNaN(amount) || amount <= 0)
      throw new Error("Deposit amount must be greater than zero.");

    const acc = this._requireAccount(accountNo);
    acc.balance += amount;

    this._log("DEPOSIT", `₹${amount} deposited to ${accountNo} (${acc.holderName}). New balance: ₹${acc.balance}.`);
    return acc;
  }

  /**
   * Withdraw money from an account.
   * @param {string} accountNo
   * @param {number} amount  - Must be > 0 and <= balance
   * @returns {BankAccount} Updated account
   */
  withdraw(accountNo, amount) {
    amount = Number(amount);
    if (isNaN(amount) || amount <= 0)
      throw new Error("Withdrawal amount must be greater than zero.");

    const acc = this._requireAccount(accountNo);
    if (amount > acc.balance)
      throw new Error(`Insufficient balance. Available: ₹${acc.balance}, Requested: ₹${amount}.`);

    acc.balance -= amount;
    this._log("WITHDRAWAL", `₹${amount} withdrawn from ${accountNo} (${acc.holderName}). New balance: ₹${acc.balance}.`);
    return acc;
  }

  /**
   * Transfer money between two accounts.
   * Validates KYC status of sender and sufficient balance.
   * @param {string} senderAccountNo
   * @param {string} receiverAccountNo
   * @param {number} amount
   * @returns {{ sender: BankAccount, receiver: BankAccount }}
   */
  transferMoney(senderAccountNo, receiverAccountNo, amount) {
    amount = Number(amount);
    if (isNaN(amount) || amount <= 0)
      throw new Error("Transfer amount must be greater than zero.");

    if (senderAccountNo.trim() === receiverAccountNo.trim())
      throw new Error("Sender and receiver accounts cannot be the same.");

    const sender   = this._requireAccount(senderAccountNo);
    const receiver = this._requireAccount(receiverAccountNo);

    // Validation 1 — KYC check
    if (!sender.isKYCVerified)
      throw new Error(`Transfer failed: Sender account ${senderAccountNo} (${sender.holderName}) is not KYC verified.`);

    // Validation 2 — Sufficient balance
    if (amount > sender.balance)
      throw new Error(`Transfer failed: Insufficient balance in ${senderAccountNo}. Available: ₹${sender.balance}, Requested: ₹${amount}.`);

    // Execute transfer
    sender.balance   -= amount;
    receiver.balance += amount;

    this._log(
      "TRANSFER",
      `₹${amount} transferred from ${senderAccountNo} (${sender.holderName}) to ${receiverAccountNo} (${receiver.holderName}). ` +
      `Sender balance: ₹${sender.balance}. Receiver balance: ₹${receiver.balance}.`
    );

    return { sender, receiver };
  }

  // ── Read Operations ───────────────────────────────────────────────────────

  /** @returns {BankAccount|undefined} */
  getAccount(accountNo) {
    return this.accounts.get(accountNo.trim());
  }

  /** @returns {BankAccount[]} */
  getAllAccounts() {
    return Array.from(this.accounts.values());
  }

  /** @returns {Array} Transaction log (most recent first) */
  getTransactionLog() {
    return this.transactionLog;
  }
}
