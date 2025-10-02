import React, { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import AnalysisPage from "./pages/AnalysisPage";
import "./App.css"

const initialAnalyses = JSON.parse(localStorage.getItem("analyses")) || [];

function App() {
  const [analyses, setAnalyses] = useState(initialAnalyses);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [showNewAnalysisForm, setShowNewAnalysisForm] = useState(false);
  const [newAnalysisData, setNewAnalysisData] = useState({
    accountId: "",
    clientId: "",
    bankAccountName: "",
    bankAccountNumber: "",
  });

  // Persist analyses to localStorage
  useEffect(() => {
    localStorage.setItem("analyses", JSON.stringify(analyses));
  }, [analyses]);

  // Show form to create a new analysis
  const handleStartNewAnalysis = () => {
    setNewAnalysisData({
      accountId: "",
      clientId: "",
      bankAccountName: "",
      bankAccountNumber: "",
    });
    setShowNewAnalysisForm(true);
  };

  // Confirm creation of new analysis
  const handleConfirmNewAnalysis = () => {
    const { accountId, bankAccountName } = newAnalysisData;
    if (!accountId || !bankAccountName) {
      alert("Please fill in account ID and bank account name");
      return;
    }

    const newAnalysis = {
      id: Date.now(),
      name: `${accountId} - ${bankAccountName}`,
      transactions: [],
      ...newAnalysisData,
    };

    setAnalyses(prev => [...prev, newAnalysis]);
    setCurrentAnalysis(newAnalysis);
    setShowNewAnalysisForm(false);
  };

  // Open existing analysis
  const handleOpenAnalysis = (analysis) => {
    const convertedAnalysis = {
      ...analysis,
      transactions: (analysis.transactions || []).map(tx => ({
        ...tx,
        date: new Date(tx.date)
      }))
    };
    setCurrentAnalysis(convertedAnalysis);
  };

  // Update an analysis (transactions or account info)
  const handleUpdateAnalysis = (updatedAnalysis) => {
    setAnalyses(prev =>
      prev.map(a => (a.id === updatedAnalysis.id ? updatedAnalysis : a))
    );
    setCurrentAnalysis(updatedAnalysis);
  };

  // Delete an analysis
  const handleDeleteAnalysis = (id) => {
    if (window.confirm("Are you sure you want to delete this analysis?")) {
      setAnalyses(prev => prev.filter(a => a.id !== id));
      if (currentAnalysis && currentAnalysis.id === id) {
        setCurrentAnalysis(null);
      }
    }
  };

  const handleBackToHome = () => setCurrentAnalysis(null);

  return (
    <div className="App">
      {currentAnalysis ? (
        <AnalysisPage
          analysis={currentAnalysis}
          onUpdate={handleUpdateAnalysis}
          onBack={handleBackToHome}
        />
      ) : showNewAnalysisForm ? (
        <div className="new-analysis-form" style={{ padding: "20px", border: "1px solid gray", marginBottom: "20px" }}>
          <h3>Enter New Analysis Details</h3>
          <div>
            <label>Account ID: </label>
            <input
              value={newAnalysisData.accountId}
              onChange={(e) => setNewAnalysisData({ ...newAnalysisData, accountId: e.target.value })}
            />
          </div>
          <div>
            <label>Client ID: </label>
            <input
              value={newAnalysisData.clientId}
              onChange={(e) => setNewAnalysisData({ ...newAnalysisData, clientId: e.target.value })}
            />
          </div>
          <div>
            <label>Bank Account Name: </label>
            <input
              value={newAnalysisData.bankAccountName}
              onChange={(e) => setNewAnalysisData({ ...newAnalysisData, bankAccountName: e.target.value })}
            />
          </div>
          <div>
            <label>Bank Account Number: </label>
            <input
              value={newAnalysisData.bankAccountNumber}
              onChange={(e) => setNewAnalysisData({ ...newAnalysisData, bankAccountNumber: e.target.value })}
            />
          </div>
          <button onClick={handleConfirmNewAnalysis}>Create Analysis</button>
          <button onClick={() => setShowNewAnalysisForm(false)}>Cancel</button>
        </div>
      ) : (
        <HomePage
          analyses={analyses}
          onStartNew={handleStartNewAnalysis}
          onOpen={handleOpenAnalysis}
          onDelete={handleDeleteAnalysis}
        />
      )}
    </div>
  );
}

export default App;
