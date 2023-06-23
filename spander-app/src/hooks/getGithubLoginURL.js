export function getLoginToGithubURL() {
  return `https://github.com/login/oauth/authorize?client_id=${getGithubClientID()}&scope=repo`;
}

export function getGithubClientID() {
  return process.env[`REACT_APP_GITHUB_${getAppMode()}_CLIENTID`];
}

export function getAppMode() {
  return window.location.host === "localhost:3000"
    ? "TEST"
    : window.location.host === "dev-app.spander.ui-db.com"
      ? "DEV"
      : window.location.host === "app.spander.ui-db.com" &&
      "PROD";
}