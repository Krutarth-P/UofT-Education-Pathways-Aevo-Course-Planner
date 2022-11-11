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
      course_term: this.props.course_term,
      division: this.props.division,
      department: this.props.department,
      eligible_minors: this.props.eligible_minors,
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
                  <Col>Course Terms:</Col>
                  <Col id="search-result-terms">
                    {/* {this.state.course_term.map((item, index) => {
                      return <span>{ (index ? ', ' : '') + item }</span>;
                    })} */}
                    {this.state.course_term.map(term => {
                        return <ul>{term}</ul>
                    })}
                  </Col>
                </Row>
                <Row>
                  <Col>Eligibility for Minor:</Col>
                  <Col>{this.state.eligible_minors}</Col>  
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
