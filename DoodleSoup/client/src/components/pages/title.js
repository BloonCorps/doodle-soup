import React, { Component } from "react";
import "../../utilities.css";
import "./title.css"


//This below is the correct client ID, Stuff for making login button
import GoogleLogin, { GoogleLogout } from "react-google-login";
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
            <div className="titleBox">
              <text className="title"> DOODLESOUP </text>
            </div>
            {this.props.userId ? (
          <GoogleLogout
            clientId={GOOGLE_CLIENT_ID}
            buttonText="Logout"
            onLogoutSuccess={this.props.handleLogout}
            onFailure={(err) => console.log(err)}
          />
        ) : (
          <div className="login">
          <GoogleLogin
            className="button"
            clientId={GOOGLE_CLIENT_ID}
            buttonText="Login"
            onSuccess={this.props.handleLogin}
            onFailure={(err) => console.log(err)}
          />
          </div>
        )}
      </>
        )
    }
}

export default Title;