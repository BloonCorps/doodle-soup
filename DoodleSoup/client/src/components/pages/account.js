import React, { Component } from "react";
import "../../utilities.css";
import "./account.css"
import GoogleLogin, { GoogleLogout } from "react-google-login";
const GOOGLE_CLIENT_ID = "666170878713-705kglliuqe3jr4l0mha34ei8d862qud.apps.googleusercontent.com";

class Account extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // remember -- api calls go here!
    }

    render () {
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

           </>
        )
    }
}

export default Account;