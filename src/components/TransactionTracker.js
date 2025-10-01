import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { exportToExcel } from "../utils/excelExport";
import './TransactionTracker.css';

function TransactionTracker({ analysis, onUpdate }) {
  const [transactions, setTransactions] = useState(analysis.transactions || []);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [debit, setDebit] = useState("");
  const [credit, setCredit] = useState("");

  const handleAddTransaction = () => {
    if (!description) return;

    const newTransaction = {
      date: new Date(selectedDate),
      description,
      debit: Number(parseFloat(debit).toFixed(2)) || 0,
      credit: Number(parseFloat(credit).toFixed(2)) || 0,
    };

    const updatedTransactions = [...transactions, newTransaction].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    setTransactions(updatedTransactions);
    onUpdate({ ...analysis, transactions: updatedTransactions });

    setDescription("");
    setDebit("");
    setCredit("");
  };

  const handleDeleteTransaction = (index) => {
    const updatedTransactions = transactions.filter((_, i) => i !== index);
    setTransactions(updatedTransactions);
    onUpdate({ ...analysis, transactions: updatedTransactions });
  };

  const totalDebit = transactions.reduce((sum, tx) => sum + tx.debit, 0);
  const totalCredit = transactions.reduce((sum, tx) => sum + tx.credit, 0);
  const net = totalCredit - totalDebit;

  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <div title="Click to Export" className="export-btn-container">
        <button className="export-btn" onClick={() => exportToExcel(transactions)}>Export</button>
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
        <label>Debit: </label>
        <input type="number" value={debit} onChange={(e) => setDebit(e.target.value)} />
      </div>

      <div>
        <label>Credit: </label>
        <input type="number" value={credit} onChange={(e) => setCredit(e.target.value)} />
      </div>

      <button onClick={handleAddTransaction}>Add Transaction</button>

      <h3>Transactions</h3>
      <table border="1" cellPadding="5" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Debit</th>
            <th>Credit</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, idx) => (
            <tr key={idx}>
              <td>{tx.date.toLocaleDateString()}</td>
              <td>{tx.description}</td>
              <td>{tx.debit.toFixed(2)}</td>
              <td>{tx.credit.toFixed(2)}</td>
              <td>
                <button onClick={() => handleDeleteTransaction(idx)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <strong>Total Debit:</strong> {totalDebit.toFixed(2)} &nbsp;
        <strong>Total Credit:</strong> {totalCredit.toFixed(2)} &nbsp;
        <strong>Net:</strong> {net.toFixed(2)}
      </div>
    </div>
  );
}

export default TransactionTracker;
