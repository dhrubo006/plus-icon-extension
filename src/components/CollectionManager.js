import React, { useEffect, useState, useRef } from 'react';
import { FaPlus } from 'react-icons/fa';
import Draggable from 'react-draggable';
import CollectionManager from './CollectionManager';
import './PlusIcon.css';

const PlusIcon = () => {
  const [dragging, setDragging] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showCollections, setShowCollections] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const clickTimeoutRef = useRef(null);
  const TIME_THRESHOLD = 200; // Time threshold in milliseconds

  useEffect(() => {
    console.log('PlusIcon component mounted');
  }, []);

  const handleMouseDown = () => {
    console.log('Mouse down');
    clickTimeoutRef.current = setTimeout(() => {
      setDragging(true);
      console.log('Dragging set to true');
    }, TIME_THRESHOLD); // Adjust the time threshold as needed
  };

  const handleMouseUp = () => {
    console.log('Mouse up');
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      if (!dragging) {
        console.log('Click detected');
        setShowMenu(!showMenu);
      }
    }
    setTimeout(() => setDragging(false), 0); // Reset dragging state
  };

  const handleDrag = (e, data) => {
    console.log('Dragging', data);
    setPosition({ x: data.x, y: data.y });
  };

  const handleAddNow = () => {
    console.log('Add Now clicked');
    const currentUrl = window.location.href;

    const getFavicon = () => {
      let favicon = "";
      const nodeList = document.querySelectorAll('link[rel~="icon"]');
      if (nodeList.length > 0) {
        favicon = nodeList[0].href;
      }
      return favicon;
    };

    const favicon = getFavicon();

    chrome.runtime.sendMessage({ action: 'storeUrl', url: currentUrl, favicon: favicon }, (response) => {
      console.log('Response:', response);
    });

    setShowMenu(false); // Hide menu after action
  };

  const handleAddToCollection = () => {
    console.log('Add to Collection clicked');
    setShowCollections(true); // Show collection manager
    setShowMenu(false); // Hide menu
  };

  const handleAddToCollectionConfirmed = (collection) => {
    console.log(`Add to collection: ${collection}`);
    const currentUrl = window.location.href;

    const getFavicon = () => {
      let favicon = "";
      const nodeList = document.querySelectorAll('link[rel~="icon"]');
      if (nodeList.length > 0) {
        favicon = nodeList[0].href;
      }
      return favicon;
    };

    const favicon = getFavicon();

    chrome.runtime.sendMessage({ action: 'storeUrlInCollection', url: currentUrl, favicon: favicon, collection }, (response) => {
      console.log('Response:', response);
    });

    setShowCollections(false); // Hide collection manager after action
  };

  const handleCreateNewCollection = (newCollection) => {
    console.log(`New collection created: ${newCollection}`);
    handleAddToCollectionConfirmed(newCollection); // Add current URL to the new collection
  };

  return (
    <Draggable
      position={position}
      onStart={() => setDragging(false)}
      onDrag={handleDrag}
      onStop={() => setDragging(false)}
    >
      <div
        id="plus-icon"
        className="plus-icon"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <FaPlus size={30} color="white" />  {/* Set the icon size and color */}
        {showMenu && (
          <div className="menu">
            <button onClick={handleAddNow}>Add Now</button>
            <button onClick={handleAddToCollection}>Add to Collection</button>
          </div>
        )}
        {showCollections && (
          <CollectionManager
            onAddToCollection={handleAddToCollectionConfirmed}
            onCreateNewCollection={handleCreateNewCollection}
          />
        )}
      </div>
    </Draggable>
  );
};

export default PlusIcon;
