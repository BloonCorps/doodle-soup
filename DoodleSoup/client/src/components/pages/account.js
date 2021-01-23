import React, { Component } from "react";
import "../../utilities.css";
import "./account.css"
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { get } from "../../utilities";
import Post from "../modules/Post.js";

const GOOGLE_CLIENT_ID = "666170878713-705kglliuqe3jr4l0mha34ei8d862qud.apps.googleusercontent.com";

class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            works: [],
            user: undefined,
        };
    }

    refreshPage = () => {
        window.location.reload(false);
    }

    componentDidMount() {
        get(`/api/user`, {userid: this.props.userId }).then((user) => this.setState({ user: user }));
        // console.log(this.state.user)

        get("/api/works", {userId: this.props.userId}).then((worksArray) => {
            this.setState({works: worksArray});
        });
    }

    componentDidUpdate(prevprops) {
        //prevprops from previous "page"
        //helps remount a component
        get(`/api/user`, {userid: this.props.userId }).then((user) => this.setState({ user: user }));

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
                <div className="spacing">
                    <Post tags = {workObj.tags} userId = {this.state.user._id} posterId = {workObj.creator_id} updateFunction = {this.updatePage} key = {workObj._id} imageId = {workObj._id} creator_id={workObj.creator_id} creator_name={workObj.creator_name} pic={workObj.source}/>
                </div>
            ));

        } else {
            worksList = <div>You have no works</div>;
        }

        return (
            <div className="accountPage">
                {/**Displays the username */}
                <div className="usernameAccount">
                    { (!this.state.user) ? <div> Loading! </div> : this.state.user.name + "'s Works"}
                </div>   
                <div className="myWorks">
                    {worksList}
                </div>
           </div>
        )
    }
}

export default Account;