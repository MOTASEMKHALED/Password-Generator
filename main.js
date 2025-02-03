let passwordHistory = JSON.parse(localStorage.getItem('passwordHistory')) || [];
let currentPassword = '';

function updateHistoryDisplay() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';

    passwordHistory.forEach((item, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div>
                <div class="history-password">${item.password}</div>
                <div class="timestamp">${item.timestamp}</div>
            </div>
            <div class="history-actions">
                <button class="copy-btn" onclick="copyPassword(${index})">
                    <i class="fas fa-copy"></i> Copy
                </button>
                <button class="delete-btn" onclick="deletePassword(${index})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        historyList.appendChild(historyItem);
    });

    localStorage.setItem('passwordHistory', JSON.stringify(passwordHistory));
}

function generatePassword() {
    const length = document.getElementById('length').value;
    const uppercase = document.getElementById('uppercase').checked;
    const lowercase = document.getElementById('lowercase').checked;
    const numbers = document.getElementById('numbers').checked;
    const symbols = document.getElementById('symbols').checked;

    let chars = '';
    if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers) chars += '0123456789';
    if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (chars === '') {
        alert('Please select at least one option');
        return;
    }

    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
    }

    currentPassword = password;
    document.getElementById('passwordDisplay').innerHTML = `
        ${password}
        <i class="fas fa-copy copy-icon" onclick="copyCurrentPassword()"></i>
    `;

    const now = new Date();
    passwordHistory.unshift({
        password: password,
        timestamp: now.toLocaleString()
    });

    if (passwordHistory.length > 10) {
        passwordHistory = passwordHistory.slice(0, 10);
    }

    updateHistoryDisplay();
}

function copyCurrentPassword() {
    if (currentPassword) {
        navigator.clipboard.writeText(currentPassword).then(() => {
            alert('Current password copied!');
        });
    }
}

function copyPassword(index) {
    const password = passwordHistory[index].password;
    navigator.clipboard.writeText(password).then(() => {
        alert('Password copied!');
    });
}

function deletePassword(index) {
    passwordHistory.splice(index, 1);
    updateHistoryDisplay();
}

function clearHistory() {
    if (confirm('Are you sure you want to clear all history?')) {
        passwordHistory = [];
        updateHistoryDisplay();
    }
}

// Initialize history display when page loads
updateHistoryDisplay();