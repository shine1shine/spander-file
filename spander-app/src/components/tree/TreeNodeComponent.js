// TreeNodeComponent.js
import React, { useEffect, useRef, useState } from 'react';
import { TreeNode } from 'react-organizational-chart';
import { Form, OverlayTrigger, Tooltip, Modal, Button } from 'react-bootstrap'; // assuming you are using react-bootstrap
import deleteicon from '../../assets/images/delete.svg';
import issue from '../../assets/images/issue.svg';

const TreeNodeComponent = ({
  treeNode,
  level,
  handleTextArea,
  setCurrSelectedIdx,
  isChanged,
  preventOnBlur,
  handleSaveTreeContent,
  isChecked,
  handleCheckboxChange,
  handleCreateGithubIssue,
  setIssue,
  setDeleteClick,
  deleteNodeShow,
  getGithubIssue,
  currRepository,
  onAddNode,
  renderTree,
  touchEvents,
  setGithubIssue,
  setSelectedIssue,
  openCloseIssue
}) => {
  const [textValue, setTextValue] = useState(treeNode?.name ?? '');
  const [onBlurTextValue, setOnBlurTextValue] = useState(treeNode?.name ?? '');
  const [hasChanges, setHasChanges] = useState(false);
  const debounceTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      // Clear the debounce timeout when the component unmounts
      clearTimeout(debounceTimeoutRef.current);
    };
  }, []);
  const handleTextBlur= async(e)=>{
    const newTextValue = e.target.value;
    clearTimeout(debounceTimeoutRef.current);
    setHasChanges(true);
    if (onBlurTextValue !== newTextValue) {
      await handleTextArea(e, treeNode.uniqueIndex);
      setCurrSelectedIdx(treeNode.uniqueIndex);
      await handleSaveTreeContent();
      setOnBlurTextValue(newTextValue);
      setTextValue(newTextValue);
    }
   
  }

  const handleTextAreaChange = (e) => {
    const newTextValue = e.target.value;
    setTextValue(newTextValue);
    setHasChanges(true);

    // Clear the previous debounce timeout
    clearTimeout(debounceTimeoutRef.current);

    // Set up a new debounce timeout
    debounceTimeoutRef.current = setTimeout(async () => {
      await handleTextArea(e, treeNode.uniqueIndex);
      setCurrSelectedIdx(treeNode.uniqueIndex);
      await handleSaveTreeContent();
    }, 2000);
  };

  const handleCheckboxChangeAndSave = async (event, index) => {
    // This should update the treeNode state and return a promise that resolves when done
    await handleCheckboxChange(event, index);

    // Clear the previous debounce timeout
    clearTimeout(debounceTimeoutRef.current);

    // If there are unsaved textarea changes, save them immediately
    if (hasChanges) {
      await handleTextArea({ target: { value: textValue } }, treeNode.uniqueIndex);
      setHasChanges(false);
    }

    // Save the tree content immediately
    await handleSaveTreeContent();
  };

  const handleCreateGithubIssueAndSave = async (index, node) => {
    // Clear the previous debounce timeout
    clearTimeout(debounceTimeoutRef.current);

    // If there are unsaved textarea changes, save them immediately
    if (hasChanges) {
      await handleTextArea({ target: { value: textValue } }, treeNode.uniqueIndex);
      setHasChanges(false);
    }

    // Call original handleCreateGithubIssue and save the changes
    await handleCreateGithubIssue(index, node);
    await handleSaveTreeContent();
  };

  const [creatingNode, setCreatingNode] = useState(false);

  const handleAddNode = async (index) => {
    // Start the creation process
    setCreatingNode(true);

    try {
      // Call the provided onAddNode function
      // (this should handle the actual node creation)
      await onAddNode(index);
    } catch (error) {
      debugger;
      console.log('error: ', error);
      setCreatingNode(false);
    } finally {
      // Finish the creation process
      // (in 'finally' block to ensure this happens even if an error occurs)
      setCreatingNode(false);
    }
  };

  const handleTextAreaBlur = () => {
    // Clear the debounce timeout
    clearTimeout(debounceTimeoutRef.current);

    // Save the tree content immediately
    handleSaveTreeContent();
  };

  return (
    <TreeNode
      key={treeNode.uniqueIndex}
      label={
        <div {...touchEvents(treeNode)} className={`tree_levels level${((level - 1) % 5) + 1}`}>
          <Form.Control
            id='text-area-input'
            data-uniqueindex = {treeNode.uniqueIndex}
            className="defaultTexteditor"
            value={textValue}
            onChange={handleTextAreaChange}
            onBlur={handleTextBlur}
            as="textarea"
            autoFocus={textValue === ''}
            placeholder="please write here.."
          ></Form.Control>
          {/* top_action */}
          <div className="top_action">
            {treeNode?.isGithubIssue ? (
              <>
                <div
                  className="close_issue_div"
                  onClick={async () => {
                    getGithubIssue({ currRepository, issue_number: treeNode?.issueDetails?.number })
                      .then((res) => {
                        setSelectedIssue(res?.data);
                      })
                      .catch((err) => err)
                      .finally(() => {
                        setIssue({
                          id: treeNode?.uniqueIndex,
                          node: treeNode,
                        });
                        setGithubIssue(true);
                      });
                  }}
                >
                  <div>
                    <OverlayTrigger placement="top" overlay={<Tooltip>Close issue</Tooltip>}>
                      <span> #{treeNode?.issueDetails?.number}</span>
                    </OverlayTrigger>
                  </div>
                  {treeNode?.issueDetails?.state === 'closed' || (openCloseIssue?.state === 'closed' && openCloseIssue?.number === treeNode?.issueDetails?.number)? (
                    <div>
                      <p>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M8 14C4.68629 14 2 11.3137 2 8V8C2 4.68629 4.68629 2 8 2V2C11.3137 2 14 4.68629 14 8V8C14 11.3137 11.3137 14 8 14V14Z"
                            fill="#6610F2"
                            stroke="#F8F9FA"
                          />
                          <path d="M7.5 9.5L6 8" stroke="#F8F9FA" />
                          <path d="M10 7L7.5 9.5" stroke="#F8F9FA" />
                        </svg>
                      </p>

                      <b>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3.66508 7.99998H12.3351" stroke="#F8F9FA" />
                          <path d="M3.66508 10.6677H12.3351" stroke="#F8F9FA" />
                          <path d="M3.66486 5.33225H12.3349" stroke="#F8F9FA" />
                        </svg>
                      </b>
                    </div>
                  ) : (
                    <div>
                      <img src={issue} alt="issue" />
                      <b>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3.66508 7.99998H12.3351" stroke="#F8F9FA" />
                          <path d="M3.66508 10.6677H12.3351" stroke="#F8F9FA" />
                          <path d="M3.66486 5.33225H12.3349" stroke="#F8F9FA" />
                        </svg>
                      </b>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip> {isChecked ? ' Mark as not done' : 'Mark as done'} </Tooltip>}
                >
                  <div className="check_box" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-tooltip="Tooltip text">
                    <label
                      className="custom-checkbox"
                      onMouseEnter={() => {
                        preventOnBlur.current = true;
                      }}
                      onMouseLeave={() => {
                        preventOnBlur.current = false;
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={treeNode?.nonGithubIssueDetail?.markAsDone}
                        onChange={(event) => handleCheckboxChangeAndSave(event, treeNode.uniqueIndex)}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                </OverlayTrigger>

                <OverlayTrigger placement="top" overlay={<Tooltip>Convert to issue</Tooltip>}>
                  <div
                    className="convert_to_issue"
                    onClick={async () => {
                      await handleCreateGithubIssueAndSave(treeNode.uniqueIndex, treeNode);
                      setIssue({
                        id: treeNode.uniqueIndex,
                        node: {
                          ...treeNode,
                          issueDetails: {
                            ...treeNode.issueDetails,
                            state: isChecked ? 'closed' : 'open',
                          },
                        },
                      });
                      setGithubIssue(true);
                    }}
                  >
                    <img src={issue} alt="issue" />
                  </div>
                </OverlayTrigger>

                <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                  <div
                    className="top_delete"
                    onClick={() => {
                      setDeleteClick(treeNode);
                      deleteNodeShow();
                    }}
                  >
                    <img src={deleteicon} alt="issue" />
                  </div>
                </OverlayTrigger>
              </>
            )}
          </div>
          <button id="addNode" onClick={(e) => handleAddNode(treeNode.uniqueIndex)} disabled={creatingNode}>
            +
          </button>
        </div>
      }
    >
      {treeNode.childNodes.map((node, index) => (
        <React.Fragment key={node.uniqueIndex}>{renderTree(node, level + 1, false)}</React.Fragment>
      ))}
    </TreeNode>
  );
};

export default TreeNodeComponent;
