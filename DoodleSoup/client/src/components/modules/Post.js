import React, { Component } from "react";
import { Link } from "@reach/router";
import "./Post.css";
import { post, get } from "../../utilities";

import GoogleLogin, { GoogleLogout } from "react-google-login";
const GOOGLE_CLIENT_ID = "666170878713-705kglliuqe3jr4l0mha34ei8d862qud.apps.googleusercontent.com";

class Post extends Component {
  constructor(props) {
    super(props);
  }

  deletePost = () => {
    const body = {
        imageId: this.props.imageId,
    };
    //Updates the feed
    post("/api/delete", body).then(this.props.updateFunction());
}

  render() {
    if (this.props.creator_id === this.props.userId) {
      return (
        //{this.props.creator_id}
        <div className="card"> 
  
          <div className="header">

            <Link to={`/account/${this.props.creator_id}`} className="usernameWorkFeedwithButtons">
            <p className="usernameContent">
              {this.props.creator_name}
            </p>
            </Link>
            <Link to={`/create/${this.props.imageId}`} className="editPost">
              <p>Edit</p>
            </Link>

            <Link to={`/feed/`} onClick = {this.deletePost} className="deletePost">
              <p>Delete</p>
            </Link>
          </div>

          <img className="imgWorkFeed" src={this.props.pic}/>

          <div className="taggedPost"> <p className="tagContent"></p> </div>
        </div>)

    } else {
      return (
        <div className="card"> 
          <Link to={`/account/${this.props.creator_id}`} className="usernameWorkFeed">
            <p className="usernameContent">
              {this.props.creator_name}
            </p>
          </Link>
          <img className="imgWorkFeed" src={this.props.pic}/>

          <div className="taggedPost"> <p className="tagContent"></p> </div>
        </div>
      );
    }
  }
}

export default Post;
