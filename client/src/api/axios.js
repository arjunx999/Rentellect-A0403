import axios from "axios";

const instance = axios.create({
  baseURL: "https://rentellect-a0403.onrender.com",
  withCredentials: true,
});

export default instance;
