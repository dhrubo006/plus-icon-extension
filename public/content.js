import React from 'react';
import { createRoot } from 'react-dom/client';
import PlusIcon from '../src/components/plusicon';
import '../src/components/PlusIcon.css';

console.log('content.js loaded');  // First line to verify script is running

window.onload = function() {
  console.log('Window onload event fired');  // Second log to verify window onload

  // Create a container for the PlusIcon component
  const plusIconContainer = document.createElement('div');
  plusIconContainer.id = 'plus_icon_container';
  document.body.appendChild(plusIconContainer);
  console.log('Plus icon container created and appended to body');

  // Render the PlusIcon component
  const root = createRoot(plusIconContainer);
  root.render(<PlusIcon />);
};
