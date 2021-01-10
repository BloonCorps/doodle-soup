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
      <nav className="NavBar-container">
        <div>Catbook</div>
        <div>
          <Link to="/">
            Home
          </Link>

          <Link to="/create/">
            Profile
          </Link>
        </div>
      </nav>
    );
  }
}

export default NavBar;
