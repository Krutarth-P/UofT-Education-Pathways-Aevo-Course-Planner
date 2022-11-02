import React, { Component, useImperativeHandle } from "react";
import axios from 'axios'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import './css/Result.css'
import unstarred from './img/star.png'
import starred from './img/starred.png'
import API from '../api';

let star;

class Result extends Component{

  constructor(props) {
    super(props);
    this.state = {
      course_code : this.props.course_code,
      course_name: this.props.course_name,
      course_description: this.props.course_description,
      division: this.props.division,
      department: this.props.department,
      starred: false,
      username: localStorage.getItem('username')
    };
    star = unstarred
  }

  redirectCourse = () => {
    this.props.history.push(`/course/details/${this.props.course_code}`, {course_code: this.props.course_code})
  }
  

  render(){
    return (
      <Container>
        <a href={`courseDetails/${this.state.course_code}`} onClick={this.redirectCourse} className={"search-result-item"} style={{textDecoration: "none"}}>
        
        <Row className={"result-display"}>
          <Col sm={4}>
            <Row>
              <h5>{this.state.course_code}: {this.state.course_name}</h5> 
            </Row>
            <div className="course-general-info">
                <Row>
                  <Col>Course Instructor:</Col>
                  <Col>Dr. John Smith</Col>
                </Row>
                <Row>
                  <Col>Course Schedule (Lec/Tut/Pra):</Col>
                  <Col>3H/2H/0H</Col>
                </Row>
                <Row>
                  <Col>Course Offering:</Col>
                  <Col>F/W/S</Col>
                </Row>
                <Row>
                  <Col>Eligibility for Minor:</Col>
                  <Col>Artificial Intelligence</Col>  
                </Row>
            </div>
          </Col>
          <Col className={"course-description"}>
            {this.state.course_description}
          </Col>
            
        </Row>
        </a>
      </Container>
    );
  }
}

export default Result;
