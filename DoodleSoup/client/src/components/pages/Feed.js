import React, { Component } from "react";

import "./Feed.css";
import Post from "../modules/Post.js";
import { get } from "../../utilities";

import { socket } from "../../client-socket.js";

class Feed extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      works: [],
      user: undefined,
    };
    document.title = "News Feed";
  }

  componentDidMount() {
    get("/api/allworks").then((worksArray) => {
      this.setState({works: worksArray.reverse()});
    });
    get(`/api/user`, {userid: this.props.userId }).then((user) => this.setState({ user: user }));
    
    //Socket lets page update frequently whenever someone submits something
    socket.on("newdrawing", (newDrawing) => {
      this.updatePage()
    });
  }

  //for fast reloading when deleting
  updatePage = () => {
    get("/api/allworks").then((worksArray) => {
      this.setState({works: worksArray.reverse()});
    });
  }

  render() {
    let worksList = undefined;
    const hasWorks = this.state.works.length !== 0;

    if (hasWorks) {
          //workObj is each work in this.state.works
          worksList = this.state.works.map((workObj) => (
            <div key = {workObj._id + "1337"} className="spacing">
                <Post 
                updateFunction = {this.updatePage} tags = {workObj.tags} 
                //userId = {this.props.userId} posterId = {workObj.creator_id} 
                key = {workObj._id} imageId = {workObj._id} creator_id={workObj.creator_id} 
                creator_name={workObj.creator_name} pic={workObj.source}/>
            </div>
          ));
    } else {
        worksList = <div>You have no works</div>;
    }

    return (
      <>
        <div className="feed">
          {worksList}
        </div>
      </>
    );
  }
}

export default Feed;
