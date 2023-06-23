import {
  Button,
  Row,
  Container,
  Col,
  Card,
  Form,
} from "react-bootstrap";
import SpnTopBar from "../components/SpnTopBar";
import SpnRepositoryPreviewView from "../components/SpnRepositoryPreviewView";
import spandericon from "../assets/images/icon.svg";


import noresults from "../assets/images/no-results.png";
import empty from "../assets/images/empty.svg";
import search from "../assets/images/inputprefi.svg";
import { useEffect, useState } from "react";
import { getAllRepositories, getAllRepositoriesByPage } from "../api/getAllRepositories";
import { useDispatch, useSelector } from "react-redux";
import { setRepositories } from "../slices/allRepositoryDetails";
import { TailSpin } from "react-loader-spinner";
import Paginate from "../components/Paginate";
import { getToken } from "../utils/accessToken";
import { Octokit } from "@octokit/core";
import { getUserDetails } from "../api/getUserDetails";
import { useLocation, useNavigate } from "react-router-dom";
import { setLoginUserDetails } from "../slices/loginUserDetailsSlice";
import { setOrgsDetails } from "../slices/orgsDetails";
import { useMediaQuery } from "react-responsive"
import InfiniteScroll from 'react-infinite-scroll-component';

// const data = [

//   {
//     id: 1,
//     title: "Fullscreen-image-slider-jquery-plugin",
//     descritpion: "Bootstrap Javascript jQuery Carousel/Slider/Slideshow/Gallery/Banner Responsive Image - http://jssor.com",
//     date: "2, Sept 2020",
//     Public: true,
//     moreinfo: "Bootstrap Javascript jQuery Carousel/Slider/Slideshow/Gallery/Banner Responsive Image - http://jssor.com",
//     image: tree,

//   },

//   {
//     id: 2,
//     title: "Fullscreen-image-slider-jquery-plugin",
//     descritpion: "Bootstrap Javascript jQuery Carousel/Slider/Slideshow/Gallery/Banner Responsive Image - http://jssor.com",
//     date: "4, Sept 2020",
//     Public: false,
//     moreinfo: "Bootstrap Javascript jQuery Carousel/Slider/Slideshow/Gallery/Banner Responsive Image - http://jssor.com",
//     image: tree,

//   },

//   {
//     id: 3,
//     title: "Fullscreen-image-slider-jquery-plugin",
//     descritpion: "Bootstrap Javascript jQuery Carousel/Slider/Slideshow/Gallery/Banner Responsive Image - http://jssor.com",
//     date: "5, Sept 2020",
//     Public: false,
//     moreinfo: "Bootstrap Javascript jQuery Carousel/Slider/Slideshow/Gallery/Banner Responsive Image - http://jssor.com",
//     image: tree,

//   },

//   {
//     id: 4,
//     title: "Fullscreen-image-slider-jquery-plugin",
//     descritpion: "Bootstrap Javascript jQuery Carousel/Slider/Slideshow/Gallery/Banner Responsive Image - http://jssor.com",
//     date: "7, Sept 2020",
//     Public: false,
//     moreinfo: "Bootstrap Javascript jQuery Carousel/Slider/Slideshow/Gallery/Banner Responsive Image - http://jssor.com",
//     image: tree,

//   },

//   {
//     id: 5,
//     title: "Fullscreen-image-slider-jquery-plugin",
//     descritpion: "Bootstrap Javascript jQuery Carousel/Slider/Slideshow/Gallery/Banner Responsive Image - http://jssor.com",
//     date: "2, Sept 2020",
//     Public: true,
//     moreinfo: "Bootstrap Javascript jQuery Carousel/Slider/Slideshow/Gallery/Banner Responsive Image - http://jssor.com",
//     image: tree,

//   },

//   {
//     id: 6,
//     title: "Fullscreen-image-slider-jquery-plugin",
//     descritpion: "Bootstrap Javascript jQuery Carousel/Slider/Slideshow/Gallery/Banner Responsive Image - http://jssor.com",
//     date: "4, Sept 2020",
//     Public: false,
//     moreinfo: "Bootstrap Javascript jQuery Carousel/Slider/Slideshow/Gallery/Banner Responsive Image - http://jssor.com",
//     image: tree,

