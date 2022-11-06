import React, { Component } from "react";
import axios from 'axios'
import Result from './Results'
import './css/Result.css'
import Label from './Label'
import "./css/styles.css";
import API from '../api';
import { withRouter } from 'react-router';


class SearchResultDisplay extends Component{

  constructor(props) {
    super(props);
    this.state = {
      input: this.props.location.state.input,
      results: [],
      minors: {
          "Artificial Intelligence": false, 
          "Advanced Manufactoring": false, 
          "Bioengineering": false, 
          "Environmental Enginering": false, 
          "Sustainable Energy": false, 
          "Engineering Business": false, 
          "Biomedical Engineering": false, 
          "Nanoengineering": false, 
          "Music Performance": false
        }
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMinorChange = this.handleMinorChange.bind(this);
    this.handleMinorSubmit = this.handleMinorSubmit.bind(this);
  }

  componentDidMount(){
    this.getData(this.state.input)
  }

  handleChange(event) {
    this.setState({input: event.target.value})
  }

  handleSubmit(event) {
    event.preventDefault();
    this.getData(this.state.input)
  }

  handleMinorChange(event) {
    const val = event.target.checked;
    const name = event.target.name;
    let newState = Object.assign({}, this.state.minors, {[name]: val});
    this.setState({'minors': newState})
  }

  handleMinorSubmit(event) {
    event.preventDefault();
    console.log("Checked boxes: ", this.state.minors)
  }

  renderMinors() {
    const EngineeringMinors = 
    ["Artificial Intelligence", 
    "Advanced Manufactoring", 
    "Bioengineering", 
    "Environmental Enginering", 
    "Sustainable Energy", 
    "Engineering Business", 
    "Biomedical Engineering", 
    "Nanoengineering", 
    "Music Performance"]

    return EngineeringMinors.map((minor, index) => {
      return (
        <ul style={{padding: 0}}>
          <label key={index}>   
            <input
              type="checkbox"
              name={minor}
              onChange={this.handleMinorChange}
              value={this.state.minors[minor]}
          />
          {minor}
          </label>
        </ul>
      )
    })
  }

  getData = (input) => {
    API.get(`/searchc?input=${input}`)
      .then(res => {
        if (res.status === 200) {
          this.setState({results: []})
          if (res.data != null) {
            console.log(res.data.length)
            if (res.data.length > 0) {
              let len = res.data.length
              let result_temp = []
              result_temp.push(<Label></Label>)
              for (let i = 0; i < len; i++) {
                  result_temp.push(<Result key={res.data[i]._id} 
                                    course_code={res.data[i].code} 
                                    course_name={res.data[i].name} 
                                    course_description={res.data[i].description}
                                    division={res.data[i].division}
                                    department={res.data[i].department}></Result>)
              }
              this.setState({results: result_temp})
            } 
            else
              if (res.data.length === 0) {
                alert("Course not found")
              }
              else {
                let result_temp = []
                result_temp.push(<Label></Label>)
                result_temp.push(<Result key={res.data._id} 
                                    course_code={res.data.code} 
                                    course_name={res.data.name} 
                                    division={res.data.division}
                                    department={res.data.department}></Result>)
                this.setState({results: result_temp})
              }
            } else {
              alert("Course not found")
            }
        } else if (res.status === 400) {
          alert("System Error. Please refresh")
        }
    })
  }

  render(){
    return (
      <div className={"SearchQuery"}>
        <div style={{ marginTop: "5%" }}>
            <h1> Aevo</h1>
            <br></br>
        </div>

        <div className={"left-sidebar"} >
        <br></br>
          <p>Search for courses by entering the beginning of any course codes (ECE, MIE, CSC...etc) or by keywords.</p>
          <p>Additionally, use a delimiter (;) to filter by both keyword and course code </p>
            <form onSubmit={this.handleSubmit} className={"search"} id={"search-results"}>
                <input placeholder={"Search for course code"} className={"text-input small-search"} type="text" value={this.state.input} onChange={this.handleChange} />
                <input type="submit" value="Search" className={"submit-button"}/>
            </form>

        
             <div className={"minors-list"}>
              <h4>Engineering Minors</h4>
                <form onSubmit={this.handleMinorSubmit}>
                  {this.renderMinors()}
                  <input type="submit" value="Filter" className="submit-button"/>
                </form>

            </div> 
        </div>
        <div className={"search-result-display"} >
            {this.state.results}
        </div>

       
      </div>
    );
  }


  
}

export default withRouter(SearchResultDisplay)