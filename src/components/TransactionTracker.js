import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { exportToExcel } from "../utils/excelExport";
import './TransactionTracker.css';

function TransactionTracker() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [debit, setDebit] = useState("");
  const [credit, setCredit] = useState("");
  const [transactions, setTransactions] = useState([]);

  const handleAddTransaction = () => {
    if (!description) return;

    const newTransaction = {
      date: selectedDate,
      description: description,
      debit: parseFloat(debit ? parseFloat(debit).toFixed(2) : 0),
      credit: parseFloat(credit ? parseFloat(credit).toFixed(2) : 0)
    };

    setTransactions([...transactions, newTransaction].sort((a, b) => new Date(a.date) - new Date(b.date)));
    setDescription("");
    setDebit("");
    setCredit("");
  };

  const handleDeleteTransaction = (index) => {
    setTransactions(prev =>
      prev.filter((_, i) => i !== index) // keep all except the one at "index"
    );
  };


  const totalDebit = transactions.reduce((sum, tx) => sum + tx.debit, 0);
  const totalCredit = transactions.reduce((sum, tx) => sum + tx.credit, 0);
  const net = totalCredit - totalDebit;

  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <div title="Click to Export" className="export-btn-container"><button className="export-btn" onClick={() => exportToExcel(transactions)}>
      </button></div>
      <h2>Debt Coverage Analysis</h2>

      <div>
        <label className="TransactionTracker-label">Date: </label>
        <DatePicker selected={selectedDate} onChange={setSelectedDate} dateFormat="dd/MM/yyyy" />
      </div>

      <div>
        <label className="TransactionTracker-label">Description: </label>
        <input value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div>
        <label className="TransactionTracker-label">Debit: </label>
        <input type="number" value={debit} onChange={(e) => setDebit(e.target.value)} />
      </div>

      <div>
        <label className="TransactionTracker-label">Credit: </label>
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
        <strong>Total Debit:</strong> {totalDebit} &nbsp;
        <strong>Total Credit:</strong> {totalCredit} &nbsp;
        <strong>Net:</strong> {net}
      </div>
    </div>
  );
}

export default TransactionTracker;
