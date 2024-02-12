import React from 'react';
import { useLocation } from 'react-router-dom';

const SuccessPage = () => {
  const location = useLocation();
  const { details } = location.state || {}; // Assuming details about the transaction are passed here

  return (
    <div>
      <h1>Transaction Successful!</h1>
      <p>Your transaction was processed successfully.</p>
      {/* Optionally display more details from the transaction */}
      {details && <div>
        <p>Transaction Details:</p>
        <pre>{JSON.stringify(details, null, 2)}</pre>
      </div>}
    </div>
  );
};

export default SuccessPage;
