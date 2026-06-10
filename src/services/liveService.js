import api from "./api";

/**
 * Fetch the Agora streaming token from the backend.
 * Update the endpoint URL here if your backend uses a different path!
 * 
 * @param {string} channelName The name of the stream/channel
 * @returns {Promise<string>} The Agora token
 */
export const fetchStreamingToken = async (channelName) => {
  const response = await api.get("/streaming/token", {
    params: { 
      channel_name: channelName,
      uid: 0,
      role: 1
    }
  });
  return response.data; // The string token
};

/**
 * Manually kill a streaming session.
 * Call this when the user explicitly ends their stream.
 */
export const killStreamSession = async (channelName) => {
  const response = await api.post("/streaming/kill-session", null, {
    params: { channel_name: channelName }
  });
  return response.data;
};
