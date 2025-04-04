import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Input, Dropdown } from 'semantic-ui-react';
import config from 'react-global-configuration';

class Header extends Component {
  handleLogout = () => {
    // Clear user data from local storage
    localStorage.removeItem('username');
    localStorage.removeItem('token'); // Assuming you store a token for authentication
    // Call a prop function to update the loggedIn state in the parent component
    this.props.onLogout();
  };

  render() {
    return (
      <Menu secondary>
        <Link to='/'><Menu.Item name='home' /></Link>
        <Link to='/movies'><Menu.Item name='movies' /></Link>
        <Link to='/sports'><Menu.Item name='sports' /></Link>
        <Menu.Menu position='right'>
          <Menu.Item>
            <Input icon='search' placeholder='Search...' />
          </Menu.Item>
          {this.loginCheck()}
        </Menu.Menu>
      </Menu>
    );
  }

  loginCheck() {
    if (!this.props.loggedIn) {
      return (
        <Link to='/login'><Menu.Item>Log in</Menu.Item></Link>
      );
    } else {
      const username = localStorage.getItem('username');
      return (
        <Dropdown item text={`Hi! ${username}`}>
          <Dropdown.Menu>
            <Dropdown.Item as={Link} to='/profile'>Profile</Dropdown.Item>
            <Dropdown.Item onClick={this.handleLogout}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
    }
  }
}

export default Header;