import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, useLocation } from "react-router-dom";
import axios from 'axios'
import './css/form.css'
import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import API from '../api';


class EditCourseForm extends Component{
    
    constructor(props) {
        super(props);
        this.state = {
        
            action: "edit",
            index: this.props.location.state.input.index,
            course_code: this.props.location.state.input.course_code,
            course_name: this.props.location.state.input.course_name,
            division: this.props.location.state.input.division,
            department: this.props.location.state.input.department,
            course_description: this.props.location.state.input.course_description,
            /*prerequisites: this.props.location.state.input.prerequisites,
            corequisites: this.props.location.state.input.corequisites,
            exclusions: this.props.location.state.input.exclusions,*/
            prerequisites: (JSON.parse(this.props.location.state.input.prerequisites.replace(/'/g, '"'))).toString(),
            corequisites: (JSON.parse(this.props.location.state.input.corequisites.replace(/'/g, '"'))).toString(),
            exclusions: (JSON.parse(this.props.location.state.input.exclusions.replace(/'/g, '"'))).toString(),
            msg: "",
            status: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        console.log("in constructor"+JSON.stringify(this.props.location.state.input));
        console.log(typeof this.state.prerequisites);
        console.log(this.state.prerequisites);

        /*
        let temp_prereq=(JSON.parse(this.state.prerequisites.replace(/'/g, '"'))).toString();
        let temp_coreq=(JSON.parse(this.state.corequisites.replace(/'/g, '"'))).toString();
        let temp_exclusions=(JSON.parse(this.state.exclusions.replace(/'/g, '"'))).toString();

        console.log("in from "+this.state.course_code + " "+ this.state.prerequisites+" "+typeof this.state.prerequisite+" "+temp_prereq +" "+ typeof temp_prereq);
        console.log("in from "+this.state.course_code + " "+ this.props.location.state.input.corequisites+" "+typeof this.state.corequisites+" "+temp_coreq +" "+ typeof temp_coreq);
        console.log("in from "+this.state.course_code + " "+ this.props.location.state.input.exclusions+" "+typeof this.state.exclusions+" "+temp_exclusions +" "+ typeof temp_exclusions);
        */
    }

    handleChange(event) {
        const value = event.target.value;
        this.setState({
            //course_code: event.target.value
            ...this.state,
            [event.target.name]: value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.postData(this.state);
        console.log("inhandelsubmit", this.state);
        console.log(typeof this.state.prerequisites);
        console.log(this.state.prerequisites);
    }
    
    
    postData= (input) => {
        

        console.log("in postdata", input)
        API.post(`/admin/edit`,{input})
        .then((response) => {
            console.log("api success",response);
            alert("Success: Course modified");
            this.status="Success";
            this.msg=response.data;
        }).catch((error) => {
            console.log("api error",JSON.stringify(error));
            console.log("api error",error.response);
            alert("Error: " + error.response.data['error']);
            this.status="Error";
            this.msg=error.response.data['error'];

        });
    
    }
    render(){
        return (
          <div className="CourseForm"> 

            <Row>
            <Col><Link to="/admin/add"><button className={"submit-button"} type="button">Add</button></Link></Col>
            <Col><Link to="/admin/search"><button className={"submit-button"} type="button">Edit</button></Link></Col>
            <Col><Link to="/admin/search"><button className={"submit-button"} type="button">Delete</button></Link></Col>
            </Row>

            <h1> Education Pathways: Edit Course</h1>
            <br></br>

            <form onSubmit={this.handleSubmit} className={"modify"}>
                <Row>
                    <label>Course Code<span class="req">*</span></label>
                    <textarea required name="course_code" placeholder={"Enter Course Code"} className={"input-area"} value={this.state.course_code} onChange={this.handleChange} />
                    
                </Row>

                <Row>
                    <label>Course Name<span class="req">*</span></label>
                    <textarea required name="course_name" placeholder={"Enter Course Name"} className={"input-area"} value={this.state.course_name} onChange={this.handleChange} />
                </Row>

                <Row>
                    <label>Division</label>
                    <textarea name="division" placeholder={"Enter Course Division"} className={"input-area"} value={this.state.division} onChange={this.handleChange} />
                </Row>

                <Row>
                    <label>Department</label>
                    <textarea name="department" placeholder={"Enter Course Department"} className={"input-area"} value={this.state.department} onChange={this.handleChange} />
                </Row>

                <Row>
                    <label>Course Description</label>
                    <textarea name="course_description" placeholder={"Enter Course Description"} className={"input-area"} value={this.state.course_description} onChange={this.handleChange} />
                </Row>

                <Row>
                    <label>Pre-Requisites (comma seperated)</label>
                    <textarea name="prerequisites" placeholder={"Enter comma seperated Course Pre-Requisites. Example: course1, course2, course3"} className={"input-area"} value={this.state.prerequisites} onChange={this.handleChange} />
                </Row>

                <Row>
                    <label>Co-Requisites (comma seperated)</label>
                    <textarea name="corequisites"  placeholder={"Enter comma seperated Course Co-Requisites. Example: course1, course2, course3"} className={"input-area"} value={this.state.corequisites} onChange={this.handleChange} />
                </Row>

                <Row>
                    <label>Exclusions (comma seperated)</label>
                    <textarea name="exclusions" placeholder={"Enter comma seperated Course Exclusions. Example: course1, course2, course3"} className={"input-area"} value={this.state.exclusions} onChange={this.handleChange} />
                </Row>

                <p><span class="req">*</span> - Required field</p>
                <input type="submit" value="Submit" className={"submit-button"}/>

                { this.status=="Success" ? (
                <h4>Success: {JSON.stringify(this.msg)}</h4>
                ) : this.status == "Error" ? (
                <h4>Error: {JSON.stringify(this.msg)}</h4>
                ) : (
                    <h4></h4>
                )}
            </form>
    
           
          </div>
        );
      }

}

export default EditCourseForm;