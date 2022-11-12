import React, { Component } from "react";
import axios from 'axios'
import TimingResult from './TimingResults'
import './css/timing-results.css'
import Label from './Label'
import "./css/styles.css";
import API from '../api';
import { withRouter } from 'react-router';



class TimetableHelper extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // input: this.props.location.state.input,
            results: [],
            result_courses: [],
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    componentDidMount() {
        this.getData(this.state.input)
    }

    handleChange(event) {
        this.setState({ input: event.target.value })
    }

    handleSubmit(event) {
        event.preventDefault();
        this.getData(this.state.input)
    }



    getData = (input) => {
        API.get(`/timetable-helper?input=${input}`)
            .then(res => {
                if (res.status === 200) {
                    this.setState({ results: [] })
                    if (res.data != null) {
                        console.log(res.data.length)
                        if (res.data.length > 0) {

                            let len = res.data.length
                            let num_course_activities = Object.keys(res.data[0].course_activities).length
                            // console.log(Object.keys(res.data[0].course_activities).length)
                            let result_temp = []
                            let result_course_code_temp = []
                            result_temp.push(<h2>{res.data[0].code.slice(0, -2)}: {res.data[0].name}</h2>)
                            // let eligible_minors = []
                            // for (let i = 0; i < len; i++) {
                            //     result_course_code_temp.push(res.data[i].code.slice(0, -2)) //Remove last two characters of course code to remove H1, Y1...etc endings

                            //     result_temp.push(<TimingResult res={res.data[i]}>
                            //     </TimingResult>)
                            // }

                            for (const [key, value] of Object.entries(res.data[0].course_activities)) {
                                console.log(key, value);
                                result_temp.push(<TimingResult course_activity={key} course_timing={value} >
                                    //     </TimingResult>)
                            }
                            this.setState({ results: result_temp })
                            this.setState({ result_courses: result_course_code_temp })
                        }
                        else
                            if (res.data.length === 0) {
                                alert("Course not found")
                            }

                    } else {
                        alert("Course not found")
                    }
                } else if (res.status === 400) {
                    alert("System Error. Please refresh")
                }
            })
    }

    render() {
        return (
            <div className={"SearchQuery"}>
                <div style={{ marginTop: "5%" }}>
                    <h1>Timetable Helper</h1>
                    <br></br>
                </div>

                <div className={"left-sidebar"} >
                    <br></br>

                    <form onSubmit={this.handleSubmit} className={"search"} id={"search-results"}>
                        <input placeholder={"Search for course code"} className={"text-input small-search"} type="text" value={this.state.input} onChange={this.handleChange} />
                        <input type="submit" value="Search" className={"submit-button"} />
                    </form>



                </div>
                <div className={"search-result-display"} >
                    {this.state.results}
                </div>


            </div>
        );
    }



}

export default withRouter(TimetableHelper)