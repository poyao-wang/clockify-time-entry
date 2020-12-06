import queryString from "query-string";
import React, { Component } from "react";
import JSONPretty from "react-json-pretty";
import TimeEntry from "./timeEntry";

class Result extends Component {
  state = {};
  render() {
    const currentEntry = this.props.location.state.data.current;
    const newEntry = this.props.location.state.data.new;

    const dataDisplay = {
      current: { succed: currentEntry.timeInterval, error: currentEntry.data },
      new: { succed: newEntry.timeInterval, error: newEntry.data },
    };

    return (
      <div className="container">
        <div className="row">
          {/* <JSONPretty
            id="json-pretty"
            data={this.props.location.state.data}
          ></JSONPretty> */}
          <JSONPretty id="json-pretty2" data={dataDisplay}></JSONPretty>
        </div>
      </div>
    );
  }
}

export default Result;
