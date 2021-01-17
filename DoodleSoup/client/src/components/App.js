import React, { Component } from "react";
import { Router, Location, Redirect, navigate } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Feed from "./pages/Feed.js";
import NavBar from "./modules/NavBar.js";
import Canvas from "./pages/canvas.js";
import Title from "./pages/title.js";
import Account from "./pages/account.js";


import "../utilities.css";
import { socket } from "../client-socket.js";
import { get, post } from "../utilities";

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
        this.setState({ userId: user._id,
                      userName: user.name,
                      friends: user.friends,
                      userGoogleId: user.googleid});
      }
    });
  }

  handleLogin = (res) => {
    console.log(`Logged in as ${res.profileObj.name}`);
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken }).then((user) => {
      this.setState({ userId: user._id}, () => navigate("/feed/"));
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  handleLogout = () => {
    this.setState({ userId: undefined });
    post("/api/logout");
  };

  render() {
    return (
      <>
       {!this.state.userId ? 
       <Title path="/"
          handleLogin={this.handleLogin}
          userId={this.state.userId}
          /> : 
          <>

          <NavBar 
          handleLogin={this.handleLogin}
          handleLogout={this.handleLogout} 
          userId={this.state.userId}/>

          <Router>
          <NotFound default userId={this.state.userId}/>
          <Canvas path="/create/" userId={this.state.userId}/>
          <Account userName= {this.state.userName} path="/account/:userID" userId={this.state.userId} handleLogout={this.handleLogout}/>
          <Feed path="/feed/" userId={this.state.userId}/>
          </Router>

        </>
        }
        {/* <Location>
          {locationProps => (
             (locationProps.location.pathname === "/") ? null : (
                
             )
            //  (!this.state.userId) ? window.location.pathname = "/" : null
          )}
        </Location> */}
        
      </>
    );
  }
}

export default App;
