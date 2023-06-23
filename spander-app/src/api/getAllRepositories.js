import { Octokit } from "@octokit/core";
import { getToken } from "../utils/accessToken";
import logoutHandler from "../utils/logoutHandler";

export const getAllRepositories = (count = 1) => {
  return new Promise(async (resolve, reject) => {
    const octokit = new Octokit({
      auth: getToken(),
    });
    try {
      const allRepos = await octokit.request("GET /user/repos", {
        sort: 'created',
        direction: 'desc',
        per_page: 100,
        page: count
      });
      if (!allRepos) {
        reject(new Error("Error!"));
      }
      if (allRepos?.data?.length < 100) {
        resolve(allRepos.data)
        return
      } else {
        const nextPageData = await getAllRepositories(count + 1)
        const data = (allRepos.data || []).concat(nextPageData || [])
        resolve(data)
      }
    } catch (err) {
      if (err.status == 401) {
        logoutHandler()
      }
    }
  });
};
export const getAllRepositoriesByPage = (page = 1, perPage = 9) => {
  return new Promise(async (resolve, reject) => {
    const octokit = new Octokit({
      auth: getToken(),
    });
    try {
      const allRepos = await octokit.request("GET /user/repos", {
        sort: 'created',
        direction: 'desc',
        per_page: perPage,
        page: page
      });
      if (!allRepos) {
        reject(new Error("Error!"));
      }
      resolve({ data: allRepos.data, page, perPage, isLastPage: allRepos.data?.length < perPage })
    } catch (err) {
      if (err.status == 401) {
        logoutHandler()
      }
    }
  });
};
