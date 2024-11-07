import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const apiKey = process.env.GPT_API_KEY;

const assistant_id = process.env.GPT_ASSISTANT_ID;

export const openai = new OpenAI({ apiKey: apiKey });

// Function to make a new thread.
// There are a large number of options/customization,
// so moving this to another function for future customization.
export const createNewThread = async () => {
  const thread = await openai.beta.threads.create();
  return thread;
};

// Function to post a new message to an existing thread by threadId.
// There are a large number of options/customization,
// so moving this to another function for future customization.
export const postNewMessageToThread = async (threadId, message) => {
  const messageResponse = await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: message,
  });
};

// Function to get an existing thread by threadId.
// There are a large number of options/customization,
// so moving this to another function for future customization.
export const getExistingThread = async (threadId) => {
  const thread = await openai.beta.threads.retrieve(threadId);
};

// Function to delete and existing thread. Do we need?
export const deleteExistingThread = async (threadId) => {
  const response = await openai.beta.threads.del(threadId);
};

// Function to grab the assistantID.
export const getAssistantId = () => {
  return assistant_id;
};
