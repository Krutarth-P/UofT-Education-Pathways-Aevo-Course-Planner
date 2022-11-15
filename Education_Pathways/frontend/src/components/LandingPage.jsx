import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Link, useLocation } from "react-router-dom";
import axios from 'axios'
import Result from './Results'
import './css/Result.css'
import Label from './Label'
import "./css/styles.css";
import API from '../api';
import ResultDisplay from './ResultDisplay';
import { withRouter } from 'react-router';
import searchIcon from './img/search.png';
import minorIcon from './img/minors.svg';
import timetableIcon from './img/timetable.png';


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
      <div>
        <div className="landing-banner">
          <div className={"SearchQuery"}>
            <div style={{ marginTop: "10%" }}>
                <h1>Welcome to Aevo</h1>
                <h6>Search for courses by entering the beginning of any course codes (ECE, MIE...etc) and/or by keywords using delimiters.<br></br>
          Use delimiters ;ti:keyword, ;de:keyword, to search for keywords in course titles and/or descriptions respectively.</h6>

            <form onSubmit={this.handleSubmit} className={"search"}>
                    <input placeholder={"Search for course code"} className={"text-input"} type="text" value={this.state.input} onChange={this.handleChange} />
                    <input type="submit" value="Search" className={"submit-button"}/>
            </form>
            
            </div>
          </div>
        </div>
        <div style={{backgroundColor: "#f9f9f9"}}>
          <br/>
          <div class="landing-card-row">
            
            <div class="landing-card-column">  
            <Link to="/" style={{textDecoration:"none"}}>
              <div class="landing-card">
                <img src={searchIcon} alt="search" style={{height:"30%", marginBottom:"15px"}}/>
                <h3>Course Search</h3>
                <p>Search from thousands of courses from all departments.</p>
              </div>            
            </Link>
            </div>
            
            <div class="landing-card-column">
            <Link to="/minors-certificates" style={{textDecoration:"none"}}>
              <div class="landing-card">
                <img src={minorIcon} alt="minors" style={{height:"30%", marginBottom:"15px"}}/>
                <h3>Minors and Certificates</h3>
                <p>Find out what you need to obtain your desired minor.</p>
              </div>
            </Link>
            </div>
            
            <div class="landing-card-column">
            <Link to="/timetable-builder" style={{textDecoration:"none"}}>
              <div class="landing-card">
                <img src={timetableIcon} alt="timetable" style={{height:"30%", marginBottom:"15px"}}/>
                <h3>Timetable Builder</h3>
                <p>Generate next semester's timetable here at Aevo.</p>
              </div>
            </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(LandingPage);
