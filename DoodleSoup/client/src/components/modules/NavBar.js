import React, { Component } from "react";
import { Link } from "@reach/router";

import "./NavBar.css";

import GoogleLogin, { GoogleLogout } from "react-google-login";
const GOOGLE_CLIENT_ID = "666170878713-705kglliuqe3jr4l0mha34ei8d862qud.apps.googleusercontent.com";

/**
 * The navigation bar at the top of all pages. Takes no props.
 */
class NavBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <nav className="navContainer">
        <div className="navTitle">DoodleSoup</div>
        <div className="navLink">

          <Link to="/feed/" className="navButton">
            Feed
          </Link>

          <Link to="/create/new" className="navButton">
            Create
          </Link>

          <Link to={`/tags/${this.props.userId}`} className="navButton">
            Tags
          </Link>

          <Link to={`/account/${this.props.userId}`} className="navButton">
            Profile
          </Link>

          {this.props.userId ? (
            <GoogleLogout
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Logout"
              onLogoutSuccess={this.props.handleLogout}
              onFailure={(err) => console.log(err)}
              className="NavBar-link NavBar-login"
            />
          ) : (
            <GoogleLogin
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Login"
              onSuccess={this.props.handleLogin}
              onFailure={(err) => console.log(err)}
              className="NavBar-link NavBar-login"
            />
          )}
          
        </div>
      </nav>
    );
  }
}

export default NavBar;
