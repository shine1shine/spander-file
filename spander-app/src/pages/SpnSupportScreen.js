
import { useLocation } from 'react-router-dom';
import SpnTopBar from "../components/SpnTopBar";

const SpnSupportScreen = (props) => {

const location = useLocation();

 return (
    <>
     <b>SpnSupportScreen</b>
     <SpnTopBar />
     <h1>
     {
        location.pathname.includes("contactus") ? "Contact Us" : "Questions & Answers"
     }
     </h1>
    </>
  );
}

export default SpnSupportScreen;