import React, { Component } from "react";
import { Link } from "@reach/router";
import "./Post.css";
import { post, get } from "../../utilities";

import GoogleLogin, { GoogleLogout } from "react-google-login";
const GOOGLE_CLIENT_ID = "666170878713-705kglliuqe3jr4l0mha34ei8d862qud.apps.googleusercontent.com";

/**
 * The navigation bar at the top of all pages. Takes no props.
 */
class Post extends Component {
  constructor(props) {
    super(props);
  }

  deletePost = () => {
    //console.log(this.props);
    const body = {
        imageId: this.props.imageId,
    };
    console.log(body);
    post("/api/delete", body);
}

  render() {
    return (
      //{this.props.creator_id}
      <div className="card"> 
        <Link to={`/account/${this.props.creator_id}`} className="usernameWorkFeed">
          {this.props.creator_name}
        </Link>
      <img className="imgWorkFeed" src={this.props.pic}/>

          <div className="postButtons">
            <button className="editPost">Edit</button>
            <button onClick = {this.deletePost} className="deletePost">Delete</button>
          </div>
      </div>
    );
  }
}

export default Post;
