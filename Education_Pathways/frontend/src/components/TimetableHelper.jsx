import React, { Component } from "react";
import axios from 'axios'
import TimingResult from './TimingResults'
import './css/timing-results.css'
import Label from './Label'
import "./css/styles.css";
import API from '../api';
import { withRouter } from 'react-router';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { arrayStrings } from './TimingResults'
let course_selections = []
export let arrayStringsJSON = [];
class TimetableHelper extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // input: this.props.location.state.input,
            results: [],
            result_courses: [],
            course_selection_strings: [],
            file: ""

            //[file, setFile] = useState();

            //fileReader = new FileReader();

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

    JSONarray() {
        //Convert arrayStrings --> arrayStringsJSON
        let temp_dict = {}
        for (let i = 0; i < arrayStrings.length; i++) {
            temp_dict[i] = arrayStrings[i]
        }
        console.log("Temporary Dictionary prior to JSON conversion:", temp_dict)
        //arrayStringsJSON = JSON.stringify(arrayStrings)
        arrayStringsJSON = JSON.stringify(temp_dict)
        console.log("JSON conversion", arrayStringsJSON)
    }

    handleExportClick = (event) => {
        // Make my course_selections --> JSON format where 
        // 
        event.preventDefault()
        console.log("Before getArrayStrings")
        //course_selections = this.getArrayStrings(event)
        course_selections = arrayStrings
        console.log("list: ", course_selections)
        console.log("After getArrayStrings")
        console.log("Before altering our course activities into JSON")
        arrayStringsJSON = this.JSONarray()
        console.log("After altering our course activities into JSON")
        this.state.did_export = true

        console.log("Exported", this.state.did_export)
        //this.state.did_export = false
        //this.props.course_list = []
    }

    handleImportClick = (e) => {
        console.log("Import Course Loadout", this.state.did_import)
        e.preventDefault()

            //Syntax Error?/
        const [file, setFile] = this.state.file
        const fileReader = new FileReader()

         
        //fileReader.onload = event
        fileReader.readAsText(file)
        

        //Now load from CSV

        //Display   
        console.log("Imported: ", this.state.file)
    }

    postData = (input) => {
        console.log("in postdata", input)
        API.post(`/timetable-helper/timetable-helper-export`,{input})
        .then((response) => {
            console.log("api success",response);
            alert("Success: ");
        }).catch((error) => {
            console.log("api error",JSON.stringify(error));
            console.log("api error",error.response);
            alert("Error: " + error.response.data['error']);

        });

    }

    //// NEED a new "getData" API GET request called "getArrayStrings" where we get arrayStrings or equivalent from the backend ////

    /*
    getArrayStrings = (input) => {
        API.get(`/timetable-helper/timing-results-selected-sessions-sent?input=${input}`)
            .then(result => {
                if (result.status === 200) {
                    this.setState({ results: []})
                    if (result.data != null) {
                        console.log(result.data)
                        if (result.length > 0) {
                            this.props.course_selection_strings = this.props.course_list//result.data
                            console.log("It worked", this.props.course_selection_strings)
                        }
                    }
                }
            })
    }
    */


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
                                result_temp.push(<TimingResult course_activity={key} course_timing={value} course_code={res.data[0].code} >
                                         </TimingResult>)
                            }
                            this.setState({ results: result_temp })
                            this.setState({ result_courses: result_course_code_temp })
                        }
                        else
                            if (res.data.length === 0) {
                                alert("Course not found")
                            }

                    } else {
                        //alert("Course not found")
                    }
                } else if (res.status === 400) {
                    alert("System Error. Please refresh")
                }
            })
    }

    render() {
        return (
            <div>
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
                <Row className={"display-export-import"}>
                    <Col>
                        <button className="clickExport" type="button" onClick={this.handleExportClick}>
                            Export
                        </button>
                    </Col>
                    <Col>
                        <form>
                            <input type={"file"} accept={".csv"}/>
                                <button className="clickExport" type="button" onClick={this.handleImportClick}>
                                    Import
                                </button>
                        </form>
                    </Col>
                </Row>
            </div>
        );
    }



}

export default withRouter(TimetableHelper)