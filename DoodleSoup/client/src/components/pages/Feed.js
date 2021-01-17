import React, { Component } from "react";

import "./Feed.css";
import Post from "../modules/Post.js";
import { get } from "../../utilities";

class Feed extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      drawings: [],
    };
  }

  componentDidMount() {
    document.title = "News Feed";
    // this line doesnt fucking work
    get("/api/drawings").then((drawingObjs) => {
      let reversedStoryObjs = drawingObjs.reverse();
      reversedStoryObjs.map((drawingObj) => {
        this.setState({ drawings: this.state.drawings.concat([drawingObj]) });
      });
    });

    //Jessica I dont know what the fuck you were trying to do above but what I
    //have down here works
    get("/api/allworks").then((worksArray) => {
      this.setState({works: worksArray});
    });
  }

  render() {
    let drawingsList = null;
    const hasDrawings = this.state.drawings.length !== 0;
    if (hasDrawings) {
      drawingsList = this.state.drawings.map((DrawingObj) => (
        <Post
          key={`Card_${DrawingObj._id}`}
          _id={DrawingObj._id}
          creator_name={DrawingObj.creator_name}
          creator_id={DrawingObj.creator_id}
          userId={this.props.userId}
          content={DrawingObj.content}
        />
      ));
    } else {
      drawingsList = <div>No drawings!</div>;
    }
    return (
      <>
        {/* {this.props.userId && <NewStory addNewStory={this.addNewStory} />} */}
        {drawingsList}
      </>
    );
  }
}

export default Feed;
