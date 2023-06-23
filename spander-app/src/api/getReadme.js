import { Octokit } from "@octokit/core";
import { getToken } from "../utils/accessToken";

export const getReadmeDetails = ({ currRepository }) => {
  return new Promise(async (resolve, reject) => {
    const octokit = new Octokit({
      auth: getToken(),
    });

    let response = await octokit.request("GET /repos/{owner}/{repo}/readme", {
      owner: currRepository?.owner?.login,
      repo: currRepository?.name,
      headers: {
        accept: 'application/vnd.github.html+json'
      }
    });
    if (!response) {
      reject(new Error("Error in Repository content fetching!"));
    }

    resolve(response);
  });
};
