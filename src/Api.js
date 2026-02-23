// api.js
import axios from "axios";

export default axios.create({
  baseURL: "https://hirenova-production.up.railway.app",
});