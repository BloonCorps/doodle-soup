import React, { Component } from "react";
import { Link } from "@reach/router";

import "./Post.css";

import GoogleLogin, { GoogleLogout } from "react-google-login";
const GOOGLE_CLIENT_ID = "666170878713-705kglliuqe3jr4l0mha34ei8d862qud.apps.googleusercontent.com";

/**
 * The navigation bar at the top of all pages. Takes no props.
 */
class Post extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      
      <div className="card"> 
        <div className="usernameWorkFeed">{this.props.creator_name}</div>
        <img className="imgWorkFeed" src={this.props.pic}/>
      </div>
    );
  }
}

export default Post;
