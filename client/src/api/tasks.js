import axios from "./axios";

export const getTasksRequest = async () => axios.get("/tasks");

export const createTaskRequest = async (task) => axios.post("/tasks", task);

export const updateTaskRequest = async (id, task) =>
  axios.put(`/tasks/${id}`, task);

export const deleteTaskRequest = async (id) => axios.delete(`/tasks/${id}`);

export const getTaskRequest = async (id) => axios.get(`/tasks/${id}`);


export const getOthersTasksRequest = async () => axios.get("/tasks/others");

export const togglePromotionRequest = async (id, data) => axios.patch(`/tasks/${id}/promotion`, data);

export const getPromotedTasksRequest = async () =>  axios.get("/tasks/promoted");