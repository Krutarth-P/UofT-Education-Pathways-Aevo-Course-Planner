import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Link, useLocation } from "react-router-dom";
import axios from 'axios'
import AdminResult from './AdminResults'
import './css/Result.css'
import AdminLabel from './AdminLabel'
import "./css/styles.css";
import API from '../api';


class AdminSearchResultDisplay extends Component {

    constructor() {
        super();
        this.state = {
            input: "",
            results: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ input: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.getData(this.state.input)
    }

    getData = (input) => {
        API.get(`/admin/search?input=${input}`)
            .then(res => {
                if (res.status === 200) {
                    this.setState({ results: [] })
                    if (res.data != null) {
                        if (res.data.length > 0) {
                            let len = res.data.length
                            let result_temp = []
                            result_temp.push(<AdminLabel></AdminLabel>)
                            for (let i = 0; i < len; i++) {
                                console.log(res.data[i].iloc_index);
                                let prereq = res.data[i].prereq;
                                let coreq = res.data[i].coreq;
                                let exclusion = res.data[i].exclusion;
                                if (typeof res.data[i].prereq == "object") {
                                    prereq = JSON.stringify(prereq);
                                }
                                if (typeof res.data[i].coreq == "object") {
                                    coreq = JSON.stringify(coreq);
                                }
                                if (typeof res.data[i].exclusion == "object") {
                                    exclusion = JSON.stringify(exclusion);
                                }

                                result_temp.push(<AdminResult key={res.data[i].iloc_index}
                                    index={res.data[i].iloc_index}
                                    course_code={res.data[i].code}
                                    course_name={res.data[i].name}
                                    division={res.data[i].division}
                                    department={res.data[i].department}
                                    course_description={res.data[i].description}
                                    prerequisites={prereq}
                                    corequisites={coreq}
                                    exclusions={exclusion}></AdminResult>)
                            }
                            this.setState({ results: result_temp })
                        }
                        else
                            if (res.data.length === 0) {
                                alert("Course not found")
                            }
                            else {
                                let result_temp = []
                                let prereq = res.data.prereq;
                                let coreq = res.data.coreq;
                                let exclusion = res.data.exclusion;
                                if (typeof res.data.prereq == "object") {
                                    prereq = JSON.stringify(prereq);
                                }
                                if (typeof res.data.coreq == "object") {
                                    coreq = JSON.stringify(coreq);
                                }
                                if (typeof res.data.exclusion == "object") {
                                    exclusion = JSON.stringify(exclusion);
                                }
                                result_temp.push(<AdminResult key={res.data.iloc_index}
                                    course_code={res.data.code}
                                    course_name={res.data.name}
                                    division={res.data.division}
                                    department={res.data.department}
                                    course_description={res.data.description}
                                    prerequisites={prereq}
                                    corequisites={coreq}
                                    exclusions={exclusion}></AdminResult>)
                                this.setState({ results: result_temp })
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
            <div className="SearchQuery">
                <div style={{ marginTop: "10%" }}>
                    <h1> Aevo: Admin Page</h1>
                    <h4>Search below for course to be edited or deleted</h4>
                    <h4>Or click Add to add new course</h4>
                    <br></br>
                    <form onSubmit={this.handleSubmit} className={"search"}>
                        <Link to="/admin/add"><button className={"submit-button"} type="button">Add</button></Link>
                        <input placeholder={"Enter course code for course to be edited"} className={"text-input"} type="text" value={this.state.input} onChange={this.handleChange} />
                        <input type="submit" value="Search" className={"submit-button"} />
                    </form>
                </div>
                <div className={"admin-search-result-display"} >
                    {this.state.results}
                </div>
            </div>
        );
    }
}

export default AdminSearchResultDisplay;
