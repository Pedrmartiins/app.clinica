import axios from "axios";

const api = axios.create({
  baseURL: "http://10.110.12.15", 
  
});

export default api;