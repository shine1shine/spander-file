import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import tree from "../assets/images/tree.png";
import { Link } from "react-router-dom";

const SpnRepositoryPreviewView = ({
  selectedRepo,
  showModal,
  setShowModal,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      const screenWidth = window.innerWidth;
      setIsMobile(screenWidth < 768);
    }

    // Set the initial state based on the screen width
    handleResize();

    // Listen for the window resize event and update the state accordingly
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleClose = () => setShowModal(false);
  const [currRepo, setCurrentRepo] = useState(selectedRepo);
  useEffect(() => {
    setCurrentRepo(selectedRepo);
  }, [selectedRepo]);
  return (
    <>
      {isMobile ? (
        <div className="more_info_mobile">
          <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>{currRepo?.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {" "}
              <p className="text-600"> {currRepo?.description} </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      ) : (
        <div className="more_info ">

          <div className="top_content">



            {/* <h3> {currRepo?.name} </h3>
            {currRepo?.description && (
              <p className="text-600">
                {" "}
                {currRepo?.description}
              </p>
            )} */}
            {/* <img src={tree} alt="tree" /> */}
                    {/* <h3 className='body-text'> More Info</h3> */}
          <h3> {currRepo?.name} </h3>
          {currRepo?.description && (
            <p className="text-600">
              {" "}
              {currRepo?.description}
              <img src={tree} alt="tree" />
            </p>
          )}

                     <h3 className='body-text'> More Info</h3>
                    <p className='text-600'>Bootstrap Javascript jQuery Carousel/Slider/Slideshow/Gallery/Banner Responsive
                        Image - http://jssor.com, Bootstrap Javascript jQuery Carousel/Slider/Slideshow/Gallery/Banner Responsive Image - http://jssor.com
                    </p>


          </div>
          <Link to={`/repository/${currRepo?.id}`}>
            <Button variant="primary" className="border-0 w-100">
              Open Repository
            </Button>
          </Link>
        </div>
      )}
    </>
  );
};
export default SpnRepositoryPreviewView;
