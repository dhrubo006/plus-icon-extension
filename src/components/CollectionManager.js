import React from 'react';

const CollectionManager = ({ onClose }) => {
  return (
    <div className="collection-manager">
      <p>Select or create a collection to add this URL to:</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default CollectionManager;
