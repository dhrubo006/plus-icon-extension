import React, { useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import './PlusIcon.css';


const PlusIcon = () => {
  useEffect(() => {
    console.log('PlusIcon component mounted');
    const handleMessage = (event) => {
      console.log('Received message in PlusIcon:', event.data);
      if (event.data.action === 'addPlusIconClickListener') {
        const captureAndStoreUrl = () => {
          console.log('Plus icon clicked');
          window.parent.postMessage({ action: 'storeUrl' }, '*');
        };

        const plusIconElement = document.getElementById('plus-icon');
        if (plusIconElement) {
          plusIconElement.addEventListener('click', captureAndStoreUrl);
        } else {
          console.error('Plus icon element not found');
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div
      id="plus-icon" className="plus-icon"
      //style={{
        //position: 'fixed',
        //bottom: '10px',
        //right: '10px',
        //cursor: 'pointer',
        //zIndex: 1000,
        //backgroundColor: '#5bc0de', /* Light blue background color */
        //borderRadius: '50%',       // Optional: make it round
        //display: 'flex',
        //alignItems: 'center',
        //justifyContent: 'center',
        //width: '50px',
        //height: '50px'
      //}}
    >
      <FaPlus size={30} color="white" />  {/* Set the icon size and color */}
    </div>
  );
};

export default PlusIcon;
