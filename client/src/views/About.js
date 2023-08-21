import React from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import '../assets/css/About.css';

const About = () => {
  return (
    <div >
      <br />
      <Container fluid className="container-colors about-container container-padding-fix">
        <Row className="about-heading-row">
          <Col className="text-center">
            <h1 className="about-heading" style={{ color: '#31EA8A' }}>About XRPL Learning Lab </h1>
            <br />
            <h2 style={{ color: 'white' }}>Begin Your Blockchain Coding Journey with XRPL Learning Lab</h2>
          </Col>
        </Row>
        <Row className="about-content-row">
          <Col lg="2"></Col>
          <Col lg="8">
            <Card className="about-card">
              <CardBody>
                <h2 className="about-subheading" style={{ color: '#31EA8A' }}>Collaborative Learning </h2>
                <p className="about-text">
                  Welcome to the Community Learning Lab on XRPL - a hub where blockchain enthusiasts come together to explore, experiment, and excel.
                </p>
                <p className="about-text">
                  Dive into the world of XRPL, where community-driven challenges meet hands-on learning experiences.
                </p>

                <h2 className="about-subheading" style={{ color: '#31EA8A' }}>Interactive XRPL</h2>
                <p className="about-text">
                  Step beyond traditional learning. Engage with real-world challenges tailored for the XRP Ledger, fostering both individual growth and community collaboration.
                </p>

                <h2 className="about-subheading" style={{ color: '#31EA8A' }}>For Everyone, By Everyone</h2>
                <p className="about-text">
                  Whether you're a novice or an XRPL expert, the Community Learning Lab is your space. Crafted by the community, for the community, it's where we all grow together.
                </p>
                <h2 className="about-subheading" style={{ color: '#31EA8A' }}>Join the Learning Revolution</h2>
                <p className="about-text">
                  Ready to dive deep into the XRPL with fellow enthusiasts? Join us, contribute, learn, and help shape the future of blockchain education on the XRP Ledger.
                </p>
                <p className="about-text">
                  Your collaborative journey on the XRP Ledger starts here. Let's learn together!
                </p>
              </CardBody>
            </Card>
          </Col>
          <Col lg="2"></Col>
        </Row>
        <div className="video-container">
          <video controls>
            <source src={"https://objectstorage.il-jerusalem-1.oraclecloud.com/p/GuYmVeBi29MZeZHmX8maUuFzosEQ0eAJuxJ_zsU_Zc_upsde-QyV8IwGSQsHjB-Q/n/axiak399ab1d/b/xrpl/o/xrplxrpl-demo.mp4"} type="video/mp4" />
          </video>
        </div>
      </Container>
    </div>
  );
};

export default About;
