const axios = require("axios").default;
const config = require("../config.json");

axios.defaults.baseURL = config.axiosBaseURL;

class ProjectServices {
  constructor(apiKey, workspaceId) {
    this.apiKey = apiKey;
    this.workspaceId = workspaceId;
    this.headerDefault = { headers: { "X-Api-Key": apiKey } };
  }

  async postNew(project) {
    try {
      const body = project;
      const header = this.headerDefault;
      const url = `/workspaces/${this.workspaceId}/projects`;

      const result = await axios.post(url, body, header);

      return result.data;
    } catch (error) {
      throw error;
    }
  }

  async getAll() {
    try {
      const header = this.headerDefault;
      const url = `/workspaces/${this.workspaceId}/projects`;

      const result = await axios.get(url, header);

      return result.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteById(projectId) {
    try {
      const url = `/workspaces/${this.workspaceId}/projects/${projectId}`;
      const header = this.headerDefault;

      const result = await axios.delete(url, header);
      return result.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteAll() {
    try {
      const resultGetAll = await axios.get(
        `https://api.clockify.me/api/v1/workspaces/${this.workspaceId}/projects`,
        this.headerDefault
      );
      const projects = resultGetAll.data;
      const header = this.headerDefault;

      await Promise.all(
        projects.map(async ({ id }) => {
          const url = `/workspaces/${this.workspaceId}/projects/${id}`;
          await axios.delete(url, header);
        })
      );
    } catch (error) {
      throw error;
    }
  }

  async getByName(name) {
    try {
      const header = this.headerDefault;
      const url = `/workspaces/${this.workspaceId}/projects?name=${name}`;

      const result = await axios.get(url, header);
      if (result.data[0].name === name) return result.data[0];
      const error = new Error("nameDoesNotMatch");
      error.response = { status: 400, data: { message: "nameDoesNotMatch" } };

      throw error;
    } catch (error) {
      throw error;
    }
  }

  async putById(projectId, project) {
    try {
      const body = project;
      const header = this.headerDefault;
      const url = `/workspaces/${this.workspaceId}/projects/${projectId}`;

      const result = await axios.put(url, body, header);

      return result.data;
    } catch (error) {
      throw error;
    }
  }
}

// module.exports = ProjectServices;
export default ProjectServices;
