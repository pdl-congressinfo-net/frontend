import { Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { dataProvider } from "./providers/rest-data-provider";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import routerProvider from "@refinedev/react-router";
import { BrowserRouter } from "react-router";
import "./App.css";
import { Toaster } from "./components/ui/toaster";
import { ToasterMobile } from "./components/ui/toasterMobile";
import "./i18n";
import { accessControlProvider } from "./providers/access-control-provider";
import { authProvider } from "./providers/auth-provider";
import { i18nProvider } from "./providers/i18n-provider";
import { notificationProvider } from "./providers/notification-provider";
import "./providers/rest-data-provider/mapping/feature.loader";

import {
  companyEmployeeResource,
  companyResource,
} from "./features/companies/companies.resource";
import {
  eventResource,
  eventTypeResource,
} from "./features/events/events.resource";
import {
  countryResource,
  locationResource,
  locationTypeResource,
} from "./features/locations/locations.resource";
import { permissionResource } from "./features/permissions/permissions.resource";
import {
  rolePermissionResource,
  roleResource,
} from "./features/roles/roles.resource";
import {
  userPermissionRessource,
  userRessource,
  userRoleRessource,
} from "./features/users/users.resource";
import AppRoutes from "./pages/Routes";
import { LayoutProvider } from "./providers/layout-provider";
import { httpClient } from "./utils/httpClient";

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
                  userPermissionRessource,
                  userRoleRessource,
                  userRessource,
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
