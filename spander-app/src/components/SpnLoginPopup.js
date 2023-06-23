import React from "react";
import { jsonToObj } from "../utils/json-utils";

export default class SpnLoginPopup extends React.Component {
  static defaultProps = {
    onError:()=>{},
    onClose: () => {},
    width: 500,
    height: 500,
    url: "",
    title: ""
  };

  componentWillUnmount() {
    if (this.externalWindow) {
      this.externalWindow.close();
    }
  }

  createPopup = () => {
    const { url, title, width, height, onCode,onError } = this.props;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2.5;

    const windowFeatures = `toolbar=0,scrollbars=1,status=1,resizable=0,location=1,menuBar=0,width=${width},height=${height},top=${top},left=${left}`;

    this.externalWindow = window.open(url, title, windowFeatures);

    const storageListener = () => {
      try {
        const user = jsonToObj(localStorage.getItem("user"))
        if (user?.isLoggedIn && user?.accesToken) {
          onCode(user?.accesToken, this.externalWindow.location);
          // this.externalWindow.close();
          window.removeEventListener("storage", storageListener);
        }else if( !user?.isLoggedIn && user.loginError){
          onError(user.loginError)
          localStorage.setItem('user', null)
          this.externalWindow.close();
          window.removeEventListener("storage", storageListener);
        }
      } catch (e) {
        window.removeEventListener("storage", storageListener);
      }
    };

    window.addEventListener("storage", storageListener);

    this.externalWindow.addEventListener(
      "beforeunload",
      () => {
        this.props.onClose();
      },
      false
    );
  };

  render() {
    return <div onClick={this.createPopup}>{this.props.children}</div>;
  }
}
