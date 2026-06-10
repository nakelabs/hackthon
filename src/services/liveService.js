import api from "./api";

/**
 * Start a livestream session (Host only).
 * @param {Object} data { channel_name, description, category_id }
 * @returns {Promise<Object>} { livestream, token }
 */
export const startLivestream = async (data) => {
  const response = await api.post("/streaming/start", data);
  return response.data;
};

/**
 * Fetch the Agora streaming token from the backend (Viewer only).
 * 
 * @param {string} channelName The name of the stream/channel
 * @returns {Promise<string>} The Agora token
 */
export const fetchStreamingToken = async (channelName) => {
  const response = await api.get("/streaming/token", {
    params: { channel_name: channelName }
  });
  return response.data;
};

export const getLiveStreams = async () => {
  const response = await api.get("/streaming/live");
  return response.data; // Array of live stream objects
};

/**
 * Manually end a streaming session (Host only).
 */
export const endStreamSession = async (channelName) => {
  const response = await api.post("/streaming/end", null, {
    params: { channel_name: channelName }
  });
  return response.data;
};
