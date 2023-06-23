// import { Base64 } from "js-base64";
import React, { useState, useEffect } from "react";
import { TailSpin } from "react-loader-spinner";
import { getReadmeDetails } from "../../api/getReadme";
import close from "../../assets/images/closseicon.svg";
import edit from "../../assets/images/editicon.svg";
import sp from "../../assets/images/sp.svg";
// import { Link } from "react-router-dom";



const Root = ({ currRepository, handleCloseRightIssueTab }) => {
  const [readme, setReadme] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const getReadme = async () => {
      let userData = await getReadmeDetails({ currRepository });
      setLoading(false);
      setReadme(userData?.data);
    };
    getReadme();
  }, [currRepository]);

  useEffect(() => {
    if (readme == null) {
      setLoading(false);
    }
  }, [readme]);

  return (
    <>
      <div className="Drawe_header">
        <div className="left">
          <span className="issue_btn public text-white">
            {" "}
            {currRepository?.private ? "Private" : "Public"}{" "}
          </span>
        </div>
        <div className="right">
          <button>
            <a href={currRepository?.svn_url + "#readme"} target="_blank">
              <img src={edit} alt="edit" />
            </a>
          </button>
          <button onClick={handleCloseRightIssueTab}>
            {" "}
            <img src={close} alt="close" />{" "}
          </button>
        </div>
      </div>
      <div className="Drawe_body">
        {/* if root have data  */}
        {!isLoading ? (
          readme != null ? (
            <>
              <h1> {currRepository?.name}</h1>
              <div dangerouslySetInnerHTML={{__html: readme}}></div>
              <p className="additional">
                {" "}
                To edit and fill the Readme.md on Github file, click on edit{" "}
              </p>
              <button className="btn-purple"><a href={currRepository?.svn_url + "#readme"} target="_blank" className="text-decoration-none text-white"> Edit Read.me </a></button>
            </>
          ) : (
            <div className="empty">
              <img src={sp} alt="sp" />
              <h6> No content exist yet</h6>
              <p className="additional">
                {" "}
                To edit and fill the Readme.md on Github file, click on edit{" "}
              </p>
              <button className="btn-purple mt-3"><a href={currRepository?.svn_url + "#readme"} className="text-white text-decoration-none" target="_blank"> Edit Read.me </a></button>
            </div>
          )
        ) : (
          <TailSpin
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        )}
      </div>
      
    </>
  );
};
export default Root;
