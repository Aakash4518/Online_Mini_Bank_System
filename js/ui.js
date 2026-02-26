/**
 * ui.js
 * UI rendering, screen management, toast notifications
 * Online Bank Mini System — Assignment 4
 */

const UI = (() => {
    // ── Internal helpers ───────────────────────────────────────────────────────

    /** Get first letter(s) of a name for avatar */
    function _initials(name) {
        return name.trim().split(' ')
            .map(w => w[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    }

    /** Format currency */
    function _fmt(amount) {
        return `₹${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    }

    // ── Tab / Screen Navigation ────────────────────────────────────────────────

    function showScreen(tabId) {
        // Deactivate all tabs
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.screen').forEach(s => s.classList.add('section-hidden'));

        // Activate selected tab
        const btn = document.querySelector(`[data-tab="${tabId}"]`);
        const screen = document.getElementById(`screen-${tabId}`);
        if (btn) btn.classList.add('active');
        if (screen) screen.classList.remove('section-hidden');

        // If switching to accounts tab, refresh the list
        if (tabId === 'accounts') renderAccounts();
    }

    // ── Toast Notifications ────────────────────────────────────────────────────

    function toast(message, type = 'info') {
        const icons = { success: '✅', error: '❌', info: 'ℹ️' };
        const container = document.getElementById('toast-container');

        const el = document.createElement('div');
        el.className = `toast ${type}`;
        el.innerHTML = `
      <span class="toast-icon">${icons[type]}</span>
      <span class="toast-msg">${message}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
    `;
        container.prepend(el);

        // Auto-dismiss after 4s
        setTimeout(() => {
            el.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => el.remove(), 300);
        }, 4000);
    }

    // ── Inline form alert ──────────────────────────────────────────────────────

    function showAlert(elementId, message, type) {
        const el = document.getElementById(elementId);
        if (!el) return;
        el.className = `form-alert ${type} show`;
        el.innerHTML = `<span>${type === 'success' ? '✅' : '❌'}</span><span>${message}</span>`;
    }

    function clearAlert(elementId) {
        const el = document.getElementById(elementId);
        if (el) { el.className = 'form-alert'; el.innerHTML = ''; }
    }

    // ── Account Listing ────────────────────────────────────────────────────────

    function renderAccounts() {
        const accounts = window.bankSystem.getAllAccounts();
        const grid = document.getElementById('accounts-grid');
        const totalEl = document.getElementById('stat-total-accounts');
        const kycEl = document.getElementById('stat-kyc-accounts');
        const balEl = document.getElementById('stat-total-balance');

        // Update stats
        const totalBal = accounts.reduce((s, a) => s + a.balance, 0);
        const kycCount = accounts.filter(a => a.isKYCVerified).length;
        if (totalEl) totalEl.textContent = accounts.length;
        if (kycEl) kycEl.textContent = kycCount;
        if (balEl) balEl.textContent = _fmt(totalBal);

        if (!accounts.length) {
            grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <div class="empty-icon">🏦</div>
          <h3>No accounts yet</h3>
          <p>Create your first account to get started.</p>
        </div>`;
            return;
        }

        grid.innerHTML = accounts.map(acc => `
      <div class="account-card">
        <div class="account-card-header">
          <div class="account-avatar">${_initials(acc.holderName)}</div>
          <span class="kyc-badge ${acc.isKYCVerified ? 'verified' : 'unverified'}">
            ${acc.isKYCVerified ? '✓ KYC Verified' : '✗ Not Verified'}
          </span>
        </div>
        <div class="account-name">${acc.holderName}</div>
        <div class="account-no">${acc.accountNo}</div>
        <div class="account-balance-label" style="margin-top:0.75rem">Current Balance</div>
        <div class="account-balance">${_fmt(acc.balance)}</div>
      </div>
    `).join('');
    }

    // ── Transaction Log ────────────────────────────────────────────────────────

    function renderLog() {
        const entries = window.bankSystem.getTransactionLog();
        const list = document.getElementById('log-entries');
        const countEl = document.getElementById('log-count');

        if (countEl) countEl.textContent = entries.length;

        if (!entries.length) {
            list.innerHTML = `<div class="log-empty">📋 No transactions yet</div>`;
            return;
        }

        const typeMap = {
            'CREATE_ACCOUNT': 'CREATE',
            'DEPOSIT': 'DEPOSIT',
            'WITHDRAWAL': 'WITHDRAW',
            'TRANSFER': 'TRANSFER',
            'ERROR': 'ERROR',
        };

        list.innerHTML = entries.map(e => `
      <div class="log-entry">
        <div class="log-entry-header">
          <span class="log-type-badge ${typeMap[e.type] || e.type}">${e.type.replace('_', ' ')}</span>
          <span class="log-time">${e.timestamp}</span>
        </div>
        <div class="log-details">${e.details}</div>
        <div class="log-status ${e.status === 'SUCCESS' ? 'ok' : 'er'}">${e.status}</div>
      </div>
    `).join('');
    }

    // ── Populate account dropdowns ─────────────────────────────────────────────

    function populateAccountDropdowns() {
        const accounts = window.bankSystem.getAllAccounts();
        const verifiedAccounts = accounts.filter(a => a.isKYCVerified);

        // Deposit & Withdraw: all accounts
        ['deposit-account', 'withdraw-account'].forEach(id => {
            const sel = document.getElementById(id);
            if (!sel) return;
            const prev = sel.value;
            sel.innerHTML = `<option value="">— Select Account —</option>` +
                accounts.map(a =>
                    `<option value="${a.accountNo}">${a.accountNo} — ${a.holderName}</option>`
                ).join('');
            if (prev) sel.value = prev;
        });

        // Transfer Sender: only KYC-verified accounts
        const senderSel = document.getElementById('transfer-sender');
        if (senderSel) {
            const prev = senderSel.value;
            if (verifiedAccounts.length === 0) {
                senderSel.innerHTML = `<option value="">— No KYC-Verified Accounts —</option>`;
            } else {
                senderSel.innerHTML = `<option value="">— Select Sender (KYC Verified) —</option>` +
                    verifiedAccounts.map(a =>
                        `<option value="${a.accountNo}">${a.accountNo} — ${a.holderName} ✓</option>`
                    ).join('');
            }
            if (prev) senderSel.value = prev;
        }

        // Transfer Receiver: all accounts
        const receiverSel = document.getElementById('transfer-receiver');
        if (receiverSel) {
            const prev = receiverSel.value;
            receiverSel.innerHTML = `<option value="">— Select Receiver —</option>` +
                accounts.map(a =>
                    `<option value="${a.accountNo}">${a.accountNo} — ${a.holderName}</option>`
                ).join('');
            if (prev) receiverSel.value = prev;
        }
    }

    // Expose public API
    return {
        showScreen,
        toast,
        showAlert,
        clearAlert,
        renderAccounts,
        renderLog,
        populateAccountDropdowns,
        fmt: _fmt,
    };
})();
