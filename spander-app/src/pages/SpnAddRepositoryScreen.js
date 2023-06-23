import React, { useEffect, useRef, useState } from 'react';
import { Button, Row, Container, Col, Form, InputGroup } from 'react-bootstrap';
import { TailSpin } from 'react-loader-spinner';
import { useDispatch, useSelector } from 'react-redux';
import { addNewRepository } from '../api/addNewRepository';
import group from '../assets/images/group.svg';
import SpnTopBar from '../components/SpnTopBar';
import { setRepositories } from '../slices/allRepositoryDetails';
import { NavDropdown } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import { getUserDetails } from '../api/getUserDetails';
import { Octokit } from '@octokit/core';
import { getToken } from '../utils/accessToken';
import { useNavigate } from 'react-router-dom';
import orgsDetails, { setOrgsDetails } from '../slices/orgsDetails';
import { getAllRepositories } from '../api/getAllRepositories';

const SpnAddRepositoryScreen = (props) => {
  const repo_description = useRef();
  const repo_name = useRef();
  const priCheck = useRef();
  const pubCheck = useRef();
  const [privateCheck, setPrivateCheck] = useState(false);
  const [publicCheck, setPublicCheck] = useState(false);

  const [data, setData] = useState(null);
  const state = useSelector((state) => state.allRepositorySlice);
  const userState = useSelector((state) => state.loginUserDetailsSlice.loginUserDetails);
  const repositoryState = useSelector((state) => state.allRepositorySlice.repositories);
  // console.log(repositoryState);
  const dispatch = useDispatch();
  const [validated, setValidated] = useState(false);
  const [isSubmitted, setSubmitted] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [owner, setOwner] = useState('');
  const [orgs, setOrgs] = useState([]);
  const [isRepoNameExist, setRepoNameExist] = useState(false);
  const navigate = useNavigate();
  const orgsState = useSelector((state) => state.orgsDetailSlice);

  const octokit = new Octokit({
    auth: getToken(),
  });
  const getCurrentUser = async () => {
    if (userState.userData) {
      setCurrentUser(userState.userData);
    } else {
      const user = await getUserDetails();
      setCurrentUser(user);
    }

    if (orgsState.orgs.length != 0) {
      setOrgs(orgsState.orgs);
    } else {
      const orgs = await octokit.request('GET /user/orgs');
      setOrgs(orgs?.data);
      dispatch(setOrgsDetails({ orgData: orgs?.data }));
    }

    // if(repositoryState.length == 0) {
    //   const data = await getAllRepositories();
    //   dispatch(setRepositories(data));
    // }
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/login', { replace: true });
    }
    getCurrentUser();
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();

    const name = repo_name.current.value;
    const description = repo_description.current.value;
    const isPrivate = priCheck.current.checked ?? false;
    const atleastOneTrue = priCheck.current.checked || pubCheck.current.checked;

    if (name.trim() == '' || owner == '' || !atleastOneTrue) {
      setValidated(true);
      return false;
    }
    const isExist = repositoryState.find((i) => i?.name == name);
    if (isExist) {
      setRepoNameExist(true);
      return false;
    }

    const createNewRepo = async (e) => {
      let response;
      try {
        response = await addNewRepository({ name, description, isPrivate, owner, currentUser });
        if (!response.nameExists) {
          dispatch(setRepositories([...state.repositories, response.data]));
          setData(response.data);
          setSubmitted(true);
          e.target.reset();
        } else {
          setRepoNameExist(true);
        }
      } catch (e) {}
    };

    createNewRepo(e);
  };

  useEffect(() => {
    var interval;
    if (data != null) {
      interval = setInterval(() => {
        navigate(`/repository/${data?.id}`);
      }, 3000);
    }

    return () => clearInterval(interval);
  }, [data]);

  return (
    <>
      <SpnTopBar />
      <section className="multi_colums py-3 ">
        <Container>
          <Row className="row  align-items-md-center">
            {!data ? (
              !isSubmitted ? (
                <Col sm={6}>
                  <div className="content_box">
                    <h2 className="text-primary "> Add new repository</h2>
                    <p className="des2 text-body">
                      Once you define your repository on Spander, a corresponding linked repository will be created on
                      GitHub. You can then plan your project on Spander from an abstract level down to specific tasks, which
                      can be converted into your GitHub repository as issues
                    </p>

                    <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e)}>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Repository name</Form.Label>
                        <InputGroup hasValidation>
                          <Form.Control
                            type="text"
                            placeholder="Repository name"
                            ref={repo_name}
                            className={isRepoNameExist && 'repo-name-exist'}
                            required
                            onChange={() => setRepoNameExist(false)}
                          />
                          {isRepoNameExist && <p> Repository name already exist! </p>}
                          <Form.Control.Feedback type="invalid">Please provide repository name</Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>

                      {/* <Form.Group className="mb-3" controlId="formBasicEmail">
                          <Form.Label>Owner</Form.Label>
                          <NavDropdown title="Dropdown" id="basic-nav-dropdown" className="border border-text-body rounded p-2 w-full repo-drop">
                              <NavDropdown.Item >Action</NavDropdown.Item>
                              <NavDropdown.Item >Action</NavDropdown.Item>
                          </NavDropdown>
                      </Form.Group> */}

                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Owner</Form.Label>
                        {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown" className="border border-text-body rounded p-2 w-full repo-drop">
                              <NavDropdown.Item >Action</NavDropdown.Item>
                              <NavDropdown.Item >Action</NavDropdown.Item>
                          </NavDropdown> */}
                        <Dropdown className={validated ? 'repoDropdown hasValidation' : 'repoDropdown'}>
                          <Dropdown.Toggle
                            variant="success"
                            id="dropdown-basic"
                            className="border border-text-body rounded p-2 w-100"
                          >
                            {owner != '' ? owner : 'Choose'}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item href="#" onClick={() => setOwner(currentUser?.login)}>
                              {currentUser?.login}
                            </Dropdown.Item>
                            {orgs &&
                              Array.isArray(orgs) &&
                              orgs.map((og, index) => {
                                return (
                                  <Dropdown.Item href="#" key={index} onClick={() => setOwner(og?.login)}>
                                    {og?.login}
                                  </Dropdown.Item>
                                );
                              })}
                          </Dropdown.Menu>
                        </Dropdown>
                        <div className="invalid-drop"> {owner == '' && validated && 'Please provide owner name'}</div>
                      </Form.Group>

                      {/* <Dropdown>
                          <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Dropdown Button
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                          </Dropdown.Menu>
                    </Dropdown> */}

                      <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Description</Form.Label>
                        <InputGroup>
                          <Form.Control as="textarea" rows={3} ref={repo_description} />
                        </InputGroup>
                      </Form.Group>

                      <Form.Group className="mb-3 d-flex" controlId="formBasicCheckbox " required>
                        <Form.Check
                          type="checkbox"
                          name="group"
                          label="Private"
                          className="me-3 "
                          disabled={publicCheck}
                          onChange={(e) => setPrivateCheck(e.target.checked)}
                          ref={priCheck}
                          defaultChecked={true}
                        />
                        <Form.Check
                          type="checkbox"
                          name="group"
                          label="Public"
                          disabled={privateCheck ?? true}
                          onChange={(e) => setPublicCheck(e.target.checked)}
                          ref={pubCheck}
                          defaultChecked={false}
                        />
                      </Form.Group>
                      <Button variant="primary" className="signin" type="submit">
                        Add repository
                      </Button>
                    </Form>
                  </div>
                </Col>
              ) : (
                <Col sm={6}>
                  <TailSpin
                    height="40"
                    width="40"
                    color="#6610f2"
                    ariaLabel="tail-spin-loading"
                    radius="1"
                    wrapperStyle={{
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    wrapperClass=""
                    visible={true}
                  />
                </Col>
              )
            ) : (
              <Col sm={6}>
                <h3 className="text-red fw-normal fs-4 text-primary"> New Repository Created!</h3>
              </Col>
            )}

            <Col sm={6}>
              <img src={group} alt="group" className="right_img" />
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default SpnAddRepositoryScreen;
