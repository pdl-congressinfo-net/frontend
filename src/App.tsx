import { CanAccess, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { dataProvider } from "./providers/rest-data-provider";

import routerProvider, {
  DocumentTitleHandler,
  NavigateToResource,
} from "@refinedev/react-router";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import "./App.css";
import { accessControlProvider } from "./providers/access-control-provider";
import { authProvider } from "./providers/auth-provider";
import { i18nProvider } from "./providers/i18n-provider";
import { notificationProvider } from "./providers/notification-provider";
import { Layout } from "./components/Common/Layout";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { Toaster } from "./components/ui/toaster";
import { ToasterMobile } from "./components/ui/toasterMobile";
import "./i18n";

import { AdminTemp } from "./components/Admin/AdminTemp";
import { httpClient } from "./utils/httpClient";
import EventsPage from "./pages/events/events";
import CreateEventPage from "./pages/events/create";
import {
  eventCategoryResource,
  eventTypeResource,
  eventResource,
} from "./features/events/event.resource";

function App() {
  return (
    <BrowserRouter>
      <ChakraProvider value={defaultSystem}>
        <RefineKbarProvider>
          <DevtoolsProvider>
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
                {
                  name: "events",
                  list: "/events",
                  create: "/events/create",
                  edit: "/events/edit/:id",
                  show: "/events/show/:id",
                  meta: {
                    canDelete: true,
                  },
                },
                eventCategoryResource,
                eventTypeResource,
                eventResource,
              ]}
            >
              <Routes>
                <Route
                  path="/"
                  element={
                    <Layout>
                      <Outlet />
                    </Layout>
                  }
                >
                  <Route path="events">
                    <Route
                      index
                      element={
                        <CanAccess>
                          <EventsPage />
                        </CanAccess>
                      }
                    />
                    <Route
                      path="create"
                      element={
                        <CanAccess>
                          <CreateEventPage />
                        </CanAccess>
                      }
                    />
                    <Route path="edit/:id" element={<div>Edit Event</div>} />
                    <Route path="show/:id" element={<div>Show Event</div>} />
                  </Route>
                  <Route
                    index
                    element={<NavigateToResource resource="events" />}
                  />
                  <Route path="/admin" element={<AdminTemp />} />
                  <Route path="*" element={<div>404 Not Found</div>} />
                </Route>
              </Routes>
              <RefineKbar />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </RefineKbarProvider>
        <Toaster />
        <ToasterMobile />
      </ChakraProvider>
    </BrowserRouter>
  );
}

export default App;
