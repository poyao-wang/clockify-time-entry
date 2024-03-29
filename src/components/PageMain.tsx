import React from "react";
import { RouteComponentProps } from "react-router-dom";

import TimeEntryForm from "./Form";

const TimeEntry: React.FC<RouteComponentProps> = (props) => {
  return <TimeEntryForm {...props} />;
};

export default TimeEntry;
