import React, { Component } from "react";

import "./tags.css";
import Post from "../modules/Post.js";
import { get } from "../../utilities";

import { socket } from "../../client-socket.js";

class Tags extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {};
    document.title = "Tagged to Me";
  }

  componentDidMount() {

  }


  render() {
    return (
        <p>hi</p>
    );
  }
}

export default Tags;
