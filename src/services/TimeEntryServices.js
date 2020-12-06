const axios = require("axios").default;
const config = require("../config.json");

axios.defaults.baseURL = config.axiosBaseURL;

class TimeEntryServices {
  constructor(apiKey, workspaceId, userId) {
    this.apiKey = apiKey;
    this.workspaceId = workspaceId;
    this.userId = userId;
    this.headerDefault = { headers: { "X-Api-Key": apiKey } };
  }
  async postNew(timeEntry) {
    try {
      const body = timeEntry;
      const header = this.headerDefault;
      const url = `/workspaces/${this.workspaceId}/time-entries`;

      const result = await axios.post(url, body, header);

      return result.data;
    } catch (error) {
      throw error;
    }
  }

  async stopCurrent(timeEntry) {
    try {
      const body = timeEntry;
      const header = this.headerDefault;
      const url = `/workspaces/${this.workspaceId}/user/${this.userId}/time-entries`;

      const result = await axios.patch(url, body, header);

      return result.data;
    } catch (error) {
      throw error;
    }
  }
}

// module.exports = TimeEntryServices;
export default TimeEntryServices;
