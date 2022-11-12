import React, { Component } from 'react';
import axios from 'axios'
import './css/form.css'
import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import API from '../api';


class AddCourseForm extends Component{

    constructor() {
        super();
        this.state = {
            action: "",
            course_code: "",
            course_name: "",
            division: "",
            department: "",
            course_description: "",
            prerequisites: "",
            corequisites: "",
            exclusions: "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
        this.postData(this.state)
        console.log("inhandelsubmit", this.state)
    }

    postData= (input) => {
        console.log("in postdata", input)
        API.post(`/admin`,{input})
        .then((response) => {
            console.log("api success",response);
            alert("Success: ");
        }).catch((error) => {
            console.log("api error",JSON.stringify(error));
            console.log("api error",error.response);
            alert("Error: " + error.response.data['error']);

        });
    
    }
    render(){
        return (
          <div className="CourseForm"> 
            <h1> Education Pathways: Course Changes</h1>
            <br></br>

            <form onSubmit={this.handleSubmit} className={"modify"}>
                <Row>
                    <label>Course Code</label>
                    <textarea required name="course_code" placeholder={"Enter Course Code"} className={"input-area"} value={this.state.course_code} onChange={this.handleChange} />
                    
                </Row>

                <Row>
                    <label>Course Name</label>
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
                    <textarea name="course_description" required placeholder={"Enter Course Description"} className={"input-area"} value={this.state.course_description} onChange={this.handleChange} />
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

                <input type="submit" value="Submit" className={"submit-button"}/>
            </form>
    
           
          </div>
        );
      }

}

export default AddCourseForm;