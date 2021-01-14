import React, { Component } from "react";
import "../../utilities.css";
import "./title.css"
import GoogleLogin, { GoogleLogout } from "react-google-login";

//This below is the correct client ID
const GOOGLE_CLIENT_ID = "666170878713-705kglliuqe3jr4l0mha34ei8d862qud.apps.googleusercontent.com";


class Title extends Component {
    constructor(props) {
        super(props);
        // Initialize Default State
    this.state = {};
    }

    componentDidMount() {
        // remember -- api calls go here!
      }


    render () {
        return (
            <>
            {this.props.userId ? (
          <GoogleLogout
            clientId={GOOGLE_CLIENT_ID}
            buttonText="Logout"
            onLogoutSuccess={this.props.handleLogout}
            onFailure={(err) => console.log(err)}
          />
        ) : (
          <GoogleLogin
            clientId={GOOGLE_CLIENT_ID}
            buttonText="Login"
            onSuccess={this.props.handleLogin}
            onFailure={(err) => console.log(err)}
          />
        )}
      </>
        )
    }
}

export default Title;