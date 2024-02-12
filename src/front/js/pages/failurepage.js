import React from 'react';
import { useLocation } from 'react-router-dom';

const FailurePage = () => {
  const location = useLocation();
  const { message } = location.state || {}; // Assuming a failure message is passed here

  return (
    <div>
      <h1>Transaction Failed</h1>
      <p>Unfortunately, your transaction could not be processed.</p>
      {message && <p>Reason: {message}</p>}
      {/* Provide options to retry or contact support */}
    </div>
  );
};

export default FailurePage;
