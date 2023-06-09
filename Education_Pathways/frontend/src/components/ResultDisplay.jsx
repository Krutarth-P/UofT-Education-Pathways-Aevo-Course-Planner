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
      result_courses: [],
      minors: {
          "Artificial Intelligence": false, 
          "Robotics & Mechatronics":false,
          "Advanced Manufacturing": false, 
          "Bioengineering": false, 
          "Environmental Engineering": false, 
          "Sustainable Energy": false, 
          "Engineering Business": false, 
          "Global Leadership": false, 
          "Nanoengineering": false, 
          "Music Performance": false
        },
      minor_courses: {
          "Artificial Intelligence": [], 
          "Robotics & Mechatronics":[],
          "Advanced Manufacturing": [], 
          "Bioengineering": [], 
          "Environmental Engineering": [], 
          "Sustainable Energy": [], 
          "Engineering Business": [], 
          "Global Leadership": [], 
          "Nanoengineering": [], 
          "Music Performance":[] 
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
    // when minor filter is checked and filter button is pressed process existing search results to filter for results that are applicable to selected minor(s)
    event.preventDefault();
    let new_results = [<Label></Label>]; //Initialize new result list that will eventually replace current one
    let new_results_code = [];

    for (const [key,val] of Object.entries(this.state.minors)){ // iterate through state variable of minors
      if (val == true) { // If minor is selected/checked by user 
        let len = this.state.result_courses.length;
        for (let i = 1; i < len; i++){ //iterate through results list to modify it, skip first element since its just a label
          let coursecode = this.state.result_courses[i-1];

          if (this.state.minor_courses[key].indexOf(coursecode) > -1){ //if result course code is in eligible minor list
            if (new_results_code.indexOf(coursecode) == -1){ //If new result list doesnt already contain this course
              new_results.push(this.state.results[i])        //push result class of relevant course in new course list
              new_results_code.push(coursecode)              //push string name of course code into an alt list for verification purposes
            }
          }
        }
      }
    }
    console.log("new_results:",new_results)
    console.log("new_results code:",new_results_code)
    this.setState({results:new_results}) //replace current search results with new search results after minor filter
    
  }

  renderMinors() {
    const EngineeringMinors = 
    ["Artificial Intelligence", 
    "Robotics & Mechatronics",
    "Advanced Manufacturing", 
    "Bioengineering", 
    "Environmental Engineering", 
    "Sustainable Energy", 
    "Engineering Business", 
    "Global Leadership", 
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
              //Parse/process attached minor course information from backend response and append them to this.state.minor_courses variable for convenient access
              let minor_AI = Object.assign({}, this.state.minor_courses, {["Artificial Intelligence"]: res.data[0].minor_AI});
              this.setState({'minor_courses': minor_AI})
              let minor_RM = Object.assign({}, this.state.minor_courses, {["Robotics & Mechatronics"]: res.data[0].minor_RM});
              this.setState({'minor_courses': minor_RM})
              let minor_AM = Object.assign({}, this.state.minor_courses, {["Advanced Manufacturing"]: res.data[0].minor_AM});
              this.setState({'minor_courses': minor_AM})
              let minor_Bio = Object.assign({}, this.state.minor_courses, {["Bioengineering"]: res.data[0].minor_Bio});
              this.setState({'minor_courses': minor_Bio})
              let minor_Env = Object.assign({}, this.state.minor_courses, {["Environmental Engineering"]: res.data[0].minor_Env});
              this.setState({'minor_courses': minor_Env})
              let minor_SE = Object.assign({}, this.state.minor_courses, {["Sustainable Energy"]: res.data[0].minor_SE});
              this.setState({'minor_courses': minor_SE})
              let minor_EB = Object.assign({}, this.state.minor_courses, {["Engineering Business"]: res.data[0].minor_EB});
              this.setState({'minor_courses': minor_EB})
              let minor_NANO = Object.assign({}, this.state.minor_courses, {["Nanoengineering"]: res.data[0].minor_NANO});
              this.setState({'minor_courses': minor_NANO})
              let minor_MP = Object.assign({}, this.state.minor_courses, {["Music Performance"]: res.data[0].minor_MP});
              this.setState({'minor_courses': minor_MP})
              let minor_GL = Object.assign({}, this.state.minor_courses, {["Global Leadership"]: res.data[0].minor_GL});
              this.setState({'minor_courses': minor_GL})
              
              console.log(this.state.minor_courses)

              let len = res.data.length
              let result_temp = []
              let result_course_code_temp = []
              result_temp.push(<Label></Label>)
              for (let i = 0; i < len; i++) {
                  result_course_code_temp.push(res.data[i].code.slice(0,-2)) //Remove last two characters of course code to remove H1, Y1...etc endings
                  
                  let eligible_minors = [];
                  // for each query result, loop through minor course list to check if its associated with any minor
                  for (const [key,val] of Object.entries(this.state.minors)){
                    let coursecode = res.data[i].code.slice(0,-2); //remove last two characters so string only contains course code without H1/H5 suffixes
                    if (this.state.minor_courses[key].indexOf(coursecode) > -1){ //if result course code is in an eligible minor list
                      eligible_minors.push(key)       //Push name of minor into corresponding result list to be displayed as part of the result
                      eligible_minors.push(<br></br>) //line break for course with multiple minor affiliations
                    }
                  }
                  if (eligible_minors.length == 0){   // if not part of any engineering minor, display None string
                    eligible_minors.push('None')
                  }
                  let course_term = res.data[i].term
                  if (course_term != null){
                    course_term = course_term.replaceAll("' '", "', '")
                    course_term=course_term.replace("[", "")
                    course_term=course_term.replace("]", "")
                    course_term=course_term.replaceAll("'", "")                               
                    course_term = course_term.split(',');
                  } else {
                    course_term=[]
                  }
     
                  result_temp.push(<Result key={res.data[i]._id} 
                                    course_code={res.data[i].code} 
                                    course_name={res.data[i].name} 
                                    course_description={res.data[i].description}
                                    course_term={course_term}
                                    division={res.data[i].division}
                                    department={res.data[i].department}
                                    eligible_minors = {eligible_minors}>
                                    </Result>)
              }
              this.setState({results: result_temp})
              this.setState({result_courses: result_course_code_temp})
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

        <div className={"left-sidebar"}>
          <p>Search for courses by entering the beginning of any course codes (ECE, MIE...etc) and/or by keywords using delimiters.<br></br>
          Use delimiters ;ti:keyword, ;de:keyword, to search for keywords in course titles and/or descriptions respectively.</p>
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