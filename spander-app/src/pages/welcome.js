import React from "react";
import SpnTopBar from "../components/SpnTopBar";
import { Button, Row, Container, Col, } from "react-bootstrap";
import spandericon from "../assets/images/icon.svg";
import empty from "../assets/images/empty.svg"
import { Link } from "react-router-dom";
const Welcome = () => {
    return (
        <>
            <SpnTopBar />
            <section className="multi_colums welcome_blank py-3">
                <Container>
                    <Row className="row  align-items-md-center">
                        <Col sm={12} md={6}>
                            <div className="content_box">
                                <img src={spandericon} alt="spander icon" />
                                <h2 className="text-primary ">Welcome Itay</h2>
                                <p className="des text-body">
                                    You don’t have any    <Link to="/addrepository" className="text-primary text-decoration-none"> Repositories </Link> on your Github account yet. Start a new repository to create your first project.
                                </p>
                                <Button variant="primary" className="signin" type="submit">
                                    <Link to="/addrepository" className="text-white text-decoration-none"> Start a new repository </Link>
                                </Button>
                            </div>
                        </Col>
                        <Col sm={12} md={6} className="welcomeRight">
                            <img src={empty} alt="group" className="right_img" />
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    );
};
export default Welcome;
