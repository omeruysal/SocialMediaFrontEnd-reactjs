import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import App from './container/App'
import {Provider} from 'react-redux'
import configureStore from './redux/ConfigureStore';




const store = configureStore();

ReactDOM.render(


  <React.StrictMode>
    <Provider store={store}>
    <App/>
    </Provider>
    ,


  </React.StrictMode>,
  document.getElementById('root')
);

// Yukaridaki gibi parent child iliskisi olusturdugumuz zaman, parent icinde child render edebilir ve ona parametre verebiliriz
reportWebVitals();
