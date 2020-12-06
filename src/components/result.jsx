import queryString from "query-string";
import React, { Component } from "react";
import JSONPretty from "react-json-pretty";
import TimeEntry from "./timeEntry";

class Result extends Component {
  state = {};
  render() {
    const state = this.props.location.state;
    let dataDisplay;

    if (state) {
      const currentEntry = this.props.location.state.data.current;
      const newEntry = this.props.location.state.data.new;

      dataDisplay = {
        current: {
          succed: currentEntry.timeInterval,
          error: currentEntry.data,
        },
        new: { succed: newEntry.timeInterval, error: newEntry.data },
      };
    } else {
      dataDisplay = "404 not found";
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col">
            {state && (
              <JSONPretty id="json-pretty2" data={dataDisplay}></JSONPretty>
            )}
            {!state && dataDisplay}
          </div>
        </div>
      </div>
    );
  }
}

export default Result;
