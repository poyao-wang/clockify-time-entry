const axios = require("axios").default;
const config = require("../config.json");

axios.defaults.baseURL = config.axiosBaseURL;

class TaskServices {
  constructor(apiKey, workspaceId, projectId) {
    this.apiKey = apiKey;
    this.workspaceId = workspaceId;
    this.projectId = projectId;
    this.headerDefault = { headers: { "X-Api-Key": apiKey } };
  }

  async postNew(task) {
    try {
      const body = task;
      const header = this.headerDefault;
      const url = `/workspaces/${this.workspaceId}/projects/${this.projectId}/tasks`;

      const result = await axios.post(url, body, header);

      return result.data;
    } catch (error) {
      throw error;
    }
  }

  async getAll() {
    try {
      const header = this.headerDefault;
      const url = `/workspaces/${this.workspaceId}/projects/${this.projectId}/tasks`;

      const result = await axios.get(url, header);

      return result.data;
    } catch (error) {
      throw error;
    }
  }

  async getByName(name) {
    try {
      const header = this.headerDefault;
      const url = `/workspaces/${this.workspaceId}/projects/${this.projectId}/tasks?name=${name}`;

      const result = await axios.get(url, header);
      if (result.data[0] && result.data[0].name === name) return result.data[0];
      const error = new Error("nameDoesNotMatch");
      error.response = { status: 400, data: { message: "nameDoesNotMatch" } };
      throw error;
    } catch (error) {
      throw error;
    }
  }

  async deleteById(taskId) {
    try {
      const url = `/workspaces/${this.workspaceId}/projects/${this.projectId}/tasks/${taskId}`;
      const header = this.headerDefault;

      const result = await axios.delete(url, header);
      return result.data;
    } catch (error) {
      throw error;
    }
  }

  async putById(taskId, task) {
    try {
      const body = task;
      const url = `/workspaces/${this.workspaceId}/projects/${this.projectId}/tasks/${taskId}`;
      const header = this.headerDefault;

      const result = await axios.put(url, body, header);
      return result.data;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TaskServices;
