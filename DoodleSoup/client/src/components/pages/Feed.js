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
            <div className="spacing">
              <Post creator_name={workObj.creator_name} pic={workObj.source} />
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
