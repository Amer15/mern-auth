import React from 'react';
import { Navbar, Nav} from 'react-bootstrap';
import { NavLink, withRouter } from 'react-router-dom';
import { signout, isAuth } from '../../utils/helper';
import classes from './Header.module.css';

class Header extends React.Component{

  logoutHandler(props){
    signout(() => {
      props.history.push('/');
    });
  }
  

  render() {
    let links;
    if(isAuth()){
       links = <>
        <NavLink to="/dashboard"
        activeClassName="active-class">
        Dashboard
        </NavLink>
        <NavLink to="/signin"
        onClick={() => this.logoutHandler(this.props)}>
        Logout
        </NavLink>
       </>
    }
    else{
      links =  <>
        <NavLink to="/register"
          activeClassName="active-class">
          Register
      </NavLink>

        <NavLink to="/signin"
          activeClassName="active-class">
          Signin
        </NavLink>
      </> 
    }

    return (
      <Navbar collapseOnSelect expand="lg" variant="dark" className={classes.header}>
      <Navbar.Brand href="#home">MERN AUTH</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="ml-auto navbar">
          <NavLink to="/" exact
            activeClassName="active-class">
            Home
          </NavLink>

          {links}

        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
  }
}

export default withRouter(Header);