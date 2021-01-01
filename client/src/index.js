import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import * as serviceWorker from './serviceWorker';

import { BrowserRouter } from 'react-router-dom'
import UserContextProvider from './contexts/UserContextProvider';
import ThemeContextProvider from './contexts/ThemeContextProvider';

ReactDOM.render(

  <BrowserRouter>
    <UserContextProvider>
      <ThemeContextProvider>
      <App />
      </ThemeContextProvider>
    </UserContextProvider>
  </BrowserRouter>


  , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
