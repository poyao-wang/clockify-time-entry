import Joi from "joi-browser";
import queryString from "query-string";
import React, { Component } from "react";

import Form from "./common/form";
import TimeEntryServices from "../services/TimeEntryServices";

import config from "../config.json";

const apiKey = config.apiKey;
const workspaceId = config.workspaceId;
const userId = config.userId;

const service = new TimeEntryServices(apiKey, workspaceId, userId);

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
    projectId: Joi.string().optional(),
    taskId: Joi.string().optional(),
    tagId: Joi.string().optional(),
    description: Joi.optional(),
    hours: Joi.number().required(),
    minutes: Joi.number().required(),
  };

  componentDidMount() {
    const query = queryString.parse(this.props.location.search);
    const projectId = query.projectId;
    const taskId = query.taskId;
    const tagId = query.tagId;
    const description = query.description;
    const hours = 0;
    const minutes = 0;

    this.setState({
      data: { projectId, taskId, tagId, description, hours, minutes },
    });
  }

  doSubmit = async () => {
    const data = this.state.data;
    let rollBackMinutes = data.hours * 60 + data.minutes;

    let rollback = false;
    if (rollBackMinutes) rollback = true;

    const now = new Date().setSeconds(0, 0);

    const description = data.description;
    const tagIds = [data.tagId];
    const projectId = data.projectId;
    const taskId = data.taskId;
    const start = new Date(now - rollBackMinutes * 60 * 1000);
    const timeEntry = { start, description, projectId, taskId, tagIds };
    let resultCurrent = {};
    let resultNew;

    try {
      if (rollback) resultCurrent = await service.stopCurrent({ end: start });
      else resultCurrent.data = "roll back = 0";
    } catch (error) {
      console.log(error);
      resultCurrent = {
        status: error.response.status,
        data: error.response.data,
      };
    }

    try {
      resultNew = await service.postNew(timeEntry);
    } catch (error) {
      resultNew = {
        status: error.response.status,
        data: error.response.data,
      };
    }

    const result = { current: resultCurrent, new: resultNew };

    console.log(this.state.data);

    this.props.history.push({
      pathname: "/result",
      state: {
        data: result,
      },
    });
  };

  render() {
    return (
      <div>
        <h1>New Time Entry</h1>
        <form onSubmit={this.handleSubmit}>
          <div className="m-2">{this.renderButton("Submit")}</div>
          {this.renderInput("hours", "hours")}
          {this.renderInput("minutes", "minutes")}
          {this.renderInput("description", "description")}
          {this.renderInput("projectId", "projectId")}
          {this.renderInput("taskId", "taskId")}
          {this.renderInput("tagId", "tagId")}
        </form>
      </div>
    );
  }
}

export default TimeEntryForm;
