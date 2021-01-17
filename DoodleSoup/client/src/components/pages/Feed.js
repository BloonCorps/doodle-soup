import React, { Component } from "react";

import "./Feed.css";
import Post from "../modules/Post.js";
import { get } from "../../utilities";

class Feed extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      works: [],
    };
  }

  componentDidMount() {
    document.title = "News Feed";

    get("/api/allworks").then((worksArray) => {
      console.log(worksArray);
      this.setState({works: worksArray.reverse()});
    });
  }

  render() {
    let worksList = undefined;
    const hasWorks = this.state.works.length !== 0;

    console.log(worksList);

    if (hasWorks) {
          //workObj is each work in this.state.works
          worksList = this.state.works.map((workObj) => (
              <div>
              {workObj.creator_name}
              <img src={workObj.source}/>
              </div>
          ));

    } else {
        worksList = <div>You have no works</div>;
    }

    let drawingsList = null;
    const hasDrawings = this.state.works.length !== 0;
    if (hasDrawings) {
      drawingsList = this.state.works.map((DrawingObj) => (
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
        {/**drawingsList*/}
        {worksList}
      </>
    );
  }
}

export default Feed;
