import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Visualizer from './Visualizer';

import { Provider } from 'react-redux';
import { store } from './redux/store';

ReactDOM.render(
    <Provider store={store}>
        <React.StrictMode>
            <Visualizer />
        </React.StrictMode>
    </Provider>,
    document.getElementById('root')
);
