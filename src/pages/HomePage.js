import React from "react";

function HomePage({ analyses, onStartNew, onOpen, onDelete }) {
  return (
    <div className="home-page">
      <button onClick={onStartNew}>Start New Analysis</button>

      <h3>Existing Analyses</h3>
      {analyses.length === 0 && <p>No analyses yet.</p>}
      <ul>
        {analyses.map(a => (
          <li key={a.id}>
            {a.name} &nbsp;
            <button onClick={() => onOpen(a)}>Open</button>
            <button onClick={() => onDelete(a.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;
