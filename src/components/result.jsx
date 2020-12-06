import queryString from "query-string";
import React, { Component } from "react";
import JSONPretty from "react-json-pretty";
import TimeEntry from "./timeEntry";

class Result extends Component {
  state = {};
  render() {
    const currentEntry = this.props.location.state.data.current;
    const newEntry = this.props.location.state.data.new;

    const currentEntrySucced = currentEntry.timeInterval
      ? currentEntry.timeInterval
      : null;
    const currentEntryError = currentEntry.data ? currentEntry.data : null;

    const newEntrySucced = newEntry.timeInterval ? newEntry.timeInterval : null;
    const newEntryError = newEntry.data ? newEntry.data : null;

    const dataDisplay = {
      current: { succed: currentEntrySucced, error: currentEntryError },
      new: { succed: newEntrySucced, error: newEntryError },
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
