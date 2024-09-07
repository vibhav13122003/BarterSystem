import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Routes from './Routes';
import { Provider } from 'react-redux';
import store from './Store/Reducers';
import { SocketProvider } from "./utils/SocketContext";

// Kommunicate.init("2d4666d3b05a38a513a87d7fc1a11876e", { "popupWidget": true, "automaticChatOpenOnNavigation": true })

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <SocketProvider>
  <Provider store={store} >
    <Routes />
  </Provider>
  </SocketProvider>
);

