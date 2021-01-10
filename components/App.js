import React, { Component } from "react";
import Canvas from "./pages/draw";
import NotFound from "./pages/NotFound.js";
import { Router } from "@reach/router";

// to use styles, import the necessary CSS files
import "../utilities.css";

/**
 * Define the "App" component as a class.
 */
class App extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
  }

  // required method: whatever is returned defines what
  // shows up on screen
  render() {
    return (
      // <> is like a <div>, but won't show
      // up in the DOM tree
      <>
        <NavBar />
        <div>
          <Router>
            <Feed path="/" />
            <Canvas path="/create/" />
            <NotFound default />
          </Router>
        </div>
      </>
    );
  }
}

export default App;
