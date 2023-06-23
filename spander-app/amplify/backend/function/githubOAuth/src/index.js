// const fetch = require("node-fetch");
const request = require("request");

/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	PROD_CLIENTSECRET
	DEV_CLIENTSECRET
	TEST_CLIENTSECRET
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  const body = JSON.parse(event.body);
  return getGitHubToken({
    code: body.code,
    appMode: body.appMode,
    client_id: body.client_id,
  })
    .then((result) => {
      return {
        statusCode: 200,
        //  Uncomment below to enable CORS requests
         headers: {
             "Access-Control-Allow-Origin": "*",
             "Access-Control-Allow-Headers": "*"
         },
        body: result.toString(), //event
      };
    })
    .catch((error) => {
      return {
        statusCode: 400,
        //  Uncomment below to enable CORS requests
        //  headers: {
        //      "Access-Control-Allow-Origin": "*",
        //      "Access-Control-Allow-Headers": "*"
        //  },
        body: JSON.stringify({ error }), //event
      };
    });
};

function getGitHubToken({ code, appMode, client_id }) {
  return new Promise((resolve, reject) => {
    const body = {
      client_id,
      client_secret: process.env[`${appMode}_CLIENTSECRET`],
      code: code,
    };
    console.log(body);

    try {
      // appMode have to be PROD || DEV || TEST
      request({
        url: `https://github.com/login/oauth/access_token`, //?client_id=${process.env.REACT_APP_GITHUB_DEV_CLIENTID}&client_secret=${process.env.REACT_APP_GITHUB_DEV_CLIENTSECRET}&code=${githubCode}`
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          // "Access-Control-Allow-Origin":"*"
        },
        body: JSON.stringify(body),
      })
        .on("data", (data) => {
          console.log("on data: ", data);
          resolve(data);
        })
        .on("error", (error) => {
          console.error("error:", error);
          reject(error);
        });
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}

// Next steps:
// "amplify push" builds all of your local backend resources and provisions them in the cloud


// Check out sample function code generated in <project-dir>/amplify/backend/function/githubOAuth/src
// "amplify function build" builds all of your functions currently in the project
// "amplify mock function <functionName>" runs your function locally
// To access AWS resources outside of this Amplify app, edit the C:\Users\OrChu\Desktop\repos\Spander\spander-app\amplify\backend\function\githubOAuth\custom-policies.json
// "amplify publish" builds all of your local backend and front-end resources (if you added hosting category) and provisions them in the cloud
