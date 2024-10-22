import React from 'react';
import ReactDOM from 'react-dom/client';

// Redux
import { Provider } from 'react-redux';
import { store } from './redux/store';



// Rainbow Kit
import './polyfills';

// Telegram Mini App SDK
import WebApp from '@twa-dev/sdk';

// App + Styles
//import App from './App';
const WrappedApp = React.lazy(() => import('./App'));
import './Store.css';



// Hide the main button
WebApp.MainButton.hide();
// Expand the Telegram Mini App to full screen
WebApp.expand();
// Initialize the Telegram Mini App SDK
WebApp.ready();
// Enable the closing confirmation
WebApp.enableClosingConfirmation();


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
//<React.StrictMode> </React.StrictMode>
root.render(
        <Provider store={store}>
                <WrappedApp />
        </Provider>
);
