import React, { useState, useEffect } from 'react';
import { Auth } from "aws-amplify";
import { Link, useHistory } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import ErrorBoundary from "./components/ErrorBoundary";
import { AppContext } from "./libs/contextLib";
import { onError } from "./libs/errorLib";
import Routes from "./Routes";

import './App.css';

function App() {
  const history = useHistory();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    }
    catch(e) {
      if (e !== 'No current user') {
        onError(e);
      }
    }

    setIsAuthenticating(false);
  }

  async function handleLogout() {
    await Auth.signOut();

    userHasAuthenticated(false);

    history.push("/login");
  }

  return (
    <div className="App">
      <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
        <Navbar.Brand>
          <Link to="/">Airbnb</Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          {isAuthenticated ? (
            <>
              <Nav className="mr-auto">
                <Nav.Item style={{ display: "none" }}>Authenticated</Nav.Item>
              </Nav>
              <Nav>
                <Nav.Item>
                  <Link to="/bookings">Bookings</Link>
                </Nav.Item>
                <Nav.Item>
                  <Link to="/properties">Properties</Link>
                </Nav.Item>
                <Nav.Item>
                  <Link to="/" onClick={handleLogout}>Logout</Link>
                </Nav.Item>
              </Nav>
            </>) : (
              <>
                <Nav className="mr-auto">
                  <Nav.Link href="#home" style={{ display: "none" }}>not Authenticated</Nav.Link>
                </Nav>
                <Nav>
                  <Nav.Item>
                    <Link to="/signup">Signup</Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Link to="/login">Login</Link>
                  </Nav.Item>
                </Nav>
              </>
            )}
        </Navbar.Collapse>
      </Navbar>
      <br />
      <ErrorBoundary>
        <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
          <Routes />
        </AppContext.Provider>
      </ErrorBoundary>
    </div>
  );
}

export default App;
