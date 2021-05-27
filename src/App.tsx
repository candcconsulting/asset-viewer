import "./App.scss";

import { FitViewTool, IModelApp, IModelConnection, ScreenViewport, StandardViewId, ViewCreator3d } from "@bentley/imodeljs-frontend"
import { DisplayStyleSettingsProps } from "@bentley/imodeljs-common"
import { Viewer } from "@bentley/itwin-viewer-react";
import React, { useEffect, useState } from "react";

import AuthorizationClient from "./AuthorizationClient";
import { Header } from "./Header";
import { HS2Decorator } from "./components/decorators/HS2Decorator";
import { HS2UiItemsProvider } from "./providers/HS2UiItemsProvider";


const App: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(
    AuthorizationClient.oidcClient
      ? AuthorizationClient.oidcClient.isAuthorized
      : false
  );
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const initOidc = async () => {
      if (!AuthorizationClient.oidcClient) {
        await AuthorizationClient.initializeOidc();
      }

      try {
        // attempt silent signin
        await AuthorizationClient.signInSilent();
        setIsAuthorized(AuthorizationClient.oidcClient.isAuthorized);
      } catch (error) {
        // swallow the error. User can click the button to sign in
      }
    };
    initOidc().catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (!process.env.IMJS_CONTEXT_ID) {
      throw new Error(
        "Please add a valid context ID in the .env file and restart the application"
      );
    }
    if (!process.env.IMJS_IMODEL_ID) {
      throw new Error(
        "Please add a valid iModel ID in the .env file and restart the application"
      );
    }
  }, []);

  useEffect(() => {
    if (isLoggingIn && isAuthorized) {
      setIsLoggingIn(false);
    }
  }, [isAuthorized, isLoggingIn]);

  const onLoginClick = async () => {
    setIsLoggingIn(true);
    await AuthorizationClient.signIn();
  };

  const onLogoutClick = async () => {
    setIsLoggingIn(false);
    await AuthorizationClient.signOut();
    setIsAuthorized(false);
  };
  const onIModelConnected = async (_imodel: IModelConnection) => {
    const viewCreator = new ViewCreator3d(_imodel);
    const viewState = await viewCreator.createDefaultView();

    // Example of custom logic... set to a top view.
    viewState.setStandardRotation (StandardViewId.Top);
    IModelApp.viewManager.onViewOpen.addOnce(async (vp: ScreenViewport) => {  
      IModelApp.tools.run(FitViewTool.toolId, vp);
      const viewStyle: DisplayStyleSettingsProps = {
        viewflags: {
          visEdges: false,
          shadows: true,
          ambientOcclusion: true          
        }
      }
      vp.overrideDisplayStyle(viewStyle);
      IModelApp.viewManager.addDecorator(new HS2Decorator(vp));
    
    });
  }

  return (
    <div className="viewer-container">
      <Header
        handleLogin={onLoginClick}
        loggedIn={isAuthorized}
        handleLogout={onLogoutClick}
      />
      {isLoggingIn ? (
        <span>"Logging in...."</span>
      ) : (
        isAuthorized && (
          <Viewer
            contextId={process.env.IMJS_CONTEXT_ID ?? ""}
            iModelId={"7ec5373d-7659-4fea-b2fb-e3cf144f7963"}
            authConfig={{ oidcClient: AuthorizationClient.oidcClient }}
            onIModelConnected = {onIModelConnected}
            uiProviders = {[new HS2UiItemsProvider()]}
          />
        )
      )}
    </div>
  );
};

export default App;
