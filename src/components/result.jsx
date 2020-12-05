import queryString from "query-string";
import React, { Component } from "react";

class Result extends Component {
  state = {};
  render() {
    return <div>{JSON.stringify(this.props.location.state)}</div>;
  }
}

export default Result;
