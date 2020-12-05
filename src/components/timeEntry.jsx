import React, { Component } from "react";

import TimeEntryForm from "./timeEntryForm";

class TimeEntry extends Component {
  state = {};
  render() {
    return <TimeEntryForm {...this.props} />;
  }
}

export default TimeEntry;
