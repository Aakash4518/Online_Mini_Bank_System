/**
 * app.js
 * Application bootstrap, event wiring, demo seed data
 * Online Bank Mini System — Assignment 4
 */

// ── Initialise ─────────────────────────────────────────────────────────────

window.bankSystem = new BankSystem();

// Seed two demo accounts so the reviewer can immediately test transfers
(function seedDemoAccounts() {
    window.bankSystem.createAccount('Alice Johnson', 50000, true);    // KYC verified
    window.bankSystem.createAccount('Bob Smith', 15000, false);   // NOT KYC verified
    window.bankSystem.createAccount('Carol Davis', 30000, true);    // KYC verified
})();

// ── Helper: run after any operation ────────────────────────────────────────

function afterOperation() {
    UI.renderLog();
    UI.populateAccountDropdowns();
    UI.renderAccounts();         // keep counts live on accounts tab
}

// ── Event: Create Account ───────────────────────────────────────────────────

document.getElementById('form-create').addEventListener('submit', function (e) {
    e.preventDefault();
    UI.clearAlert('alert-create');

    const holderName = document.getElementById('create-name').value;
    const initialBal = document.getElementById('create-balance').value;
    const isKYCVerified = document.getElementById('create-kyc').checked;

    try {
        const acc = window.bankSystem.createAccount(holderName, initialBal, isKYCVerified);
        UI.showAlert('alert-create',
            `✅ Account created! Account No: <strong>${acc.accountNo}</strong> — Balance: ${UI.fmt(acc.balance)}.`,
            'success'
        );
        UI.toast(`Account ${acc.accountNo} created for ${acc.holderName}!`, 'success');
        this.reset();
        afterOperation();
    } catch (err) {
        UI.showAlert('alert-create', err.message, 'error');
        UI.toast(err.message, 'error');
    }
});

// ── Event: Deposit ──────────────────────────────────────────────────────────

document.getElementById('form-deposit').addEventListener('submit', function (e) {
    e.preventDefault();
    UI.clearAlert('alert-deposit');

    const accountNo = document.getElementById('deposit-account').value;
    const amount = document.getElementById('deposit-amount').value;

    try {
        const acc = window.bankSystem.deposit(accountNo, amount);
        UI.showAlert('alert-deposit',
            `₹${Number(amount).toLocaleString('en-IN')} deposited to <strong>${acc.holderName}</strong>. New balance: <strong>${UI.fmt(acc.balance)}</strong>.`,
            'success'
        );
        UI.toast(`Deposit successful! New balance: ${UI.fmt(acc.balance)}`, 'success');
        this.reset();
        afterOperation();
    } catch (err) {
        UI.showAlert('alert-deposit', err.message, 'error');
        UI.toast(err.message, 'error');
    }
});

// ── Event: Withdraw ─────────────────────────────────────────────────────────

document.getElementById('form-withdraw').addEventListener('submit', function (e) {
    e.preventDefault();
    UI.clearAlert('alert-withdraw');

    const accountNo = document.getElementById('withdraw-account').value;
    const amount = document.getElementById('withdraw-amount').value;

    try {
        const acc = window.bankSystem.withdraw(accountNo, amount);
        UI.showAlert('alert-withdraw',
            `₹${Number(amount).toLocaleString('en-IN')} withdrawn from <strong>${acc.holderName}</strong>. New balance: <strong>${UI.fmt(acc.balance)}</strong>.`,
            'success'
        );
        UI.toast(`Withdrawal successful! New balance: ${UI.fmt(acc.balance)}`, 'success');
        this.reset();
        afterOperation();
    } catch (err) {
        UI.showAlert('alert-withdraw', err.message, 'error');
        UI.toast(err.message, 'error');
    }
});

// ── Event: Transfer Money ────────────────────────────────────────────────────

document.getElementById('form-transfer').addEventListener('submit', function (e) {
    e.preventDefault();
    UI.clearAlert('alert-transfer');

    const senderNo = document.getElementById('transfer-sender').value;
    const receiverNo = document.getElementById('transfer-receiver').value;
    const amount = document.getElementById('transfer-amount').value;

    try {
        const { sender, receiver } = window.bankSystem.transferMoney(senderNo, receiverNo, amount);
        UI.showAlert('alert-transfer',
            `₹${Number(amount).toLocaleString('en-IN')} transferred from <strong>${sender.holderName}</strong> to <strong>${receiver.holderName}</strong>. ` +
            `Sender balance: <strong>${UI.fmt(sender.balance)}</strong> | Receiver balance: <strong>${UI.fmt(receiver.balance)}</strong>.`,
            'success'
        );
        UI.toast(`Transfer successful! ₹${Number(amount).toLocaleString('en-IN')} sent to ${receiver.holderName}.`, 'success');
        this.reset();
        afterOperation();
    } catch (err) {
        UI.showAlert('alert-transfer', err.message, 'error');
        UI.toast(err.message, 'error');
    }
});

// ── Event: Clear Log ─────────────────────────────────────────────────────────

document.getElementById('btn-clear-log').addEventListener('click', function () {
    window.bankSystem.transactionLog = [];
    UI.renderLog();
    UI.toast('Transaction log cleared.', 'info');
});

// ── Tab navigation ────────────────────────────────────────────────────────────

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => UI.showScreen(btn.dataset.tab));
});

// ── Bootstrap ─────────────────────────────────────────────────────────────────

UI.showScreen('create');   // default tab on load
afterOperation();
