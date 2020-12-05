import Joi from "joi-browser";
import queryString from "query-string";
import React, { Component } from "react";

import Form from "./common/form";

class TimeEntryForm extends Form {
  state = {
    data: {
      projectId: "",
      taskId: "",
      tagId: "",
      description: "",
      hours: 0,
      minutes: 0,
    },
    errors: {},
  };

  schema = {
    projectId: Joi.string(),
    taskId: Joi.string(),
    tagId: Joi.string(),
    description: Joi.string(),
    hours: Joi.number(),
    minutes: Joi.number(),
  };

  componentDidMount() {
    const query = queryString.parse(this.props.location.search);
    const projectId = query.projectId;
    const taskId = query.taskId;
    const tagId = query.tagId;
    const description = query.description;

    this.setState({ data: { projectId, taskId, tagId, description } });
  }

  doSubmit = () => {
    console.log(this.state.data);
    // this.props.history.push("/movies");
    this.props.history.push({
      pathname: "/result",
      state: {
        data: this.state.data.projectId,
      },
    });
  };

  render() {
    return (
      <div>
        <h1>New Time Entry</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("hours", "hours")}
          {this.renderInput("minutes", "minutes")}
          {this.renderButton("Submit")}
          {this.renderInput("projectId", "projectId")}
          {this.renderInput("taskId", "taskId")}
          {this.renderInput("tagId", "tagId")}
          {this.renderInput("description", "description")}
        </form>
      </div>
    );
  }
}

export default TimeEntryForm;
