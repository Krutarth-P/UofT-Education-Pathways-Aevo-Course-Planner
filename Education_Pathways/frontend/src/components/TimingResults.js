import React, { Component, useImperativeHandle } from "react";
import axios from 'axios'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import './css/timing-results.css'
import unstarred from './img/star.png'
import starred from './img/starred.png'
import API from '../api';

let star;

class TimingResult extends Component {

    constructor(props) {
        super(props);
        this.state = {
            course_activity: this.props.course_activity,
            course_timing: this.props.course_timing
        };
        // console.log(this.state.result_contents)
        star = unstarred
    }

    // redirectCourse = () => {
    //     this.props.history.push(`/course/details/${this.props.course_code}`, { course_code: this.props.course_code })
    // }


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