//   },

//   {
//     id: 7,
//     title: "Fullscreen-image-slider-jquery-plugin",
//     descritpion: "Bootstrap Javascript jQuery Carousel/Slider/Slideshow/Gallery/Banner Responsive Image - http://jssor.com",
//     date: "5, Sept 2020",
//     Public: false,
//     moreinfo: "Bootstrap Javascript jQuery Carousel/Slider/Slideshow/Gallery/Banner Responsive Image - http://jssor.com",
//     image: tree,

//   },

//   {
//     id: 8,
//     title: "Fullscreen-image-slider-jquery-plugin",
//     descritpion: "Bootstrap Javascript jQuery Carousel/Slider/Slideshow/Gallery/Banner Responsive Image - http://jssor.com",
//     date: "7, Sept 2020",
//     Public: false,
//     moreinfo: "Bootstrap Javascript jQuery Carousel/Slider/Slideshow/Gallery/Banner Responsive Image - http://jssor.com",
//     image: tree,

//   },

//   {
//     id: 9,
//     title: "Fullscreen-image-slider-jquery-plugin",
//     descritpion: "Bootstrap Javascript jQuery Carousel/Slider/Slideshow/Gallery/Banner Responsive Image - http://jssor.com",
//     date: "7, Sept 2020",
//     Public: false,
//     moreinfo: "Bootstrap Javascript jQuery Carousel/Slider/Slideshow/Gallery/Banner Responsive Image - http://jssor.com",
//     image: tree,

//   },

// ]
const SpnNoRepositoriesView = (props) => (
  <>
    <section className="multi_colums repositories py-3 ">
      <Container>
        <Row className="row  align-items-md-center">
          <Col sm={6}>
            <div className="content_box x">
              <img src={spandericon} alt="spander icon" />
              <h2 className="text-primary"> Welcome Itay</h2>
              <p className="des text-body">
                You don’t have any <a href="/terms"> Repositories </a> on your
                Github account yet. Start a new repository to create your first
                project.
              </p>
              <Button variant="primary" className="signin ">
                {" "}
                Start a new Repository
              </Button>
            </div>
          </Col>
          <Col sm={6}>
            <img src={empty} alt="empty" className="right_img" />
          </Col>
        </Row>
      </Container>
    </section>
  </>
);

