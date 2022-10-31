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
      results: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){
    this.getData(this.state.input)
  }

  handleChange(event) {
    this.setState({input: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.getData(this.state.input)
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
        <div style={{ marginTop: "3%" }}>
            <h1> Education Pathways</h1>
            <br></br>
        </div>

        <div className={"left-sidebar"} >
          <p>You can use a delimiter to search blah blah</p>
            <form onSubmit={this.handleSubmit} className={"search"}>
                <input placeholder={"Search for course code"} className={"text-input small-search"} type="text" value={this.state.input} onChange={this.handleChange} />
                <input type="submit" value="Search" className={"submit-button"}/>
            </form>
        
            <div className={"minors-list"}>
              <h4>Engineering Minors</h4>
                <ul>
                  <li><input type="checkbox"></input> checkbox 1</li>
                  <li><input type="checkbox"></input> checkbox 2</li>
                  <li><input type="checkbox"></input> checkbox 3</li>
                  <li><input type="checkbox"></input> checkbox 4</li>
                </ul>
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