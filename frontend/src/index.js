import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ContextProvider } from './Context';
import { BrowserRouter } from 'react-router-dom';

const basename = "/sample-video-call"; // Replace with your GitHub repo name

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter basename={basename}>
    <ContextProvider>
      <App />
    </ContextProvider>
  </BrowserRouter>
);

reportWebVitals();
