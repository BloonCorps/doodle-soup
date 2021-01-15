import React, { Component } from "react";
import { Router, Location, Redirect } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Feed from "./pages/Feed.js";
import NavBar from "./modules/NavBar.js";
import Canvas from "./pages/canvas.js";
import Title from "./pages/title.js";
import Account from "./pages/account.js";


import "../utilities.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";

/**
 * Define the "App" component as a class.
 */
class App extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {
      userId: undefined,
    };
  }

  componentDidMount() {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        this.setState({ userId: user._id });
      }
    });
  }

  handleLogin = (res) => {
    console.log(`Logged in as ${res.profileObj.name}`);
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken }).then((user) => {
      this.setState({ userId: user._id });
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  handleLogout = () => {
    this.setState({ userId: undefined });
    post("/api/logout");
  };

  checkLoggedIn = () => {
    if (!this.state.userId) {
      console.log("UNDEFINED")
      window.alert(">:( Please log in first <3")
      return <Redirect to="/" />
    }
  }
  render() {
    // !this.state.userId ? window.location.pathname = "/" : null
    return (
      <>
        <Location>
          {locationProps => (
             (locationProps.location.pathname === "/") ? null : (
                <NavBar />
             )
            //  (!this.state.userId) ? window.location.pathname = "/" : null
          )}
        </Location>
        <Router>
          <Title path="/"
          handleLogin={this.handleLogin}
          handleLogout={this.handleLogout}
          userId={this.state.userId}
          // {...(this.state.userId) ? <Redirect to="/feed/" /> : null}
          />
          {/* just trying to redirect this stupid fucker why wont it WORKKK*/}
          {/* {...!this.state.userId ? window.location.pathname = "/" : null} */}
          <NotFound default/>
          <Canvas path="/create/"/>
          <Account path="/account/"/>
          <Feed path="/feed/"/>
          
        </Router>
      </>
    );
  }
}

export default App;
