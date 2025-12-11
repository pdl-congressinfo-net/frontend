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
import "./providers/rest-data-provider/mapping/feature.loader";

import { httpClient } from "./utils/httpClient";
import {
  eventCategoryResource,
  eventTypeResource,
  eventResource,
} from "./features/events/events.resource";
import {
  locationResource,
  locationTypeResource,
  countryResource,
} from "./features/locations/locations.resource";
import {
  companyResource,
  companyEmployeeResource,
} from "./features/companies/companies.resource";
import AppRoutes from "./pages/Routes";
import { LayoutProvider } from "./providers/layout-provider";
import {
  rolePermissionResource,
  roleResource,
} from "./features/roles/roles.resource";
import { permissionResource } from "./features/permissions/permissions.resource";

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
                  locationResource,
                  locationTypeResource,
                  countryResource,
                  companyResource,
                  companyEmployeeResource,
                  roleResource,
                  rolePermissionResource,
                  permissionResource,
                ]}
              >
                <AppRoutes />
                <RefineKbar />
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
