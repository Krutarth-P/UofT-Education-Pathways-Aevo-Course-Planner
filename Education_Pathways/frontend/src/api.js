import axios from 'axios';

export default axios.create({
  //baseURL: "https://lab3-docker.herokuapp.com/"
  baseURL: "http://localhost:5050/" 
  // USE PORT 5050 BC 5000 IS BUGGY
});