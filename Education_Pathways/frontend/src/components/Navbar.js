import React, { Component } from 'react';
import './css/navbar.css'
import 'bootstrap/dist/css/bootstrap.css';
import logo from './img/logo.png'
import { Navbar, Nav } from "react-bootstrap";
import { BrowserRouter as Router, Route, Switch, Link, useLocation } from "react-router-dom";
// import LogIn from "./LogIn.jsx";
import CourseDescriptionPage from "./CourseDescription";
// import Wishlist from './Wishlist';
// import SignUp from './SignUp'
import SearchResultDisplay from './ResultDisplay'
import AddCourseForm from './AddCourse'
import EditCourseForm from './EditCourse'
import DeleteCourseForm from './DeleteCourse'
import AdminSearchResultDisplay from './AdminSearch'
import LandingPage from './LandingPage';
import MinorsCertificatesMenuPage from "./MinorsCertsMenu";
import TimetableHelper from './TimetableHelper';


function CourseDescription(props) {
  let query = useQuery();
  return <CourseDescriptionPage code={query.get("code")} />;
}

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}


export default class NavbarComp extends Component {

  constructor(props) {
    super(props)
    this.state = {
      username: localStorage.getItem('username'),
      login: false
    }
  }

  componentDidMount() {
    if (localStorage.getItem('username') !== "") {
      this.setState({ username: localStorage.getItem('username') })
    }
  }

  logOut = () => {
    localStorage.setItem('username', "");
    this.setState({ username: "" })
  }

  render() {
    return (
      <Router>
        <div>
          <Navbar style={{position:"fixed"}} bg="myBlue" variant="dark" sticky="top" expand="lg">
            <Navbar.Brand>
              <img src={logo} alt="" />{" "}
              <Nav.Link href="/" style={{ color: "white", display: "inline" }}>
                Aevo 
              </Nav.Link>
            </Navbar.Brand>

            <Navbar.Toggle />
            <Navbar.Collapse>
              <Nav>
                <Nav.Link as={Link} to="/">
                  Course Search
                </Nav.Link>
                <Nav.Link as={Link} to="/minors-certificates">
                  Minors & Certificates
                </Nav.Link>
                <Nav.Link as={Link} to="/timetable-helper">
                  Timetable Helper
                </Nav.Link>

                {/* <Nav.Link href="/search" style={{ color: "white", display: "inline" }}>
                  Search
                </Nav.Link> */}



              </Nav>
              {/*<Nav>
                <Nav.Link as={Link} to="/admin/password123">
                  Temp Admin
                </Nav.Link>
              </Nav>*/}
            </Navbar.Collapse>
          </Navbar>
        </div>
        <div>
          <Switch>
            <Route path="/about">
              <div className="body_text">
                <p>

                  Welcome to CARTE'kasljdflka;sjdflk;adsjfs in-development tool for course selection at UofT. Education Pathways allows for more intelligent course searching, by matching not just the terms you search, but ones relevant to them. The more terms you search for, the more relevant your results will be! Even try searching across disciplines for the courses that best cover each.

                  Whatever year you are looking for, Education Pathways will also suggest courses in earlier years that will best help you to prepare. To get the most out of this, try searching for courses in a later year and see what is suggested for your current one.

                  We are looking for feedback to improve Education Pathways and make it more useful for students. If you have ideas or suggestions, please <a href="mailto:alex.olson@utoronto.ca">  email us! </a> <br></br>
                </p>
                <p>
                  <b>Development Team: </b>
                </p>
                <p>Alexander Olson <a href="https://carte.utoronto.ca/"> (CARTE)</a> </p>
                <p>Student team from <a href="https://shuiblue.github.io/UofT-ECE444/">ECE444-Fall2021</a> : Janelle Cuevas, Jean Lin, Terry Luan, Cansin Varol, Nick Woo</p>


              </div>
              {/* <SearchResultDisplay /> */}
            </Route>
            <Route path="/minors-certificates">
              <MinorsCertificatesMenuPage />
            </Route>
            <Route path="/timetable-helper">
              <TimetableHelper />
            </Route>
            <Route path="/search">
              <SearchResultDisplay />
            </Route>
            
            <Route exact
              path="/courseDetails/:code"
              render={props => (<CourseDescriptionPage {...props} />)}>
            </Route>
           
            {/*admin homepage*/}
            <Route path="/admin/password123">
              <AdminSearchResultDisplay/>
            </Route>

            {/*admin add new course form*/}    
            <Route path="/admin/add">
              <AddCourseForm/>
            </Route>

            {/*admin edit existing course from*/}
            <Route path="/admin/edit"
              render={props =>(<EditCourseForm {...props} />)}>
            </Route>

            {/*admin delete course form*/}
            <Route path="/admin/delete"
              render={props =>(<DeleteCourseForm {...props} />)}>
            </Route>
           
           {/*admin search course page*/}
            <Route path="/admin/search">
              <AdminSearchResultDisplay/>
            </Route>

            {/*<Route path="/">
              <SearchResultDisplay />
            </Route>*/}
            
            <Route path="/">
              <LandingPage />
            </Route>

          </Switch>
        </div>



      </Router>
    );
  }
}
