import React, { Component, useImperativeHandle } from "react";
import axios from 'axios'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import './css/timing-results.css'
import unstarred from './img/star.png'
import starred from './img/starred.png'
import API from '../api';
import { BrowserRouter as Router, Route, Link, Switch} 
        from "react-router-dom";

let star;

export let arrayStrings = [];

class TimingResult extends Component {

    constructor(props) {
        super(props);
        this.state = {
            course_activity: this.props.course_activity,
            course_timing: this.props.course_timing,
            course_code: this.props.course_code,
            //course_info_to_send: [],     
            if_added: false, 
            did_export: false,
            did_import: false,
            course_list: this.props.course_list // course_name + course_activity + course_timing
            
        };
        // console.log(this.state.result_contents)
        
        star = unstarred
    }

    // redirectCourse = () => {
    //     this.props.history.push(`/course/details/${this.props.course_code}`, { course_code: this.props.course_code })
    // }
    /*
    const handleCourseAdditionChange(event) {
        let newState = event.target.course_added_bool;
        this.setState({'text': newState});
    }
    */

    

    handleAddClick = (event) => {
        event.preventDefault()
        
        let str = [this.state.course_code + " " + this.state.course_activity + " " + this.state.course_timing]
        //this.state.course_info_to_send.push(str)
        arrayStrings.push(str)
        //console.log(this.state.course_info_to_send)
        this.course_list = arrayStrings
        
        //this.postArrayStrings(this.state.course_list)
        console.log("Course List: ", this.course_list)
        console.log("Course Added", this.state.course_activity, this.state.course_timing)         //(1)
        // Debug check
        console.log(arrayStrings)
        


        //// Changing button text from "Add" to "Added" ////
        //<button className="clickCourse" type="button" onClick={this.handleAddClick}>Added</button>
    }
    /*
    function courseSessionAdded {
        return (

        );
    }
    */
    render() {
        return (
            <Container>
                {/* <a href={`courseDetails/${this.state.course_code}`} onClick={this.redirectCourse} className={"search-result-item"} style={{ textDecoration: "none" }}> */}
            
                <Row className={"result-display"}>
                    <Col>
                        <Row>
                            <h5>{this.state.course_activity}</h5>
                        </Row>
                        <div className="course-general-info">
                            <Row>
                                <Col>Timing:</Col>
                                <Col>{this.state.course_timing}</Col>
                                <Col>
                                    <button className="clickCourse" type="button" onClick={this.handleAddClick}>
                                        Add
                                    </button>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
                {/* </a> */}
            </Container>
        );
    }
}

export default TimingResult;
