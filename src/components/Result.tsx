import React from "react";
import JSONPretty from "react-json-pretty";
import { RouteComponentProps } from "react-router-dom";

type ResultProps = RouteComponentProps<{}, {}, { data: any }>;

const Result: React.FC<ResultProps> = (props) => {
  const state = props.location;
  let dataDisplay;

  if (state) {
    const currentEntry = props.location.state.data.current;
    const newEntry = props.location.state.data.new;

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
};

export default Result;
