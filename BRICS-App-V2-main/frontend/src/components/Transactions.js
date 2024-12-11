import React, { useState } from 'react';

function Transactions() {
  // Accounts data (each account has a name, associated currency, and balance)
  const [accounts, setAccounts] = useState([
    { id: 1, name: 'Dollin', currency: 'BRL', balance: 1000 },
    { id: 2, name: 'Wollice', currency: 'RUB', balance: 8000 },
    { id: 3, name: 'Shetana', currency: 'INR', balance: 15000 },
    { id: 4, name: 'Miben', currency: 'CNY', balance: 2000 },
    { id: 5, name: 'Milema', currency: 'ZAR', balance: 5000 },
  ]);

  // Initial transaction history (transactions that relate to accounts)
  const [transactionHistory, setTransactionHistory] = useState([
    { from: 'workUser', to: 'Dollin', amount: 500, type: 'transfer', currency: 'BRL', timestamp: new Date().toLocaleString() },
    { from: 'workUser', to: 'Shetana', amount: 1000, type: 'deposit', currency: 'RUB', timestamp: new Date().toLocaleString() },
    { from: 'workUser', to: 'Miben', amount: 200, type: 'transfer', currency: 'INR', timestamp: new Date().toLocaleString() },
  ]);

  // Transaction form state
  const [selectedAccount, setSelectedAccount] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [transactionCurrency, setTransactionCurrency] = useState('');
  const [transactionTo, setTransactionTo] = useState('');
  const [error, setError] = useState(null);
  const [isPasswordPopupVisible, setIsPasswordPopupVisible] = useState(false);
  const [employeePassword, setEmployeePassword] = useState('');
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);

  const correctPassword = 'StrongPassword123!'; // Hardcoded strong password

  const handleAddTransaction = () => {
    if (!selectedAccount || !transactionAmount || !transactionType || !transactionCurrency) {
      setError("Please fill in all fields");
      return;
    }

    const amount = parseFloat(transactionAmount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    // Show password pop-up for confirmation
    setIsPasswordPopupVisible(true);
  };

  const handlePasswordSubmit = () => {
    if (employeePassword === correctPassword) {
      setIsPasswordCorrect(true);
      processTransaction(); // Proceed with transaction if password is correct
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  const processTransaction = () => {
    const amount = parseFloat(transactionAmount);
    const updatedAccounts = [...accounts];
    const accountIndex = updatedAccounts.findIndex((account) => account.name === selectedAccount);

    if (transactionType === 'deposit') {
      updatedAccounts[accountIndex].balance += amount;
    } else if (transactionType === 'withdrawal') {
      if (updatedAccounts[accountIndex].balance >= amount) {
        updatedAccounts[accountIndex].balance -= amount;
      } else {
        setError("Insufficient funds for withdrawal.");
        return;
      }
    } else if (transactionType === 'transfer') {
      const transferToAccount = transactionTo;
      const targetAccountIndex = updatedAccounts.findIndex((account) => account.name === transferToAccount);

      if (targetAccountIndex === -1) {
        setError("Invalid target account.");
        return;
      }

      if (updatedAccounts[accountIndex].balance >= amount) {
        updatedAccounts[accountIndex].balance -= amount;
        updatedAccounts[targetAccountIndex].balance += amount;

        // Record the transfer between accounts
        const newTransaction = {
          from: selectedAccount,
          to: transactionTo,
          amount: amount,
          type: 'transfer',
          currency: transactionCurrency,
          timestamp: new Date().toLocaleString(),
        };

        // Add the new transaction at the top of the history (keep only the 3 latest transactions)
        setTransactionHistory(prevHistory => [newTransaction, ...prevHistory].slice(0, 3));
        setError(null);
      } else {
        setError("Insufficient funds for transfer.");
        return;
      }
    }

    // Create a non-transfer transaction
    if (transactionType !== 'transfer') {
      const newTransaction = {
        from: selectedAccount,
        amount: amount,
        type: transactionType,
        currency: transactionCurrency,
        timestamp: new Date().toLocaleString(),
      };

      // Add the new transaction at the top of the history (keep only the 3 latest transactions)
      setTransactionHistory(prevHistory => [newTransaction, ...prevHistory].slice(0, 3));
    }

    // Update the accounts
    setAccounts(updatedAccounts);
    setTransactionAmount('');
    setTransactionType('');
    setTransactionCurrency('');
    setTransactionTo('');
    setSelectedAccount('');
    setIsPasswordPopupVisible(false); // Close password popup after processing the transaction
  };

  return (
    <div className="transactions-container">
      <h2 className="form-title">Transactions</h2>
      {error && <div className="error-message">{error}</div>}

      <div className="transaction-form">
        <select
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          className="input-field"
          required
        >
          <option value="">Select Account</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.name}>
              {account.name} - {account.currency} ({account.balance})
            </option>
          ))}
        </select>
        <input
          type="number"
          value={transactionAmount}
          onChange={(e) => setTransactionAmount(e.target.value)}
          placeholder="Amount"
          className="input-field"
          required
        />
        <select
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value)}
          className="input-field"
          required
        >
          <option value="">Select Type</option>
          <option value="deposit">Deposit</option>
          <option value="withdrawal">Withdrawal</option>
          <option value="transfer">Transfer</option>
        </select>
        <select
          value={transactionCurrency}
          onChange={(e) => setTransactionCurrency(e.target.value)}
          className="input-field"
          required
        >
          <option value="">Select Currency</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.currency}>
              {account.currency}
            </option>
          ))}
        </select>
        {transactionType === 'transfer' && (
          <select
            value={transactionTo}
            onChange={(e) => setTransactionTo(e.target.value)}
            className="input-field"
            required
          >
            <option value="">Select Recipient Account</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.name}>
                {account.name} - {account.currency}
              </option>
            ))}
          </select>
        )}
        <button onClick={handleAddTransaction} className="auth-button">Add Transaction</button>
      </div>

      {isPasswordPopupVisible && (
        <div className="password-popup">
          <h3>Enter Employee Password to Confirm</h3>
          <input
            type="password"
            value={employeePassword}
            onChange={(e) => setEmployeePassword(e.target.value)}
            placeholder="Password"
            className="input-field"
            required
          />
          <button onClick={handlePasswordSubmit} className="auth-button">Confirm</button>
        </div>
      )}

      <div className="transaction-history">
        <h3>Transaction History</h3>
        {transactionHistory.length === 0 ? (
          <p>No transactions found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>From</th>
                <th>To</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Currency</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {transactionHistory.map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.from}</td>
                  <td>{transaction.to || 'N/A'}</td>
                  <td>{transaction.amount}</td>
                  <td>{transaction.type}</td>
                  <td>{transaction.currency}</td>
                  <td>{transaction.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Transactions;
