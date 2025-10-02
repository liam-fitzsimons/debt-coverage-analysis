import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { exportToExcel } from "../utils/excelExport";
import './TransactionTracker.css';

function TransactionTracker({ analysis, onUpdate }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Income");
  const [amount, setAmount] = useState("");

  const handleAddTransaction = () => {
    if (!description || !category || !amount) return;

    const newTransaction = {
      date: new Date(selectedDate),
      description,
      category,
      amount: Number(parseFloat(amount).toFixed(2)) || 0,
    };

    const updatedTransactions = [...(analysis.transactions || []), newTransaction].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    // Update parent directly
    onUpdate({ ...analysis, transactions: updatedTransactions });

    setDescription("");
    setCategory("Income");
    setAmount("");
  };

  const handleDeleteTransaction = (index) => {
    const updatedTransactions = (analysis.transactions || []).filter((_, i) => i !== index);
    onUpdate({ ...analysis, transactions: updatedTransactions });
  };

  const totalIncome = (analysis.transactions || [])
    .filter(tx => tx.category === "Income")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const totalExpense = (analysis.transactions || [])
    .filter(tx => tx.category !== "Income")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const net = totalIncome - totalExpense;

  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <div title="Click to Export" className="export-btn-container">
        <button className="export-btn" onClick={() => exportToExcel(analysis.transactions)}>Export</button>
      </div>

      <div>
        <label>Date: </label> 
        <DatePicker selected={selectedDate} onChange={setSelectedDate} dateFormat="dd/MM/yyyy" />
      </div>

      <div>
        <label>Description: </label>
        <input value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div>
        <label>Category: </label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Income">Income</option>
          <option value="Finco/Bank Payment">Finco/Bank Payment</option>
          <option value="Red Flag">Red Flag</option>
        </select>
      </div>

      <div>
        <label>Amount: </label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>

      <button onClick={handleAddTransaction}>Add Transaction</button>

      <h3>Transactions</h3>
      <table border="1" cellPadding="5" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(analysis.transactions || []).map((tx, idx) => (
            <tr key={idx}>
              <td>{new Date(tx.date).toLocaleDateString()}</td>
              <td>{tx.description}</td>
              <td>{tx.category}</td>
              <td>{tx.amount.toFixed(2)}</td>
              <td>
                <button onClick={() => handleDeleteTransaction(idx)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <strong>Total Income:</strong> {totalIncome.toFixed(2)} &nbsp;
        <strong>Total Expenses:</strong> {totalExpense.toFixed(2)} &nbsp;
        <strong>Net:</strong> {net.toFixed(2)}
      </div>
    </div>
  );
}

export default TransactionTracker;
