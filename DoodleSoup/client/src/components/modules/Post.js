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
    post("/api/delete", body).then(this.props.updateFunction());
}

  render() {
    return (
      //{this.props.creator_id}
      <div className="card"> 

        <Link to={`/account/${this.props.creator_id}`} className="usernameWorkFeed">
          <p className="usernameContent">
            {this.props.creator_name}
          </p>
        </Link>

        <img className="imgWorkFeed" src={this.props.pic}/>

        <div className="postButtons">
          <Link className="editPost" to={`/create/${this.props.imageId}`} className="editPost">
            Edit
          </Link>
          <button onClick = {this.deletePost} className="deletePost">Delete</button>  
        </div>
      </div>
    );
  }
}

export default Post;
