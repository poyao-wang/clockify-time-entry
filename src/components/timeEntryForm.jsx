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
    let rollBackMinutes = parseInt(data.hours) * 60 + parseInt(data.minutes);

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

  createArrayForOptions = (amt) => {
    let arrayOptions = [];
    for (let i = 0; i < amt; i++) {
      arrayOptions[i] = { _id: i, name: i };
    }

    return arrayOptions;
  };

  render() {
    const optionsHours = this.createArrayForOptions(25);
    const optionsMinutes = this.createArrayForOptions(60);

    return (
      <div>
        <h1>New Time Entry</h1>
        <form onSubmit={this.handleSubmit}>
          <div className="m-2">{this.renderButton("Submit")}</div>
          <div className="container">
            <div className="row">
              <div className="col">
                {" "}
                {this.renderSelect("hours", "hours", optionsHours)}
              </div>
              <div className="col">
                {" "}
                {this.renderSelect("minutes", "minutes", optionsMinutes)}
              </div>
            </div>
            <div className="row">
              <div className="col">
                {this.renderInput("description", "description")}
              </div>
            </div>
            <div className="row">
              <div className="col">
                {this.renderInput("projectId", "projectId")}
              </div>
              <div className="col">{this.renderInput("taskId", "taskId")}</div>
              <div className="col">{this.renderInput("tagId", "tagId")}</div>
            </div>
          </div>
          {/* {this.renderInput("hours", "hours")}
          {this.renderInput("minutes", "minutes")} */}
        </form>
      </div>
    );
  }
}

export default TimeEntryForm;
