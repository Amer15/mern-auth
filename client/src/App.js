import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Header from './components/Header/Header';
import WelcomePage from './components/WelcomePage/WelcomePage';
import RegisterForm from './components/RegisterForm/RegisterForm';
import SigninForm from './components/SigninForm/SigninForm';
import ActivationPage from './components/ActivationPage';
import Dashboard from './components/Dashboard';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';
import PublicRoute from './Routes/PublicRoute';
import PrivateRoute from './Routes/PrivateRoute';
import { isAuth, removeCookie } from './utils/helper';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';




class App extends Component {

  logoutHandler = () => {
    localStorage.removeItem('user');
    removeCookie('token'); 
    window.location.href = '/signin';
  }

  render() {

    return (
      <div className="App">
        <Header isAuth = {isAuth()}/>
        <Switch>
          <Route path="/" exact component={WelcomePage} />
          <PublicRoute restricted path="/register" component={RegisterForm}/>
          <PublicRoute restricted path="/signin" component={SigninForm} />
          <Route path="/auth/activate/:token" component={ActivationPage} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/reset-password/:token" component={ResetPassword} />
          <PrivateRoute path="/dashboard" component={Dashboard} />
          <Route path="" render={() => <h1>404 Page Not Found</h1>} />
        </Switch>
      </div>
    );
  }
}


export default App;
