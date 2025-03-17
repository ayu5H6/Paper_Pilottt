import axios from "axios";

const API_URL = "http://localhost:5000/api/gemini";  // Backend URL

export const getGeminiResponse = async (question) => {
  try {
    const response = await axios.post(API_URL, { question });
    return response.data.result;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return "Error processing request";
  }
};
