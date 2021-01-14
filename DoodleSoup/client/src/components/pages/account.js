import React, { Component } from "react";
import "../../utilities.css";
import "./account.css"

class Account extends Component {
    constructor(props) {
        super(props);
    }
    render () {
        return (
            <div>{this.props.userId}</div>
        )
    }
}

export default Account;