const SpnRepositoriesScreen = (props) => {
  const perPageItemsCount = 9
  const [reposList, setAllRepositories] = useState([]);
  const [searchVal, setSearchValue] = useState("");
  const [selectedRepo, setSelectedRepo] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [reposPerPage] = useState(9)
  const skip = (currentPage - 1) * reposPerPage
  const show = currentPage * reposPerPage
  const [lengthOfRepos, setLengthOfRepos] = useState(reposList?.length);
  const [currUser, setCurrUser] = useState({})
  const [ownerFilterItem, setOwner] = useState('');
  const [orgs, setOrgs] = useState([])
  const [isLoading, setLoading] = useState(true);
  const [currPage, setCurrPage]= useState(1)
  const localItems = localStorage.getItem("user");
  const [isAllReposLoaded, setIsAllReposLoaded]=useState(false)
  const user = JSON.parse(localItems);
  const dispatch = useDispatch();
  const orgsState = useSelector(
    (state) => state.orgsDetailSlice
  );
  const state = useSelector(
    (state) => state.loginUserDetailsSlice.loginUserDetails
  );
  const isMobile = useMediaQuery({ maxWidth: 767 });
    const { state : locationState} = useLocation()
    useEffect(()=>{
      if(typeof locationState?.page=='number'){
        setCurrentPage(locationState?.page)
      }
    },[locationState])
  useEffect(() => {
    const getUsers = async () => {
      if (!state.userData) {
        const data = await getUserDetails();
        dispatch(setLoginUserDetails({ ...user, data: data }));
      }
    };
    getUsers();
  }, []);




  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate()
  function openModal() {
    setShowModal(true);
  }
  const octokit = new Octokit({
    auth: getToken()
  })
  useEffect(() => {
    const token = getToken()
    if (!token) {
      navigate('/login', { replace: true })
    }
  }, [])
  useEffect(() => {
    setLengthOfRepos(reposList.filter(filterData)?.length)
  }, [searchVal, ownerFilterItem])

  const loadRepositories = async () => {
    let data = []
    if(isMobile){
        const {data : resData, page, perPage, isLastPage} = await getAllRepositoriesByPage(currPage,perPageItemsCount);
        data = resData
    }else{
      data = await getAllRepositories();
    }
    // const user = await getUserDetails();
    if (orgsState.orgs.length != 0) {
      setOrgs(orgsState.orgs)
    } else {
      const orgs = await octokit.request('GET /user/orgs')
      setOrgs(orgs?.data)
      dispatch(setOrgsDetails({ orgData: orgs?.data }))
    }
    setCurrUser(state.userData)
    dispatch(setRepositories(data));
    setAllRepositories(data);
    setSelectedRepo(data[0])
    setLengthOfRepos(data?.length)
    if (data) {
      setLoading(false)
    }
  };
  const fetchRepositories =async (pageNumber)=>{
    setCurrPage(pageNumber)
    const {data : resData, isLastPage} = await getAllRepositoriesByPage(pageNumber,perPageItemsCount);
    const updatedRepos = (reposList||[]).concat(resData||[])
    dispatch(setRepositories(updatedRepos));
    setAllRepositories(updatedRepos);
    setSelectedRepo(updatedRepos[0])
    setLengthOfRepos(updatedRepos?.length)
    if(isLastPage){
      setIsAllReposLoaded(true)
    }
    return 
  }
  useEffect(() => {
    loadRepositories();
  }, []);
  
  const filterData = (i) => {
    let isVal = true;

    if (ownerFilterItem !== '') {
      isVal = ownerFilterItem != 'Owner: all' ? i?.owner?.login === ownerFilterItem : true
      if (searchVal != "") {
        if (ownerFilterItem === "Owner: all") {
          isVal = i?.name?.toLowerCase().indexOf(searchVal.toLowerCase()) !== -1
        }
        else
          isVal = i?.owner?.login === ownerFilterItem && i?.name?.toLowerCase().indexOf(searchVal.toLowerCase()) !== -1
      }
    } else if (searchVal !== '') {
      isVal = i?.name?.toLowerCase().indexOf(searchVal.toLowerCase()) !== -1
    }

    return isVal
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  }
  const fetchNext = async ()=>{
    await fetchRepositories(currPage+1)
  }
  return (
    <>
      {false ? (
        <SpnNoRepositoriesView />
      ) : (
        <>
          <SpnTopBar />
          <section className="repositories_Data">
            <Container>
              <Row>
                {/*  search filter */}
                <Col sm={12}>
                  <Form className="search_box ">
                    <div className="form_group owner">
                      <Form.Select
                        aria-label="Default select example"
                        onChange={(e) => setOwner(e.target.value)}
                      >
                        <option>Owner: all</option>
                        <option value={currUser?.login}>{currUser?.login}</option>
                        {orgs &&
                          Array.isArray(orgs) &&
                          orgs.map((og, index) => {
                            return (
                              <option value={og?.login}>{og?.login}</option>
                            );
                          })}
                      </Form.Select>
                    </div>

                    <div className="form_group  border rounded-1">
                      <img src={search} alt="search" className="p-1" />
                      <Form.Control
                        type="text"
                        placeholder="Find a repository…"
                        className="border-0"
                        onChange={(e) => setSearchValue(e.target.value)}
                      />
                    </div>

                    {/* <Button variant="primary" type="submit">
                      Search
                    </Button> */}
                  </Form>
                </Col>
                {/*  cards  */}
                <Col md={12} lg={9}>

                  <div className="left_part">

                    <Row>
                      {!isLoading ? ((reposList.length != 0) ? (
                        <>
                          {Array.isArray(reposList) && !isMobile && 
                                 reposList
                                .filter(filterData)
                                .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
                                .slice(skip, show).map((items, index) => (
                              <Col
                                key={index}
                                md={6}
                                lg={4}
                                className="card_cols"
                                onClick={openModal}
                              >
                                <Card
                                  className={`${items?.name == selectedRepo.name && "border border-2 border-primary"} bg-100 pointer border border-2 border-transparent data_Card`}
                                  onClick={() => setSelectedRepo(items)}
                                >
                                  <Card.Body>
                                    <Card.Title className={items?.name == selectedRepo.name && "text-primary"}>{items.name}</Card.Title>
                                    <Card.Text className="text-600">
                                      {items.description}
                                    </Card.Text>
                                  </Card.Body>
                                  <Card.Footer className="text-muted border-0">
                                    <span className="text-body">
                                      {new Date(
                                        items.created_at
                                      ).toDateString()}
                                    </span>
                                    {!items.private ? (
                                      <Button className="bg-purple-300 border-0 fw-bold">
                                        Public
                                      </Button>
                                    ) : (
                                      <Button className="bg-green-300 border-0 fw-bold">
                                        Private
                                      </Button>
                                    )}
                                  </Card.Footer>
                                </Card>
                              </Col>
                            ) )}
                        
                        {Array.isArray(reposList) && isMobile && 
                          <InfiniteScroll
                          dataLength={reposList.length}
                          next={fetchNext}
                          // style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
                          // inverse={true} //
                          hasMore={!isAllReposLoaded}
                          loader={<h4>Loading...</h4>}
                          // scrollableTarget="scrollableDiv"
                        >
                                {reposList
                                .filter(filterData)
                                .map((items, index) => (
                              <Col
                                key={index}
                                md={6}
                                lg={4}
                                className="card_cols"
                                onClick={openModal}
                              >
                                <Card
                                  className={`${items?.name == selectedRepo.name && "border border-2 border-primary"} bg-100 pointer border border-2 border-transparent data_Card`}
                                  onClick={() => setSelectedRepo(items)}
                                >
                                  <Card.Body>
                                    <Card.Title className={items?.name == selectedRepo.name && "text-primary"}>{items.name}</Card.Title>
                                    <Card.Text className="text-600">
                                      {items.description}
                                    </Card.Text>
                                  </Card.Body>
                                  <Card.Footer className="text-muted border-0">
                                    <span className="text-body">
                                      {new Date(
                                        items.created_at
                                      ).toDateString()}
                                    </span>
                                    {!items.private ? (
                                      <Button className="bg-purple-300 border-0 fw-bold">
                                        Public
                                      </Button>
                                    ) : (
                                      <Button className="bg-green-300 border-0 fw-bold">
                                        Private
                                      </Button>
                                    )}
                                  </Card.Footer>
                                </Card>
                              </Col>
                            ) )}
                            </InfiniteScroll>}
                          {(reposList.length === 0) && (
                            <div className="custom_warning_msg">
                              <img src={noresults} alt="noresults" />
                              <h3 > No repositories matched your search. </h3>
                            </div>
                          )}

                          {(reposList.filter(filterData).length === 0) && (
                            <div className="custom_warning_msg">
                              <img src={noresults} alt="noresults" />
                              <h3 > No Repository Found! </h3>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="custom_warning_msg">
                          <img src={noresults} alt="noresults" />
                          <h3 > No repositories matched your search. </h3>
                        </div>

                      )
                        // TODO: <button>start your first repository</button> <span>Start with Spander your first repository on Github</span>
                      ) : (<TailSpin
                        height="80"
                        width="80"
                        color="#6610F2"
                        ariaLabel="tail-spin-loading"
                        radius="1"
                        wrapperStyle={{
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        wrapperClass=""
                        visible={true}
                      />
                      )}



                    </Row>

                    <div className="paginations">
                      {lengthOfRepos != 0 && (
                        <Paginate
                          reposPerPage={reposPerPage}
                          totalRepos={lengthOfRepos}
                          paginate={paginate}
                          className="paginationWrap"
                          currentPage={currentPage}
                        />
                      )}
                    </div>

                  </div>
                </Col>

                {/*  more details  */}
                <Col md={12} lg={3}>
                  <SpnRepositoryPreviewView
                    selectedRepo={selectedRepo}
                    showModal={showModal}
                    setShowModal={setShowModal}
                  />
                </Col>
              </Row>
            </Container>
          </section>
        </>
      )
      }
    </>
  );
};

export default SpnRepositoriesScreen;
