import React, { Component } from "react";
import "../../utilities.css";
import "./account.css"
import { get } from "../../utilities";
import Post from "../modules/Post.js";

class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            works: [],
            user: undefined,
        };
    }

    componentDidMount() {
        get("/api/whoami").then((user) => {
            if (user._id) {
              this.setState({user: user});
              this.setState({userName: user.name})
            }
        });

        get("/api/works", {userId: this.props.userId}).then((worksArray) => {
            this.setState({works: worksArray});
        });

        get("/api/user", {userid: this.props.userId }).then((workUser) => 
        this.setState({workUser: workUser}))//.then(() => {console.log(this.state.workUser)});
    }

    updatePage = () => {
        get("/api/works", {userId: this.props.userId}).then((worksArray) => {
            this.setState({works: worksArray});
        });
    }
    render () {
        //profile will display works, and workslist is what we get from API
        let worksList = undefined;
        const hasWorks = this.state.works.length !== 0;

        if (hasWorks) {
            //workObj is each work in this.state.works
            worksList = this.state.works.map((workObj) => (
                <div key= {workObj._id + "1337"}className="spacing">
                    <Post key = {workObj._id} tags = {workObj.tags} viewerId = {this.state.user._id} 
                    updateFunction = {this.updatePage} imageId = {workObj._id} 
                    creator_id={workObj.creator_id} creator_name={workObj.creator_name} 
                    pic={workObj.source}/>
                </div>
            ));

        } else {
            worksList = <div>You have no works</div>;
        }
        return (
            <div className="accountPage">
                {/**Displays the username */}
                <div className="usernameAccount">
                    { (!this.state.workUser) ? <div> Loading! </div> : this.state.workUser.name + "'s Works"}
                </div>   
                <div className="myWorks">
                    {worksList}
                </div>
           </div>
        )
    }
}

export default Account;