import React, { Component } from "react";
import { Link } from "@reach/router";

import "./NavBar.css";

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
          <Link to="/" className="navButton">
            Feed
          </Link>
          <Link to="/create/" className="navButton">
            Create
          </Link>
          <Link to="/account/" className="navButton">
            Account
          </Link>
        </div>
      </nav>
    );
  }
}

export default NavBar;
