import React, { Component, useImperativeHandle } from "react";
import { withRouter } from 'react-router';
import axios from 'axios'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import './css/Result.css'
import unstarred from './img/star.png'
import starred from './img/starred.png'
import API from '../api';
import AddCourse from './AddCourse'


class AdminResult extends Component {

    constructor(props) {
        super(props);
        this.state = {
            action: "",
            key: this.props.key,
            index: this.props.index,
            course_code: this.props.course_code,
            course_name: this.props.course_name,
            division: this.props.division,
            department: this.props.department,
            course_description: this.props.course_description,
            prerequisites: this.props.prerequisites,
            corequisites: this.props.corequisites,
            exclusions: this.props.exclusions
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        //let history = useHistory();
        console.log(this.state.course_code + " "+ this.state.prerequisites+" "+typeof this.state.prerequisites);
    }
    
    handleSubmit(event) {
        event.preventDefault();
        console.log("clicked "+event.target.value+ "for "+ this.state.index +" "+this.state.course_code + this.state.course_name);
        

        /*this.setState({
            action: event.target.value
        });*/

        /*if(event.target.value == "Edit")
            console.log("action: add");
            this.props.history.push('/admin/edit', {input: {...this.state, [this.state.action]: event.target.value}})
        
        console.log("action "+this.state.action);*/
        this.redirectQuery();
        if(event.target.value == "Edit")
            this.props.history.push('/admin/edit', {input: {...this.state}})
        else
            this.props.history.push('/')

        /*this.context.history.push({
            pathname: '/admin/password123',
            state: {...this.state }
          })*/
        
        
        /*this.props.history.push({
            pathname: '/admin/password123', state: {...this.state}});

        /*<Redirect
            to={{
            pathname: "/admin/password123",
            state: {...this.state}
            }}
        />
        /*props.history.push({ 
            pathname: "/admin/password123",
            state: {...this.state}
        });*/

    }

    redirectQuery = () => {

        //
      }
    

    render() {
        return (
            <Container>
                <Row className={"result-display"}>
                    <Col>
                        <h5>{this.state.course_code}</h5>
                    </Col>
                    <Col>
                        <h5>{this.state.course_name}</h5>
                    </Col>
                    <Col>{this.state.division}</Col>
                    <Col>{this.state.department}</Col>
                    {/* <Col><img src={star} alt=""/></Col> */}
                    
                    <Row xs={2} md={4} lg={6}>
                        <Col><button onClick={this.handleSubmit} type="submit" value="Edit" className={"submit-button"}>Edit</button></Col>
                        <Col><button onClick={this.handleSubmit} type="submit" value="Delete" className={"submit-button"}>Delete</button></Col>
                    </Row>
                </Row>

                
            </Container>
        );
    }
}

export default withRouter(AdminResult);
