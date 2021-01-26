import React, { Component } from "react";
import { Router, Location, Redirect, navigate } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Feed from "./pages/Feed.js";
import NavBar from "./modules/NavBar.js";
import Canvas from "./pages/canvas.js";
import Title from "./pages/title.js";
import Account from "./pages/account.js";
import Tags from "./pages/tags";


import "../utilities.css";
import { socket } from "../client-socket.js";
import { get, post } from "../utilities";

class App extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {
      userId: undefined,
      imageId: "new",
      userName: undefined,
    };
  }

  //not used but kept for reference
  refreshPage() {
    window.location.reload(false); 
  }

  componentDidMount() {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        this.setState({ userId: user._id });
        this.setState({userName: user.name})
      }
    });
  }

  handleLogin = (res) => {
    console.log(`Logged in as ${res.profileObj.name}`);
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken }).then((user) => {
      post("/api/initsocket", { socketid: socket.id });
      this.setState({ userId: user._id, }, () => navigate("/feed/"));
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
          <Canvas path="/create/:imageId" userId={this.state.userId}/>
          
          {/* /account/:userId passes down userId as a prop */}
          <Account path="/account/:userId" handleLogout={this.handleLogout}/>
          <Feed path="/feed/" userId={this.state.userId}/>
          <Tags path="/tags/:userId" 
          userName = {this.state.userName}/>
          </Router>
        </>
        }
      </>
    );
  }
}

export default App;
