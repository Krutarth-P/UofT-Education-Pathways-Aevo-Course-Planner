import React, { Component } from 'react';
import './css/course-description.css'
import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import requisite_label from './img/requisite-label.png'
import empty_star from './img/star.png'
import API from '../api';

let star = empty_star;

class CourseDescriptionPage extends Component {

  constructor(props){
    super(props)

    this.state = {
      course_code: "",
      course_name: "",
      division: "",
      department: "",
      graph: "",
      course_description: "",
      course_term: "",
      activity: "",
      syllabus: "",
      // prerequisites: "",
      // corequisites: "",
      // exclusions: "",
      excls: [],
      prereqs: [],
      coreqs: [],
      starred: false,
      graphics: [],
      username: localStorage.getItem('username')
    }
  }


  componentDidMount() {
    API.get(`/course/details?code=${this.props.match.params.code}`, {
      code: this.props.course_code
    })
      .then(res => {
        console.log("zxc",res.data)
        this.setState({course_code: res.data.course.code})
        this.setState({course_name: res.data.course.name})

        this.setState({division: res.data.course.division})
        this.setState({department: res.data.course.department})

        this.setState({course_description : res.data.course.description})
        this.setState({course_term: res.data.course.term})
        this.setState({graph: res.data.course.graph})

        console.log("prereqs", this.state.prereqs)

        let prereq = res.data.course.prereq;
        let coreq = res.data.course.coreq;
        let exclusion = res.data.course.exclusion;
        //fix string formatting
        if (typeof prereq == "object") {
            prereq = JSON.stringify(prereq);
        }
        if (typeof coreq == "object") {
            coreq = JSON.stringify(coreq);
        }
        if (typeof exclusion == "object") {
            exclusion = JSON.stringify(exclusion);
        }       

        prereq = JSON.parse(prereq.replace(/'/g, '"'))
        coreq = JSON.parse(coreq.replace(/'/g, '"'))
        exclusion =JSON.parse(exclusion.replace(/'/g, '"'))

        if (coreq == null) {
          coreq=[]
        }
        if (prereq == null) {
          prereq=[]
        }
        if (exclusion == null) {
          exclusion=[]
        }
        this.setState({prereqs:prereq})
        this.setState({coreqs: coreq})
        this.setState({excls: exclusion})

        let course_activity = res.data.course.activity
        if (course_activity != null){
          course_activity=course_activity.replace("['", "")
          course_activity=course_activity.replace("']", "")
          course_activity=course_activity.replace(/\\n|\\r/g, "")
          course_activity=course_activity.replace(/>'/g, ">")
          course_activity=course_activity.replace(/'</g, "<")
        } else {
          course_activity = []
        }
        
        let course_term = res.data.course.term
        if (course_term != null){
          course_term=course_term.replaceAll("' '", "', '")
          course_term=course_term.replace("['", "")
          course_term=course_term.replace("']", "")
          course_term=course_term.replaceAll("'", "")                               
        } else {
          course_term = []
        }

        console.log("course term", course_term)
        this.setState({course_offering: course_activity})    
        this.setState({course_term: course_term})                     

        let syllabus_link = "http://courses.skule.ca/course/" + this.props.code
        this.setState({syllabus : syllabus_link})

        let temp_graph = []
        //temp_graph.push(<ShowGraph graph_src={this.state.graph}></ShowGraph>)
        this.setState({graphics: temp_graph})
        console.log("again",res.data)


    })
    console.log("new state: ", this.state)
  }


  openLink = () => {
    const newWindow = window.open(this.state.syllabus, '_blacnk', 'noopener,noreferrer');
    if (newWindow) {
      newWindow.opener = null;
    }
  }

	render() {
    
		return(

      <div className="page-content">
        <Container className="course-template">
          <Row float="center" className="course-title">          
            <h1>{this.state.course_code} : {this.state.course_name}</h1>
            {/* <Col xs={4}>
              <img src={star} onClick={this.check_star} alt="" />
            </Col> */}
          </Row>
          <Row>
            <Col className="col-item">
              <h3>Division</h3>
              <p>{this.state.division}</p>
            </Col>
            <Col className="col-item">
              <h3>Department</h3>
              <p>{this.state.department}</p>
            </Col>
            <Col className="col-item">
              <h3>Past Tests and Syllabi</h3>
              <button className={"syllabus-link"} onClick={this.openLink}>View</button>
            </Col>
          </Row>
          <Row className="col-item course-description">
            <h3>Course Description</h3>
            <p>{this.state.course_description}</p>
          </Row>
          <Row className="col-item course-description">
            <h3>Course Offerings</h3>
            <h6>{this.state.course_term}</h6>
            <div className="course-offering" dangerouslySetInnerHTML={{ __html: this.state.course_offering }} />
          </Row>
          <Row className="col-item course-requisite">
            <Row>
              <h3>Course Requisites</h3>
            </Row>
            <Row>
              <Col className="requisites-display prerequisites">
                <h4>Pre-Requisites</h4>
                <ul className="req-list">
                  {this.state.prereqs.map(code => {
                    return <a href={`/courseDetails/${code}`} onClick={this.redirectCourse}>{code}</a>
                })}</ul>
              </Col>
              <Col className="requisites-display corequisites">
                <h4>Co-Requisites</h4>
                <ul className="req-list">
                  {this.state.coreqs.map(code => {
                    return <a href={`/courseDetails/${code}`} onClick={this.redirectCourse}>{code}</a>
                })}</ul>
                
              </Col>
              <Col className="requisites-display exclusions">
                <h4>Exclusions</h4>
                <ul className="req-list">
                  {this.state.excls.map(code => {
                    return <a href={`/courseDetails/${code}`} onClick={this.redirectCourse}>{code}</a>
                })}</ul>
              </Col>
            </Row>
            {/* <Row>
              <div className={"req-graph"}>
                <img style={{width: "70%", marginBottom: "3%"}} alt="" src={requisite_label}></img>
                <img src={`data:image/jpeg;base64,${this.state.graph}`} alt="" ></img>
              </div>
            </Row> */}
          </Row>
        </Container>
      </div>

		)
	}
}

export default CourseDescriptionPage
