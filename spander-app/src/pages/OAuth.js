import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import Auth from "@aws-amplify/auth";
// import Lambda from "aws-sdk/clients/lambda"; // npm install aws-sdk
// import { API } from 'aws-amplify'
import { getAppMode, getGithubClientID } from "../hooks/getGithubLoginURL";
import { setLoginUserDetails } from "../slices/loginUserDetailsSlice";

// # Menage OAuth GithubApps on :https://github.com/organizations/uidb-dev/settings/applications/
// ## test (localhost) on: https://github.com/organizations/uidb-dev/settings/applications/2060487
// ## dev on: https://github.com/organizations/uidb-dev/settings/applications/2060491
// ## production on: https://github.com/organizations/uidb-dev/settings/applications/2060487

// # How to do it:
// https://docs.github.com/en/developers/apps/building-github-apps/identifying-and-authorizing-users-for-github-apps
// https://www.back4app.com/docs/platform/sign-in-with-github

function OAuth() {
  const state = useSelector(
    (state) => state.loginUserDetailsSlice.loginUserDetails
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // After requesting Github access, Github redirects back to your app with a code parameter
    const urlParams = new URLSearchParams(window.location.search);
    const githubCode = urlParams.get("code");

    // If Github API returns the code parameter
    if (githubCode) {
      // call Amplify Function Lambada with: githubCode + getGithubClientID()
      // Auth.currentCredentials().then((credentials) => {
      //   const lambda = new Lambda({
      //     credentials: Auth.essentialCredentials(credentials),
      //   });
      // return API
      //   .post({
      //     // FunctionName: "githubOAuthApi",
      //     Payload: JSON.stringify({
      //       code: githubCode,
      //       appMode: getAppMode(),
      //       client_id: getGithubClientID(),
      //     }),
      //   })
      // .on("data", (data) => {
      //   alert("data: ", data);
      // })
      // .on("error", (error) => {
      //   alert("error: ", error);
      // });
      fetch("https://sulx5nkv9d.execute-api.eu-west-3.amazonaws.com/staging", {
        method: "POST",
        body: JSON.stringify({
          code: githubCode,
          appMode: getAppMode(),
          client_id: getGithubClientID(),
        }),
      })
        .then((re) => re.json())
        .then((data) => dispatch(setLoginUserDetails({ isLoggedIn: true, accesToken : data.access_token })))
        .then(()=>navigate(`/repositories`, { state : { skipAuth : true}, replace : true}))
        .catch((error) => {
          console.error(error);
        });
      // });
    } else {
      dispatch(setLoginUserDetails({ isLoggedIn : false, loginError : "Access Denied" }))
    }

    
  }, []);

  return <div>Loading authorizing</div>;
}

export default OAuth;
