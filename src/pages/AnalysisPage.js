import React from "react";
import TransactionTracker from "../components/TransactionTracker";
import  "../App.css";

function AnalysisPage({ analysis, onUpdate, onBack }) {
  const handleAccountChange = (field, value) => {
    const updatedAnalysis = {
      ...analysis,
      [field]: value,
      name: `${field === 'accountId' ? value : analysis.accountId} - ${field === 'bankAccountName' ? value : analysis.bankAccountName}`
    };
    onUpdate(updatedAnalysis);
  };

  return (
    <div className="analysis-page">
      <button onClick={onBack}>Back to Home</button>

      <h2>{analysis.name}</h2>

      <div style={{ marginBottom: "20px" }}>
        <div>
          <label>Account ID:</label>
          <input
            value={analysis.accountId}
            onChange={(e) => handleAccountChange('accountId', e.target.value)}
          />
        </div>
        <div>
          <label>Client ID:</label>
          <input
            value={analysis.clientId}
            onChange={(e) => handleAccountChange('clientId', e.target.value)}
          />
        </div>
        <div>
          <label>Bank Account Name:</label>
          <input
            value={analysis.bankAccountName}
            onChange={(e) => handleAccountChange('bankAccountName', e.target.value)}
          />
        </div>
        <div>
          <label>Bank Account Number:</label>
          <input
            value={analysis.bankAccountNumber}
            onChange={(e) => handleAccountChange('bankAccountNumber', e.target.value)}
          />
        </div>
      </div>

      <TransactionTracker analysis={analysis} onUpdate={onUpdate} />
    </div>
  );
}

export default AnalysisPage;
