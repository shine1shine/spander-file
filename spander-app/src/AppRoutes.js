import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Design from "./Design/Design";
import SpnLoginScreen from "./pages/SpnLoginScreen";
import SpnRepositoriesScreen from "./pages/SpnRepositoriesScreen";
import SpnAddRepositoryScreen from "./pages/SpnAddRepositoryScreen";
import SpnRepositoryScreen from "./pages/SpnRepositoryScreen";
import SpnSupportScreen from "./pages/SpnSupportScreen";
import OAuth from "./pages/OAuth";
import Welcome from "./pages/welcome";
import { useSelector } from "react-redux";
import FourNotFound from "./pages/404";

const AppRoutes = () => {
  const { loginUserDetails } = useSelector(state => state.loginUserDetailsSlice)

  useEffect(() => {
    // check if user did authentication with Github;
  }, []);

  return (
    <Routes>
      {/* Home page redirects to Design page, should be changed later */}
      <Route
        path="/"
        element={
          <Navigate
            replace
            to={
              process.env.NODE_ENV === "development"
                ? "/design"
                : loginUserDetails?.isLoggedIn
                  ? "/repositories"
                  : "/login"
            }
          />
        }
      />
      {/* #93 */}
      <Route path="/design" element={<Design />} />
      <Route path="/login" element={<SpnLoginScreen />} />
      <Route path="/repositories" element={<SpnRepositoriesScreen />} />
      <Route path="/addrepository" element={<SpnAddRepositoryScreen />} />
      <Route path="/repository/:id" element={<SpnRepositoryScreen />} />
      <Route path="/support/contactus" element={<SpnSupportScreen />} />
      <Route path="/support/qa" element={<SpnSupportScreen />} />
      <Route path="/OAuth" element={<OAuth />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/404" element={<FourNotFound />} />
      <Route path="*" element={<Navigate to="/404" replace={true} />} />
    </Routes>
  );
};

export default AppRoutes;
