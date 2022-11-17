import React, { Component, useImperativeHandle } from "react";
import axios from 'axios'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import './css/timetable-helper.css'
import unstarred from './img/star.png'
import starred from './img/starred.png'
import API from '../api';
import { BrowserRouter as Router, Route, Link, Switch }
    from "react-router-dom";
import { arrayStrings } from './TimingResults'


let star;

export let arrayStringsSelected = [];
export let arraySELECTED = [];

class ScheduleResult extends Component {

    constructor(props) {
        super(props);
        this.state = {
            course_activity_sel: this.props.course_activity_sel,
            course_timing_sel: this.props.course_timing_sel,
            course_code_sel: this.props.course_code_sel,
            course_schedule_sel: this.props.course_schedule_sel//"IT WORKS ok"//this.props.course_schedule_sel
            //course_info_to_send: [],     


        };
        // console.log(this.state.result_contents)

        console.log("EACH COURSE ACT",this.state.course_schedule_sel)
        arraySELECTED = this.state.course_schedule_sel
        //const parsedStrArray = this.state.course_activity_sel.toString().split(" ")
        //console.log("SPLITTING", this.state.course_code_sel)
        //this.state.course_code_sel = parsedStrArray[0]
        //this.state.course_activity_sel = parsedStrArray[1]
        //this.state.course_timing_sel = parsedStrArray[2]
        star = unstarred
    }

    render() {
        return (
            
            <Container>
                <Row className={"selected-course-timing-result-display"}>
                    <Col>
                        <Row>
                            <h5>{this.state.course_schedule_sel}</h5>
                        </Row>
                        {/*
                        <div className="course-general-info">
                            <Row>
                                <Col>Selected Timing:</Col>
                                <Col>{this.state.course_timing}</Col>
                            </Row>
                        </div>
                        */}
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default ScheduleResult;
