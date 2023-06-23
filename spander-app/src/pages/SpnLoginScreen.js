import React, { useEffect } from "react";
import { Button, Row, Container, Col } from "react-bootstrap";
import login from "../assets/images/login.svg";
import spandericon from "../assets/images/icon.svg";
import giticon from "../assets/images/git.svg";
import {
  getGithubClientID,
  getLoginToGithubURL,
} from "../hooks/getGithubLoginURL";
import SpnLoginPopup from "../components/SpnLoginPopup";
import { useLocation, useNavigate } from "react-router-dom";
import { getToken } from "../utils/accessToken";
import { jsonToObj } from "../utils/json-utils";

const SpnLoginScreen = (props) => {
  const user = localStorage.getItem('user')
  const navigate = useNavigate()
  const onClose = () => console.log("closed!");
  const onCode = (code, location) => {
    if(code){
      navigate(location.pathname)
    }
  };
  const loc = useLocation();
  const onError = (error) => {
    // console.log("\n[ERROR] Login error:",error)
  };

  useEffect(() => {
    if(jsonToObj(user)) {
      navigate('/repositories')
    }
  }, [])

  return (
  <>
    <section className="multi_colums py-3 ">
      <Container>
        <Row className="row  align-items-md-center">
          <Col sm={6}>
            <div className="content_box">
              <img src={spandericon} alt="spander icon" />
              <h2 className="text-primary ">Sign in with Github</h2>
              <p className="des text-body">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the{" "}
              </p>
              <p className="des2 text-body">
                By signing up, I agree to Spander{" "}
                <a href="/terms"> Terms of Service</a> and
                <a href="/policy"> Privacy Policy</a>.
              </p>
              
              <SpnLoginPopup
                url={getLoginToGithubURL()}
                onCode={onCode}
                onClose={onClose}
                onError={onError}
              >
                <a
                variant="dark"
                className="signin bg-dark text-white"
                // to={`https://github.com/login/oauth/authorize?client_id=${getGithubClientID()}`}
                // href={getLoginToGithubURL()}
              > 
                <img src={giticon} alt="git icon" />
                <span>Sign in with GitHub</span>
              </a>
              </SpnLoginPopup>
              {/* <a
                // target={"_blank"} rel="noreferrer"
                href={getLoginToGithubURL()}
              >
                test- click here
              </a> */}
            </div>
          </Col>

          <Col sm={6}>
            <img src={login} alt="login" className="right_img" />
          </Col>
        </Row>
      </Container>
    </section>
  </>
)};

export default SpnLoginScreen;
