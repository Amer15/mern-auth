import React from 'react';
import { Navbar, Nav} from 'react-bootstrap';
import { NavLink} from 'react-router-dom';
import { removeCookie, removeLocalStorage } from '../../utils/helper';


class Header extends React.Component{

 

  logoutHandler(){
    removeCookie('token');
    removeLocalStorage('user');
    window.location.href = '/signin';
  }


  render() {
    let links;
    if(this.props.isAuth){
       links =  <NavLink to="/signin"
        activeClassName="active-class"
        onClick={this.logoutHandler}>
        logout
        </NavLink>
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
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
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

export default Header;