import React, { useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import TreeComponent from './tree/TreeComponent';
import TreeNodeComponent from './tree/TreeNodeComponent';
import FilterButtons from './tree/FilterButtons';
import FilterOverlay from './tree/FilterOverlay';
import ZoomButton from './tree/ZoomButton';
import LoadingSpinner from './tree/LoadingSpinner';
import { Button, Modal } from 'react-bootstrap';
import zoomin from '../assets/images/zoomin.svg';
import zoomout from '../assets/images/zoomout.svg';
import reset from '../assets/images/reset.svg';

import { SpnRightDrawer } from './SpnRightDrawer';
import { getContentOfRepository } from '../api/getContentOfRepository';
import { postContentToRepository, updatContent } from '../api/postContentsToRepository';
import { Base64 } from 'js-base64';
import { convertCircularStructureToJson } from '../utils/convertCircularStructureToJson';
import { createGithubIssue, getGithubIssue, updateGithubIssue } from '../api/createGithubIssue';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';

let selectedUniqueIndex = -1;
let isPanning = -1;
const SpnTreeView = (props) => {
  const { currRepository } = props;
  const [isDragging, setIsDragging] = useState(false);
  const [currentRepoUpdated, setCurrentRepoUpdated] = useState(false);
  const [user, setUser] = useState(null);
  const [repoContent, setRepoContent] = useState({});
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [openCloseIssue, setOpenCloseIssue] = useState(null)
  const rootNode = {
    name: '',
    uniqueIndex: 0,
    childNodes: [],
    parentNode: null,
    isGithubIssue: false,
    nonGithubIssueDetail: {
      markAsDone: false,
    },
    issueDetails: {},
  };
  const [treeNodes, setTree] = useState(rootNode);
  const [boxText, setBoxText] = useState('');
  const [currSelectedIdx, setCurrSelectedIdx] = useState(0);
  const [githubIssue, setGithubIssue] = useState(false);
  const [createIssue, setIssue] = useState({
    id: 0,
    node: {},
  });
  const [activeClass, setActiveClass] = useState(false);
  const [deleteClick, setDeleteClick] = useState(null);
  const [isChanged, setIsChanged] = useState(false);
  const [treeIsLoading, setTreeIsLoading] = useState(true);
  const preventOnBlur = useRef(false);

  const state = useSelector((state) => state.loginUserDetailsSlice.loginUserDetails);

  const getUser = async () => {
    setUser(state.userData);
  };

  const getContent = async () => {
    try {
      const res = await getContentOfRepository({ currRepository });
      setRepoContent(res?.data);
      setCurrentRepoUpdated(true);
      setTreeIsLoading(false);
    } catch (err) {
      console.log(err, 'ERR');
    }
  };

  const sendContent = async () => {
    const rootNode = {
      name: currRepository?.name,
      uniqueIndex: 0,
      childNodes: [],
      parentNode: null,
      issueDetails: {},
      isGithubIssue: false,
      nonGithubIssueDetail: {
        markAsDone: false,
      },
    };

    let response;
    const data = convertCircularStructureToJson({ treeNodes: rootNode });
    try {
      if (Object.entries(repoContent).length === 0) {
        response = await postContentToRepository({
          currRepository,
          user,
          base64Content: Base64.encode(data),
        });
      }
      if (response) {
        const res = await getContentOfRepository({ currRepository });
        setRepoContent(res?.data);
        setTreeIsLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const rootNode = {
      name: currRepository?.name,
      uniqueIndex: 0,
      childNodes: [],
      parentNode: null,
      issueDetails: {},
      isGithubIssue: false,
      nonGithubIssueDetail: {
        markAsDone: false,
      },
    };
    setTree(rootNode);

    getUser();
    if (currRepository?.name && !currentRepoUpdated) {
      getContent();
    }
    if (currRepository?.name && repoContent?.sha?.length > 0) {
      sendContent();
    }
  }, [currRepository]);

  const handleSaveTreeContent = async (nodes) => {
    if (repoContent?.sha !== '') {

      const data = convertCircularStructureToJson({ treeNodes: omitNewNodes(nodes ?? treeNodes) });

      // toast('Saving...', {
      //   position: toast.POSITION.BOTTOM_RIGHT,
      //   theme: 'dark',
      //   autoClose: 100,
      // });
      const updatedRes = await updatContent({
        currRepository,
        user,
        base64Content: Base64.encode(data),
        sHA: repoContent?.sha,
      });

      if (updatedRes) {
        toast('SAVED TO GITHUB!', {
          position: toast.POSITION.BOTTOM_RIGHT,
          theme: 'dark',
          autoClose: 100,
          hideProgressBar: true,
        });
      }
      const res = await getContentOfRepository({ currRepository });
      setRepoContent(res?.data);
    }
    setIsChanged(false);
  };
  const initialTreeDataLoaded = useRef(false)
  useEffect(() => {
    return () => {
      initialTreeDataLoaded.current = false
    }
  }, [])
  useEffect(() => {
    if (Object.entries(repoContent).length !== 0 && !initialTreeDataLoaded.current) {
      let treeContentBase64 = repoContent?.content;
      const treeContentParsed = treeContentBase64 && JSON.parse(Base64.decode(treeContentBase64));
      setTree(treeContentParsed);
      initialTreeDataLoaded.current = true
    }
  }, [repoContent, user]);

  useEffect(() => {
    if (currSelectedIdx !== 0) {
      const newTreeNodes = { ...treeNodes };
      traverseTree(newTreeNodes, (node) => {
        if (node.uniqueIndex === currSelectedIdx) {
          node.name = boxText;
          setTree(newTreeNodes);
        }
      });
    }
  }, [currSelectedIdx]);

  const [activeButton, setActiveButton] = useState(1);

  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
  };

  const [isActive, setIsActive] = useState(false);
  function handelFilter() {
    setIsActive(!isActive);
  }

  const [isChecked, setIsChecked] = useState(false);
  function handleCheckboxChange(event, idx) {
    setIsChecked(event.target.checked);

    const newTreeNodes = { ...treeNodes };
    traverseTree(newTreeNodes, (node) => {
      if (node.uniqueIndex === idx) {
        node.nonGithubIssueDetail = {
          markAsDone: event?.target?.checked,
        };
        setTree(newTreeNodes);
      }
    });
  }

  const [delShow, setDelShow] = useState(false);

  const deleteNodeHide = () => setDelShow(false);
  const deleteNodeShow = () => setDelShow(true);
  useEffect(() => {
    preventOnBlur.current = false;
  }, []);

  const traverseTree = (node, callback) => {
    // if callback returns 'false' then
    // the function continues looping
    // otherwise 'true' will stop the loop
    // the node is passed to the custom callback
    if (callback(node)) {
      return;
    }
    // loop through all the child nodes
    node.childNodes.forEach((childNode) => {
      traverseTree(childNode, callback);
    });
  };

  const hasOldNodes = (node)=>{
    return !node.isNewNode ||  !!node.childNodes.find(childNode=>hasOldNodes(childNode))
  }
  const omitNewNodes = (node) => {
    return {
      ...node,
      childNodes: node.childNodes.filter(childNode => hasOldNodes(childNode)).map(childNode => omitNewNodes(childNode))
    }
  }

  const getUniqueKey = () => {
    return uuidv4();
  };

  const onAddNode = async (uniqueIndex) => {
    // setActiveClass(true)
    const newTreeNodes = { ...treeNodes };
    const childNodeUniqueIndex = getUniqueKey()
    traverseTree(newTreeNodes, (node) => {
      if (node.uniqueIndex === uniqueIndex) {
        node.childNodes.push({
          name: '',
          uniqueIndex: childNodeUniqueIndex,
          childNodes: [],
          parentNode: node,
          nonGithubIssueDetail: {
            markAsDone: false,
          },
          isGithubIssue: false,
          issueDetails: {},
          isNewNode: true
        });
        setTree(newTreeNodes);
        setTimeout(() => {
          const textAreaInput = document.querySelector(`[data-uniqueindex="${childNodeUniqueIndex}"]`)
          if (textAreaInput) {
            textAreaInput.focus()
          }
        }, 0)
        return true;
      }
      return false;
    });
    // await handleSaveTreeContent(newTreeNodes);
  };
  const onSetNodeText = (e, uniqueIndex) => {
    if (isPanning === 2) {
      isPanning = -1;
      return;
    }
    if (e === 'updateNodeText') {
      const newTreeNodes = { ...treeNodes };
      traverseTree(newTreeNodes, (node) => {
        if (node.uniqueIndex === selectedUniqueIndex) {
          node.name = boxText;
          setTree(newTreeNodes);
          return true;
        }
        return false;
      });
      return;
    }
    if (e.target instanceof HTMLDivElement) {
      selectedUniqueIndex = uniqueIndex;
      traverseTree(treeNodes, (node) => {
        if (node.uniqueIndex === uniqueIndex) {
          setBoxText(node.name);
          return true;
        }
        return false;
      });
    }
  };
  const touchEvents = (treeNode) => {
    return {
      onTouchStart: (e) => handleTouchEvents(e, 1),
      onTouchMove: (e) => handleTouchEvents(e, 2),
      onTouchEnd: (e) => handleTouchEvents(e, 3),
      onMouseDown: (e) => handleTouchEvents(e, 1),
      onMouseMove: (e) => handleTouchEvents(e, 2),
      onMouseUp: (e) => handleTouchEvents(e, 3, treeNode),
    };
  };
  const handleTouchEvents = (event, type, treeNode) => {
    if (type === 3) {
      //setTimeout(()=>{ isPanning=-1; },1000);
      if (isPanning === 1) {
        onSetNodeText(event, treeNode.uniqueIndex, treeNode.name);
      }
      if (!(isPanning === 2)) {
        setIsDragging(false);
      }
      isPanning = -1;
    }
    if (type === 1) isPanning = 1;
    else if (type === 2 && isPanning === 1) {
      isPanning = 2;
      setIsDragging(true);
    }
  };
  const handleDeleteNode = () => {
    const deletedNodeId = deleteClick.uniqueIndex;
    const newTreeNodes = { ...treeNodes };

    // Find the node with the specific uniqueIndex in the tree
    traverseTree(newTreeNodes, (node) => {
      // Node found
      if (node.childNodes.find((i) => i?.uniqueIndex === deletedNodeId)) {
        // Go to the parent node of node and find index in childNode array
        // Delete the node from the childNodes of the parent (thus removing itself from the tree)
        node.childNodes = node.childNodes.filter((i) => i.uniqueIndex !== deletedNodeId);
        setTree(newTreeNodes);
        handleSaveTreeContent(newTreeNodes);
        return true;
      }
      return false;
    });
    deleteNodeHide();
  };
  const handleTextArea = (e, idx) => {
    setBoxText(e.target.value);
    const newTreeNodes = { ...treeNodes };
    traverseTree(newTreeNodes, (node) => {
      if (node.uniqueIndex === idx) {
        setIsChanged(isChanged || (node.name === e.target.value))
        node.name = e.target.value;
        node.isNewNode = false
        setTree(newTreeNodes);
      }
    });
  };

  const handleCreateGithubIssue = async (idx, treenode) => {
    if (treenode.name === '' || Object.entries(currRepository).length === 0) {
      return false;
    }

    const res = await createGithubIssue({
      currRepository,
      title: treenode?.name,
      body: '',
    });

    const newTreeNodes = { ...treeNodes };
    traverseTree(newTreeNodes, (node) => {
      if (node.uniqueIndex === idx) {
        node.issueDetails = {
          id: res?.data?.id,
          state: isChecked ? 'closed' : 'open',
          number: res?.data?.number,
          body: res?.data?.body,
          html_url: res?.data?.html_url,
        };
        node.isGithubIssue = true;
        setTree(newTreeNodes);
      }
    });

    if (treenode?.nonGithubIssueDetail?.markAsDone) {
      // Update the state of the last created issue using the updateGithubIssue function
      await updateGithubIssue({
        currRepository,
        issue_number: res?.data?.number,
        state: 'closed',
      });
    }

    setIsChecked(false);
    return res;
  };

  function handleCloseRightIssueTab() {
    setGithubIssue(false);
    setActiveClass(false);
  }
  let menuRef = useRef();
  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current?.contains(e.target)) {
        setGithubIssue(false);
        setActiveClass(false);
      }
    };

    document.addEventListener('mousedown', handler);

    return () => document.removeEventListener('mousedown', handler);
  });

  useEffect(() => {
    function handleEscapeKey(event) {
      if (event.code === 'Escape') {
        setGithubIssue(false);
        setActiveClass(false);
      }
    }

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, []);

  const updateGithubIssues = async (updatedBody) => {
    setGithubIssue(true);
    if (Object.entries(updatedBody).length === 0 || Object.entries(currRepository).length === 0) {
      return false;
    }
    const id = updatedBody?.id;
    delete updatedBody?.id;
    let res = await updateGithubIssue({
      currRepository,
      issue_number: createIssue?.node?.issueDetails?.number,
      ...updatedBody,
    });

    if (Object.entries(res?.data).length !== 0) {
      const newTreeNodes = { ...treeNodes };
      traverseTree(newTreeNodes, (node) => {
        if (node.uniqueIndex === id) {
          node.issueDetails = {
            id: res?.data?.id,
            state: isChecked ? 'closed' : 'open',
            number: res?.data?.number,
            body: res?.data?.body,
            html_url: res?.data?.html_url,
          };
          return true;
        }
        setTree(newTreeNodes);
        return false;
      });
      return;
    }
  };

  const containerRef = useRef(null);
  const [isInitialRatioSetted, setIsInitialRatioSetted] = useState(false);
  useEffect(() => {
    const handleClickOutside = (event) => {
      const whiteListedElements = ["text-area-input"]
      if (document.activeElement
        && whiteListedElements.includes(document.activeElement.id)
        && !document.activeElement.contains(event.target)) {
        document.activeElement.blur()
      }
    };

    document.addEventListener('click', handleClickOutside);

    const resizeDivToFitScreen = () => {
      const divElement = containerRef.current;
      if (!divElement) return;

      const divRect = divElement.getBoundingClientRect();
      const divWidth = divRect.width;
      const divHeight = divRect.height;

      const screenWidth = window.innerWidth || document.documentElement.clientWidth;
      const screenHeight = window.innerHeight || document.documentElement.clientHeight;
      const isBiggerThanScreen = divWidth > screenWidth ;
      if (!isBiggerThanScreen) {
        return;
      }
      const newScale = Math.min(screenWidth / divWidth);
      divElement.style.transform = `scale(${newScale})`;
    };
    if (!isInitialRatioSetted && containerRef.current) {
      setIsInitialRatioSetted(true);
      resizeDivToFitScreen();
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [containerRef.current]);

  const renderTree = (treeNode, level, isRoot) => {
    const content = (
      <>
        {!level ? (
          <TreeComponent
            treeNode={treeNode}
            isDragging={isDragging}
            setActiveClass={setActiveClass}
            setGithubIssue={setGithubIssue}
            onAddNode={onAddNode}
            isChanged={isChanged}
            renderTree={renderTree}
            touchEvents={touchEvents}
          />
        ) : (
          <TreeNodeComponent
            renderTree={renderTree}
            treeNode={treeNode}
            level={level}
            handleTextArea={handleTextArea}
            setCurrSelectedIdx={setCurrSelectedIdx}
            isChanged={isChanged}
            preventOnBlur={preventOnBlur}
            handleSaveTreeContent={handleSaveTreeContent}
            isChecked={isChecked}
            handleCheckboxChange={handleCheckboxChange}
            handleCreateGithubIssue={handleCreateGithubIssue}
            setIssue={setIssue}
            setDeleteClick={setDeleteClick}
            deleteNodeShow={deleteNodeShow}
            getGithubIssue={getGithubIssue}
            currRepository={currRepository}
            onAddNode={onAddNode}
            touchEvents={touchEvents}
            setGithubIssue={setGithubIssue}
            setSelectedIssue={setSelectedIssue}
            openCloseIssue={openCloseIssue}
          />
        )}
      </>
    );
    return isRoot ? <div ref={containerRef}>{content}</div> : content;
  };

  const DeleteModal = ({ show, onHide, onDelete }) => {
    const deletedNodeName = deleteClick?.name;
    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>
            Delete node: <i>{deletedNodeName}</i>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this node and all its children?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };
  return (
    <>
      <div className="panzoom_action">
        <div className={isActive ? 'filter_panel active' : 'filter_panel'}>
          <FilterButtons handleButtonClick={handleButtonClick} activeButton={activeButton} />
        </div>
        <FilterOverlay handelFilter={handelFilter} />
      </div>
      <ToastContainer />
      <div className="zoom_view_outer full_height  o-auto middleNode">
        {treeNodes && treeIsLoading ? (
          <>
            <div className="panzoom-loader">
              <LoadingSpinner height="80" width="80" color="#6610F2" ariaLabel="tail-spin-loading" radius="1" />
            </div>
          </>
        ) : (
          <>
            <TransformWrapper
              limitToBounds= {false}
              //  centerZoomedOut={true}
              // centerOnInit={true}
              minScale={0.5}
              initialPositionX={0}
              transformEnabled={true}
              panning={{
                excluded: ['textarea', 'tree_levels'],
              }}
              options={{
                maxScale: 6,
              }}
              doubleClick={{
                disabled: 'true',
              }}
              zoomAnimation={{
                animationTime: 'easeInQuint',
              }}
            >
              {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                <React.Fragment>
                  <div className="tools">
                    <ZoomButton tooltip="Zoom In" onClick={() => zoomIn()} imgSrc={zoomin} />
                    <ZoomButton tooltip="Zoom Out" onClick={() => zoomOut()} imgSrc={zoomout} />
                    <ZoomButton tooltip="Reset" onClick={() => resetTransform()} imgSrc={reset} />
                  </div>

                  <TransformComponent contentStyle={{ pointerEvents: 'auto' }} wrapperStyle={{ pointerEvents: 'auto' }}>
                    {renderTree(treeNodes, 0, true)}
                  </TransformComponent>
                  {delShow && ( //deleteNodeShow
                    <DeleteModal show={delShow} onHide={deleteNodeHide} onDelete={handleDeleteNode} />
                  )}
                </React.Fragment>
              )}
            </TransformWrapper>
          </>
        )}
      </div>
      {
        // githubIssue &&
        <SpnRightDrawer
          isActive={githubIssue}
          updateGithubIssues={updateGithubIssues}
          handleCloseRightIssueTab={handleCloseRightIssueTab}
          createIssue={createIssue}
          setIssue={setIssue}
          currRepository={currRepository}
          activeClass={activeClass}
          handleSaveTreeContent={handleSaveTreeContent}
          menuRef={menuRef}
          selectedIssue={selectedIssue}
          setSelectedIssue={setSelectedIssue}
          setOpenCloseIssue={setOpenCloseIssue}
        />
      }
      <div className="msg">
        <span> Spander is still unavailable on mobiles.</span>
      </div>
    </>
  );
};
export default SpnTreeView;
