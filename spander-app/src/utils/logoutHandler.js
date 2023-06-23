export default function logoutHandler() {
  localStorage.removeItem("user");
  window.location.href = "/login";
}
