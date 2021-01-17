import React, { Component } from "react";
import "../../utilities.css";
import "./account.css"
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { get } from "../../utilities";
const GOOGLE_CLIENT_ID = "666170878713-705kglliuqe3jr4l0mha34ei8d862qud.apps.googleusercontent.com";

class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            works: [],
        };
    }

    componentDidMount() {
        //worksArray is returned by the API
        get("/api/works", {userId: this.props.userId}).then((worksArray) => {
            console.log(worksArray);
            this.setState({works: worksArray});
        });
    }

    render () {
        //profile will display works, and workslist is what we get from API
        let worksList = null;
        const hasWorks = this.state.works.length !== 0;

        if (hasWorks) {
            //workObj is each work in this.state.works
            worksList = this.state.works.map((workObj) => (
                <img src={workObj.source}/>
            ));

        } else {
            worksList = <div>You have no works</div>;
        }

        return (
            <>
            {/**Google logout button below*/}
            <GoogleLogout
            clientId={GOOGLE_CLIENT_ID}
            buttonText="Logout"
            onLogoutSuccess={this.props.handleLogout}
            onFailure={(err) => console.log(err)}/>
            
            {/**Displays the username */}
            <div>
            {this.props.userName}
            </div>   
            
            {worksList}
           </>
        )
    }
}

export default Account;