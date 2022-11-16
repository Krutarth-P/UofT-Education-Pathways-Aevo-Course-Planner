import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, useLocation } from "react-router-dom";
import axios from 'axios'
import './css/form.css'
import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import API from '../api';


class DeleteCourseForm extends Component {

    constructor(props) {

        super(props);
        this.state = {
            action: "delete",
            index: this.props.location.state.input.index,
            course_code: this.props.location.state.input.course_code,
            course_name: this.props.location.state.input.course_name,
            division: this.props.location.state.input.division,
            department: this.props.location.state.input.department,
            course_description: this.props.location.state.input.course_description,
            prerequisites: (JSON.parse(this.props.location.state.input.prerequisites.replace(/'/g, '"'))).toString(),
            corequisites: (JSON.parse(this.props.location.state.input.corequisites.replace(/'/g, '"'))).toString(),
            exclusions: (JSON.parse(this.props.location.state.input.exclusions.replace(/'/g, '"'))).toString(),
            msg: "",
            status: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleChange(event) {
        const value = event.target.value;
        this.setState({
            ...this.state,
            [event.target.name]: value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.postData(this.state);
    }


    postData = (input) => {
        API.post(`/admin/delete`, { input })
            .then((response) => {
                console.log("api success", response);
                alert("Success: Course Deleted");
                window.location = '/admin/password123';
                this.status = "Success";
                this.msg = response.data;
            }).catch((error) => {
                console.log("api error", JSON.stringify(error));
                console.log("api error", error.response);
                alert("Error: " + error.response.data['error']);
                this.status = "Error";
                this.msg = error.response.data['error'];

            });

    }
    render() {
        return (
            <div className="CourseForm">

                <Row>
                    <Col><Link to="/admin/add"><button className={"submit-button"} type="button">Add</button></Link></Col>
                    <Col><Link to="/admin/search"><button className={"submit-button"} type="button">Edit</button></Link></Col>
                    <Col><Link to="/admin/search"><button className={"submit-button"} type="button">Delete</button></Link></Col>
                </Row>

                <h1> Aevo: Delete Course</h1>
                <br></br>

                <form onSubmit={this.handleSubmit} className={"modify"}>
                    <Row>
                        <label>Course Code<span class="req">*</span></label>
                        <textarea disabled required name="course_code" placeholder={"Enter Course Code"} className={"input-area"} value={this.state.course_code} onChange={this.handleChange} />

                    </Row>

                    <Row>
                        <label>Course Name<span class="req">*</span></label>
                        <textarea disabled required name="course_name" placeholder={"Enter Course Name"} className={"input-area"} value={this.state.course_name} onChange={this.handleChange} />
                    </Row>

                    <Row>
                        <label>Division</label>
                        <textarea disabled name="division" placeholder={"Enter Course Division"} className={"input-area"} value={this.state.division} onChange={this.handleChange} />
                    </Row>

                    <Row>
                        <label>Department</label>
                        <textarea disabled name="department" placeholder={"Enter Course Department"} className={"input-area"} value={this.state.department} onChange={this.handleChange} />
                    </Row>

                    <Row>
                        <label>Course Description</label>
                        <textarea disabled name="course_description" placeholder={"Enter Course Description"} className={"input-area"} value={this.state.course_description} onChange={this.handleChange} />
                    </Row>

                    <Row>
                        <label>Pre-Requisites (comma seperated)</label>
                        <textarea disabled name="prerequisites" placeholder={"Enter comma seperated Course Pre-Requisites. Example: course1, course2, course3"} className={"input-area"} value={this.state.prerequisites} onChange={this.handleChange} />
                    </Row>

                    <Row>
                        <label>Co-Requisites (comma seperated)</label>
                        <textarea disabled name="corequisites" placeholder={"Enter comma seperated Course Co-Requisites. Example: course1, course2, course3"} className={"input-area"} value={this.state.corequisites} onChange={this.handleChange} />
                    </Row>

                    <Row>
                        <label>Exclusions (comma seperated)</label>
                        <textarea disabled name="exclusions" placeholder={"Enter comma seperated Course Exclusions. Example: course1, course2, course3"} className={"input-area"} value={this.state.exclusions} onChange={this.handleChange} />
                    </Row>

                    <p><span class="req">*</span> - Required field</p>
                    <input type="submit" value="Delete" className={"submit-button"} />
                </form>


            </div>
        );
    }
}
export default DeleteCourseForm;