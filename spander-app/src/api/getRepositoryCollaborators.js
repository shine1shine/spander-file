import { Octokit } from "@octokit/core";
import { getToken } from "../utils/accessToken";

export const getRepositoryCollaborators = ({ owner, repo }) => {

  return new Promise((resolve, reject) => {
    const octokit = new Octokit({
      auth: getToken(),
    });

    if (owner && repo) {
      const response = octokit.request(
        "GET /repos/{owner}/{repo}/collaborators",
        {
          owner: owner,
          repo: repo,
        }
      );

      if (!response) {
        reject(new Error("Error has occured while fetching"));
      }

      resolve(response);
    }
  });
};
