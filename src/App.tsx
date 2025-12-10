import { Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { dataProvider } from "./providers/rest-data-provider";

import routerProvider, { DocumentTitleHandler } from "@refinedev/react-router";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import "./App.css";
import { accessControlProvider } from "./providers/access-control-provider";
import { authProvider } from "./providers/auth-provider";
import { i18nProvider } from "./providers/i18n-provider";
import { notificationProvider } from "./providers/notification-provider";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { Toaster } from "./components/ui/toaster";
import { ToasterMobile } from "./components/ui/toasterMobile";
import "./i18n";

import { httpClient } from "./utils/httpClient";
import {
  eventCategoryResource,
  eventTypeResource,
  eventResource,
} from "./features/events/event.resource";
import AppRoutes from "./pages/Routes";
import { LayoutProvider } from "./providers/layout-provider";

function App() {
  return (
    <BrowserRouter>
      <ChakraProvider value={defaultSystem}>
        <RefineKbarProvider>
          <DevtoolsProvider>
            <LayoutProvider>
              <Refine
                accessControlProvider={accessControlProvider}
                authProvider={authProvider}
                dataProvider={dataProvider(
                  "https://api.dpfurner.xyz/api/v1",
                  httpClient,
                )}
                routerProvider={routerProvider}
                i18nProvider={i18nProvider}
                notificationProvider={notificationProvider}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: false,
                  projectId: "vcrr5U-GVoid5-2GKdr3",
                }}
                resources={[
                  eventCategoryResource,
                  eventTypeResource,
                  eventResource,
                ]}
              >
                <AppRoutes />
                <RefineKbar />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </LayoutProvider>
          </DevtoolsProvider>
        </RefineKbarProvider>
        <Toaster />
        <ToasterMobile />
      </ChakraProvider>
    </BrowserRouter>
  );
}

export default App;
