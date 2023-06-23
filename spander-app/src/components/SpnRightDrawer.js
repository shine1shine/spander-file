import React, { useEffect, useState } from 'react';
import close from '../assets/images/closseicon.svg';
import edit from '../assets/images/editicon.svg';
import issue from '../assets/images/issue.svg';
import closeissue from '../assets/images/close-issue.svg';
import closseicon from '../assets/images/check.svg';
import Root from './rightdrawer/Root';
import { getGithubIssue } from '../api/createGithubIssue';

export const SpnRightDrawer = ({
  isActive,
  createIssue,
  setIssue,
  handleCloseRightIssueTab,
  currRepository,
  activeClass,
  updateGithubIssues = () => {},
  handleSaveTreeContent = () => {},
  menuRef,
  selectedIssue,
  setSelectedIssue,
  setOpenCloseIssue
}) => {
  const [dataLoading, setDataLoading] = useState(false);
  const [issueDetails, setIssueDetails] = useState(selectedIssue ?? {});
  const [hasInputChanged, setHasInputChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchInitialData = async () => {
    // Set dataLoading to true before the data fetching starts
    setDataLoading(true);

    const res = await getGithubIssue({ currRepository, issue_number: createIssue?.node?.issueDetails?.number });
    setIssueDetails({ ...res?.data, bodyText: res?.data?.body ?? '' }); 
    setHasInputChanged(false); 

    // Check if the fetched issue state is different from the current issue state
    if (res?.data?.state !== createIssue.node.issueDetails.state) {
      // Update the issue state in the tree content
      createIssue.node.issueDetails.state = res?.data?.state;
      handleSaveTreeContent();
    }

    // setIssueDetails({ ...res?.data, bodyText: res?.data?.body ?? '' });
    // setHasInputChanged(false);


    // Set dataLoading to false after data is fetched
    setDataLoading(false);
  };

  const handleCloseOrOpenIssue = async () => {
    const newState = issueDetails.state === 'closed' ? 'open' : 'closed';
    setIssueDetails((prevDetails) => ({ ...prevDetails, state: newState }));
    createIssue.node.issueDetails.state = newState;
    setOpenCloseIssue(createIssue?.node?.issueDetails)
    await handleSaveTreeContent(); // Wait for saving the tree content

    // Update the issue state on GitHub
    await updateGithubIssues({ state: newState, id: createIssue?.node?.issueDetails?.id });
  };

  useEffect(() => {
    if (isActive) {
      void fetchInitialData();
    }
    return () => {
      setSelectedIssue(null);
    };
  }, [createIssue, isActive]);

  useEffect(() => {
    setIssueDetails((prevDetails) => ({ ...prevDetails, bodyText: prevDetails?.body ?? '' }));
  }, [selectedIssue]);

  return (
    <>
      {dataLoading ? (
        // Render a loader or placeholder here
        <div>Loading...</div>
      ) : (
        // Your component code here
        <div className={isActive || activeClass ? `SpnRightDrawer_wrapper active` : `SpnRightDrawer_wrapper`}>
          <div className="drawer_backdrop"></div>
          <div className="SpnRightDrawer" ref={menuRef}>
            {activeClass && <Root currRepository={currRepository} handleCloseRightIssueTab={handleCloseRightIssueTab} />}

            <div className="Drawe_header">
              <div className="left">
                <span className={issueDetails.state == 'closed' ? 'issue_btn close' : 'issue_btn open'}>
                  {issueDetails.state == 'closed' ? (
                    <>
                      <img src={closseicon} alt="issue" /> <i> Closed </i>
                    </>
                  ) : (
                    <>
                      <img src={issue} alt="issue" /> <i> Open</i>
                    </>
                  )}
                </span>
                <span> #{createIssue?.node?.issueDetails?.number} </span>
              </div>
              <div className="right">
                <button>
                  <a href={createIssue?.node?.issueDetails?.html_url} target="_blank">
                    <img src={edit} alt="edit" />
                  </a>
                </button>
                <button>
                  <img
                    src={close}
                    alt="close"
                    onClick={(e) => {
                      handleCloseRightIssueTab();
                    }}
                  />
                </button>
              </div>
            </div>
            <div className="Drawe_body">
              <h1> {createIssue?.node?.name} </h1>
              <div className="texteditor_box">
                <label> Description </label>
                <textarea
                  placeholder="Leave a comment"
                  autoFocus
                  onChange={(e) => {
                    setIssueDetails((prevDetails) => ({ ...prevDetails, bodyText: e.target.value }));
                    setHasInputChanged(true);
                  }}
                  value={issueDetails?.bodyText}
                ></textarea>
              </div>
              <div className="action_row">
                <button className="close_issue" onClick={handleCloseOrOpenIssue}>
                  {issueDetails.state === 'open' ? (
                    <>
                      <img src={closeissue} alt="closeissue" />
                      <span> Close issue </span>
                    </>
                  ) : (
                    <>
                      <img src={closeissue} alt="openissue" />
                      <span> Open issue </span>
                    </>
                  )}
                </button>
                <button
                  className="update_comment"
                  onClick={async () => {
                    setIsLoading(true); // Set loading state to true when the button is clicked
                    try {
                      await updateGithubIssues({ body: issueDetails.bodyText, id: createIssue?.id });
                      handleSaveTreeContent();
                    } catch (error) {
                      // Handle your error here
                      console.error(error);
                    } finally {
                      setIsLoading(false); // Reset loading state after the operation is complete (regardless of success or failure)
                      setHasInputChanged(false);
                    }
                  }}
                  disabled={!hasInputChanged} // Disable the button when data is loading or when there is no input change
                >
                  {isLoading ? (
                    <span className="spinner"></span> // Add your own spinner component or element here
                  ) : (
                    'Update comment'
                  )}
                </button>
              </div>
              <p className="additional">
                for additional editing option{' '}
                <a href={createIssue?.node?.issueDetails?.html_url} target="_blank">
                  open this issue on github
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
