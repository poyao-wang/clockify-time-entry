import Joi from "joi-browser";
import queryString from "query-string";
import React, { useState } from "react";

import TimeEntryServices from "../services/TimeEntryServices";

import config from "../config.json";
import Select from "./common/Select";
import Input from "./common/Input";

const apiKey = config.apiKey;
const workspaceId = config.workspaceId;
const userId = config.userId;

const service = new TimeEntryServices(apiKey, workspaceId, userId);

const TimeEntryForm = (props) => {
  const {
    projectId: projectIdInit,
    taskId: taskIdInit,
    tagId: tagIdInit,
    description: descriptionInit,
  } = queryString.parse(props.location.search);

  const schema = {
    projectId: Joi.string().optional(),
    taskId: Joi.string().optional(),
    tagId: Joi.string().optional(),
    description: Joi.optional(),
    hours: Joi.number().required(),
    minutes: Joi.number().required(),
  };

  const [state, setState] = useState({
    data: {
      projectId: projectIdInit,
      taskId: taskIdInit,
      tagId: tagIdInit,
      description: descriptionInit,
      hours: 0,
      minutes: 0,
    },
    errors: {},
  });

  const validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(state.data, schema, options);
    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  const validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const localSchema = { [name]: schema[name] };
    const { error } = Joi.validate(obj, localSchema);
    return error ? error.details[0].message : null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validate();
    setState({ errors: errors || {} });
    if (errors) return;

    doSubmit();
  };

  const handleChange = ({ currentTarget: input }) => {
    const errors = { ...state.errors };
    const errorMessage = validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...state.data };
    data[input.name] = input.value;

    setState({ data, errors });
  };

  const renderButton = (label) => {
    return (
      <button disabled={validate()} className="btn btn-primary">
        {label}
      </button>
    );
  };

  const renderSelect = (name, label, options) => {
    const { data, errors } = state;

    let value;

    console.log(data);
    if (data) {
      value = data[name];
    } else {
      value = 0;
    }

    return (
      <Select
        name={name}
        value={value}
        label={label}
        options={options}
        onChange={handleChange}
        error={errors[name]}
      />
    );
  };

  const renderInput = (name, label, type = "text") => {
    const { data, errors } = state;

    let value;

    console.log(data);
    if (data) {
      value = data[name];
    } else {
      value = "";
    }

    return (
      <Input
        type={type}
        name={name}
        value={value}
        label={label}
        onChange={handleChange}
        error={errors[name]}
      />
    );
  };

  const doSubmit = async () => {
    const data = state.data;
    let rollBackMinutes = parseInt(data.hours) * 60 + parseInt(data.minutes);

    // let rollback = false;
    // if (rollBackMinutes) rollback = true;

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
      resultCurrent = await service.stopCurrent({ end: start });
    } catch (error) {
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

    props.history.push({
      pathname: "/result",
      state: {
        data: result,
      },
    });
  };

  const createArrayForOptions = (amt) => {
    let arrayOptions = [];
    for (let i = 0; i < amt; i++) {
      arrayOptions[i] = { _id: i, name: i };
    }

    return arrayOptions;
  };

  const optionsHours = createArrayForOptions(25);
  const optionsMinutes = createArrayForOptions(60);

  return (
    <div>
      <h1>New Time Entry</h1>
      <form onSubmit={handleSubmit}>
        <div className="m-2">{renderButton("Submit")}</div>
        <div className="container">
          <div className="row">
            <div className="col">
              {" "}
              {renderSelect("hours", "hours", optionsHours)}
            </div>
            <div className="col">
              {" "}
              {renderSelect("minutes", "minutes", optionsMinutes)}
            </div>
          </div>
          <div className="row">
            <div className="col">
              {renderInput("description", "description")}
            </div>
          </div>
          <div className="row">
            <div className="col">{renderInput("projectId", "projectId")}</div>
            <div className="col">{renderInput("taskId", "taskId")}</div>
            <div className="col">{renderInput("tagId", "tagId")}</div>
          </div>
        </div>
        {/* {renderInput("hours", "hours")}
          {renderInput("minutes", "minutes")} */}
      </form>
    </div>
  );
};

export default TimeEntryForm;
