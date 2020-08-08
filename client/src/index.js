import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import './index.css';
import App from './App';
import { getCookie, signout } from './utils/helper';

//BASE URL Prefix for all requests
// axios.defaults.baseURL = "http://localhost:8000/api"

axios.interceptors.request.use( config => {
  const token = getCookie('token');
  config.headers.authorization = token;
  // console.log(config);
  return config;
}, error => {
  // console.log(error);
  return Promise.reject(error);
});

axios.interceptors.response.use( null, (error) => {
  if(error.response.status === 401){
     signout(() => {
       window.location.href ='/signin';
     });
  }

  return Promise.reject(error);
});

ReactDOM.render(
  <BrowserRouter>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BrowserRouter>
  ,
  document.getElementById('root')
);


