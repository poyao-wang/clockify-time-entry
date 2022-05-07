import Joi from "joi";
import queryString from "query-string";
import React, { FormEvent, useEffect, useState } from "react";

import TimeEntryServices from "../services/TimeEntryServices";

import config from "../config.json";
import Select, { OptionProps } from "./common/Select";
import Input from "./common/Input";
import { RouteComponentProps } from "react-router-dom";
import { AxiosError } from "axios";

const apiKey = config.apiKey;
const workspaceId = config.workspaceId;
const userId = config.userId;

const service = new TimeEntryServices(apiKey, workspaceId, userId);

type Errors = {
  projectId?: any;
  taskId?: any;
  tagId?: any;
  description?: any;
  hours?: any;
  minutes?: any;
};

interface Data {
  projectId: string | string[] | null;
  taskId: string | string[] | null;
  tagId: string | string[] | null;
  description: string | string[] | null;
  hours: number;
  minutes: number;
}

interface State {
  data: Data;
  errors: Errors;
}

const TimeEntryForm: React.FC<RouteComponentProps> = (props) => {
  const {
    projectId: projectIdInit,
    taskId: taskIdInit,
    tagId: tagIdInit,
    description: descriptionInit,
  } = queryString.parse(props.location.search);

  const schema: Joi.ObjectSchema<{
    projectId: Joi.StringSchema;
    taskId: Joi.StringSchema;
    tagId: Joi.StringSchema;
    description: Joi.StringSchema;
    hours: Joi.NumberSchema;
    minutes: Joi.NumberSchema;
  }> = Joi.object({
    projectId: Joi.string().optional(),
    taskId: Joi.string().optional(),
    tagId: Joi.string().optional(),
    description: Joi.string().optional(),
    hours: Joi.number().required(),
    minutes: Joi.number().required(),
  });

  const [state, setState] = useState<State>({
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

  const [timeLoaded, setTimeLoaded] = useState(
    new Date(new Date().setSeconds(0, 0))
  );
  const timeLoadedYear = timeLoaded.getFullYear();
  const timeLoadedMonth = timeLoaded.getMonth();
  const timeLoadedDate = timeLoaded.getDate();
  const timeLoadedHours = timeLoaded.getHours();
  const timeLoadedMinutes = timeLoaded.getMinutes();

  const [entryStartTime, setEntryStartTime] = useState(timeLoaded);
  const [rollBackHours, setRollBackHours] = useState(0);
  const [rollBackMinutes, setRollBackMinutes] = useState(0);

  const validate = () => {
    const { error } = schema.validate(state.data);
    if (!error) return null;

    const errors: Errors = {};
    for (let item of error.details)
      errors[item.path[0] as keyof Errors] = item.message;

    return errors;
  };

  const validateProperty = ({ name, value }: { name: string; value: any }) => {
    const obj = { [name]: value };
    const propSchema = schema.extract(name);

    if (name === "hours") setRollBackHours(value);
    if (name === "minutes") setRollBackMinutes(value);

    if (Joi.isSchema(propSchema)) {
      const validateResult = propSchema.validate(obj[name]);
      return validateResult.error
        ? validateResult.error.details[0].message
        : null;
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const errors = validate();
    // setState({ errors: errors || {} });
    if (errors) {
      state.errors = errors;
      setState(state);
      return;
    }

    doSubmit();
  };

  const handleChange = ({ currentTarget: input }: any) => {
    const errors = { ...state.errors };
    const errorMessage = validateProperty(input);
    if (errorMessage) errors[input.name as keyof Errors] = errorMessage;
    else delete errors[input.name as keyof Errors];
    const data = { ...state.data };
    data[input.name as keyof Errors] = input.value;
    setState({ data, errors });
  };

  const renderButton = (label: string) => {
    const errorExists = validate();

    let disabled: boolean;

    if (errorExists) {
      disabled = true;
    } else {
      disabled = false;
    }

    return (
      <button disabled={disabled} className="btn btn-primary">
        {label}
      </button>
    );
  };

  const renderSelect = (
    name: keyof Data,
    label: keyof Data,
    options: OptionProps[]
  ) => {
    const { data, errors } = state;

    let value: string | number | string[] | null;

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

  const renderInput = (name: keyof Data, label: keyof Data, type = "text") => {
    const { data, errors } = state;

    let value;

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

    const description = data.description;
    const tagIds = [data.tagId];
    const projectId = data.projectId;
    const taskId = data.taskId;
    const start = entryStartTime;
    const timeEntry = { start, description, projectId, taskId, tagIds };
    let resultCurrent = {};
    let resultNew;

    function isAxiosError(candidate: any): candidate is AxiosError {
      return candidate.isAxiosError === true;
    }

    try {
      resultCurrent = await service.stopCurrent({ end: start });
    } catch (error) {
      if (isAxiosError(error) && error) {
        resultCurrent = {
          status: error.response?.status,
          data: error.response?.data,
        };
      }
    }

    try {
      resultNew = await service.postNew(timeEntry);
    } catch (error) {
      if (isAxiosError(error) && error) {
        resultNew = {
          status: error.response?.status,
          data: error.response?.data,
        };
      }
    }

    const result = { current: resultCurrent, new: resultNew };

    props.history.push({
      pathname: "/result",
      state: {
        data: result,
      },
    });
  };

  const createArrayForOptions = (amt: number) => {
    let arrayOptions = [];
    for (let i = 0; i < amt; i++) {
      arrayOptions[i] = { _id: i, name: i, value: i };
    }

    return arrayOptions;
  };

  const optionsHours = createArrayForOptions(25);
  const optionsMinutes = createArrayForOptions(60);

  useEffect(() => {
    const minutes = rollBackHours * 60 + rollBackMinutes;
    const newEntryTimeStamp = timeLoaded.valueOf() - minutes * 60 * 1000;
    const newEntryDate = new Date(newEntryTimeStamp);

    setEntryStartTime(newEntryDate);
  }, [rollBackHours, rollBackMinutes]);

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
        <div>
          {timeLoadedYear}/{timeLoadedMonth}/{timeLoadedDate} {timeLoadedHours}:
          {timeLoadedMinutes}
        </div>
        <div>{timeLoaded.toLocaleString()}</div>
        <div>{entryStartTime.toLocaleString()}</div>
        <div>rollBackMinutes: {rollBackMinutes}</div>
        <div>rollBackHours: {rollBackHours}</div>
      </form>
    </div>
  );
};

export default TimeEntryForm;
