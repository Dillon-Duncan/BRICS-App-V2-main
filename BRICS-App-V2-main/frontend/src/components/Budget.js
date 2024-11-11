import React, { useState } from 'react';

function Budget() {
  // Initial data: represent the user's budgets with BRICS currencies and amounts
  const [budgets, setBudgets] = useState([
    { id: 1, currency: 'BRL', amount: 1000 },
    { id: 2, currency: 'RUB', amount: 8000 },
    { id: 3, currency: 'INR', amount: 15000 },
    { id: 4, currency: 'CNY', amount: 2000 },
    { id: 5, currency: 'ZAR', amount: 5000 },
  ]);

  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [addAmount, setAddAmount] = useState('');

  const handleAddAmount = () => {
    if (!addAmount || isNaN(addAmount) || addAmount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    const updatedBudgets = budgets.map((budget) => {
      if (budget.currency === selectedCurrency) {
        return { ...budget, amount: budget.amount + parseFloat(addAmount) };
      }
      return budget;
    });

    setBudgets(updatedBudgets);
    setAddAmount(''); // Clear the input field after update
  };

  return (
    <div className="budget-container">
      <h2 className="form-title">Manage Your Budgets</h2>

      {/* Display all user budgets (BRICS currencies) */}
      <div className="budget-list">
        <h3>Current Budgets:</h3>
        <div className="budget-grid">
          {budgets.map((budget) => (
            <div key={budget.id} className="budget-item">
              <h4>{budget.currency}</h4>
              <p>Amount: {budget.amount.toLocaleString()}</p>
              <button
                onClick={() => setSelectedCurrency(budget.currency)}
                className="auth-button"
              >
                Add Funds
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Display input to add funds to the selected budget */}
      {selectedCurrency && (
        <div className="budget-update">
          <h4>Add Funds to {selectedCurrency}</h4>
          <input
            type="number"
            value={addAmount}
            onChange={(e) => setAddAmount(e.target.value)}
            placeholder="Enter amount to add"
            className="input-field"
          />
          <button onClick={handleAddAmount} className="auth-button">
            Add Amount
          </button>
        </div>
      )}
    </div>
  );
}

export default Budget;
