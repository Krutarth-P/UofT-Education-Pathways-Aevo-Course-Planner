import axios from 'axios';

export default axios.create({
  baseURL: "https://ece444-group21-project1-aevo.herokuapp.com/"
  // baseURL: "http://localhost:5050/" 
});