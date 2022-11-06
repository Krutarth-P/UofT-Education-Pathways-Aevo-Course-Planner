import React, { Component } from "react";
import axios from 'axios'
import Result from './Results'
import './css/Result.css'
import Label from './Label'
import "./css/styles.css";
import API from '../api';
import ResultDisplay from './ResultDisplay';
import { withRouter } from 'react-router';


class LandingPage extends Component{

  constructor(props) {
    super(props);
    this.state = {
      input: "",
      results: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({input: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.redirectQuery();
  }

  redirectQuery = () => {
    this.props.history.push('/search', {input: this.state.input})
  }


  render(){
    return (
      <div className={"SearchQuery"}>
        <div style={{ marginTop: "10%" }}>
            <h1> Aevo</h1>
            <br></br>

        <form onSubmit={this.handleSubmit} className={"search"}>
                <input placeholder={"Search for course code"} className={"text-input"} type="text" value={this.state.input} onChange={this.handleChange} />
                <input type="submit" value="Search" className={"submit-button"}/>
            </form>
        </div>
       
      </div>
    );
  }
  
}

export default withRouter(LandingPage);
