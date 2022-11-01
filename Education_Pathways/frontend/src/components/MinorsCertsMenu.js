import React, { Component } from 'react';
import './css/minors-certs-menu.css'
import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import API from '../api';

class MinorCertificatesMenuPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            minor1_link: "https://undergrad.engineering.utoronto.ca/academics-registration/minors-certificates/undergraduate-engineering-minors/advanced-manufacturing-minor/",
            minor2_link: "https://undergrad.engineering.utoronto.ca/academics-registration/minors-certificates/undergraduate-engineering-minors/minor-in-artificial-intelligence/",
            minor3_link: "https://undergrad.engineering.utoronto.ca/academics-registration/minors-certificates/undergraduate-engineering-minors/new-bioengineering-minor/",
            minor4_link: "https://undergrad.engineering.utoronto.ca/academics-registration/minors-certificates/undergraduate-engineering-minors/engineering-business-minor/",
            minor5_link: "https://undergrad.engineering.utoronto.ca/academics-registration/minors-certificates/undergraduate-engineering-minors/environmental-engineering/",
            minor6_link: "https://undergrad.engineering.utoronto.ca/academics-registration/minors-certificates/undergraduate-engineering-minors/global-leadership-minor/",
            minor7_link: "https://undergrad.engineering.utoronto.ca/academics-registration/minors-certificates/undergraduate-engineering-minors/engineering-music-performance-minor/",
            minor8_link: "https://undergrad.engineering.utoronto.ca/academics-registration/minors-certificates/undergraduate-engineering-minors/nanoengineering-minor/",
            minor9_link: "https://undergrad.engineering.utoronto.ca/academics-registration/minors-certificates/undergraduate-engineering-minors/robotics-and-mechatronics-minor/",
            minor10_link: "https://undergrad.engineering.utoronto.ca/academics-registration/minors-certificates/undergraduate-engineering-minors/sustainable-energy/",
            cert1_link: "https://undergrad.engineering.utoronto.ca/academics-registration/minors-certificates/undergraduate-engineering-certificates/certificate-in-artificial-intelligence/",
            cert2_link: "https://undergrad.engineering.utoronto.ca/academics-registration/minors-certificates/undergraduate-engineering-certificates/certificate-in-entrepreneurship/",
            cert3_link: "https://undergrad.engineering.utoronto.ca/academics-registration/minors-certificates/undergraduate-engineering-certificates/certificate-in-engineering-business/",
            cert4_link: "https://undergrad.engineering.utoronto.ca/academics-registration/minors-certificates/undergraduate-engineering-certificates/certificate-in-public-health-and-engineering/",
            cert5_link: "https://undergrad.engineering.utoronto.ca/academics-registration/minors-certificates/undergraduate-engineering-certificates/certificate-forensic-engineering/",
            cert6_link: "https://undergrad.engineering.utoronto.ca/academics-registration/minors-certificates/undergraduate-engineering-certificates/certificate-in-global-engineering/",
            cert7_link: "https://undergrad.engineering.utoronto.ca/academics-registration/minors-certificates/undergraduate-engineering-certificates/certificate-in-mineral-resources/",
            cert8_link: "https://undergrad.engineering.utoronto.ca/academics-registration/minors-certificates/undergraduate-engineering-certificates/music-technology-certificate/",
            cert9_link: "https://undergrad.engineering.utoronto.ca/academics-registration/minors-certificates/undergraduate-engineering-certificates/certificate-in-nuclear-engineering/",
            cert10_link: "https://undergrad.engineering.utoronto.ca/academics-registration/minors-certificates/undergraduate-engineering-certificates/certificate-in-engineering-leadership/",
            cert11_link: "https://undergrad.engineering.utoronto.ca/academics-registration/minors-certificates/undergraduate-engineering-certificates/certificate-in-renewable-resources-engineering/",
            cert12_link: "https://undergrad.engineering.utoronto.ca/academics-registration/minors-certificates/undergraduate-engineering-certificates/certificate-in-communication/",
        }
    }

    render() {

        return (

            <div className="page-content">
                <Container className="minor-certificates-template">
                    <Row float="center" className="minors-heading">
                        <Col>
                            <h1>Engineering Minors</h1>
                        </Col>
                    </Row>
                    <Row className>
                        <Col className="col-item">
                            <a href={this.state.minor1_link} target="_blank" rel="noreferrer">
                                <h3>Advanced Manufacturing</h3>
                            </a>
                        </Col>
                        <Col className="col-item">
                            <a href={this.state.minor2_link} target="_blank" rel="noreferrer">
                                <h3>Artificial Intelligence Engineering</h3>
                            </a>
                        </Col>
                        <Col className="col-item">
                            <a href={this.state.minor3_link} target="_blank" rel="noreferrer">
                                <h3>Bioengineering</h3>
                            </a>
                        </Col>
                        <Col className="col-item">
                            <a href={this.state.minor4_link} target="_blank" rel="noreferrer">
                                <h3>Engineering Business</h3>
                            </a>
                        </Col>
                        <Col className="col-item">
                            <a href={this.state.minor5_link} target="_blank" rel="noreferrer">
                                <h3>Environmental Engineering</h3>
                            </a>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="col-item">
                            <a href={this.state.minor6_link} target="_blank" rel="noreferrer">
                                <h3>Global Leadership</h3>
                            </a>
                        </Col>
                        <Col className="col-item">
                            <a href={this.state.minor7_link} target="_blank" rel="noreferrer">
                                <h3>Music Performance</h3>
                            </a>
                        </Col>
                        <Col className="col-item">
                            <a href={this.state.minor8_link} target="_blank" rel="noreferrer">
                                <h3>Nanoengineering</h3>
                            </a>
                        </Col>
                        <Col className="col-item">
                            <a href={this.state.minor9_link} target="_blank" rel="noreferrer">
                                <h3>Robotics & Mechatronics</h3>
                            </a>
                        </Col>
                        <Col className="col-item">
                            <a href={this.state.minor10_link} target="_blank" rel="noreferrer">
                                <h3>Sustainable Energy</h3>
                            </a>
                        </Col>

                    </Row>
                    <Row float="center" className="certs-heading">
                        <Col>
                            <h1>Engineering Certificates</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="col-item">
                            <a href={this.state.cert1_link} target="_blank" rel="noreferrer">
                                <h3>Artificial Intelligence Engineering</h3>
                            </a>
                        </Col>
                        <Col className="col-item">
                            <a href={this.state.cert2_link} target="_blank" rel="noreferrer">
                                <h3>Entrepreneurship, Innovation and Small Business</h3>
                            </a>
                        </Col>
                        <Col className="col-item">
                            <a href={this.state.cert3_link} target="_blank" rel="noreferrer">
                                <h3>Engineering Business</h3>
                            </a>
                        </Col>
                        <Col className="col-item">
                            <a href={this.state.cert4_link} target="_blank" rel="noreferrer">
                                <h3>Public Health & Engineering</h3>
                            </a>
                        </Col>
                        <Col className="col-item">
                            <a href={this.state.cert5_link} target="_blank" rel="noreferrer">
                                <h3>Forensic Engineering</h3>
                            </a>
                        </Col>
                        <Col className="col-item">
                            <a href={this.state.cert6_link} target="_blank" rel="noreferrer">
                                <h3>Global Engineering</h3>
                            </a>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="col-item">
                            <a href={this.state.cert7_link} target="_blank" rel="noreferrer">
                                <h3>Mineral Resources</h3>
                            </a>
                        </Col>
                        <Col className="col-item">
                            <a href={this.state.cert8_link} target="_blank" rel="noreferrer">
                                <h3>Music Technology</h3>
                            </a>
                        </Col>
                        <Col className="col-item">
                            <a href={this.state.cert9_link} target="_blank" rel="noreferrer">
                                <h3>Nuclear Engineering</h3>
                            </a>
                        </Col>
                        <Col className="col-item">
                            <a href={this.state.cert10_link} target="_blank" rel="noreferrer">
                                <h3>Engineering Leadership</h3>
                            </a>
                        </Col>
                        <Col className="col-item">
                            <a href={this.state.cert11_link} target="_blank" rel="noreferrer">
                                <h3>Renewable Resources Engineering</h3>
                            </a>
                        </Col>
                        <Col className="col-item">
                            <a href={this.state.cert12_link} target="_blank" rel="noreferrer">
                                <h3>Communication</h3>
                            </a>
                        </Col>
                    </Row>
                </Container>
            </div>

        )
    }
}

export default MinorCertificatesMenuPage