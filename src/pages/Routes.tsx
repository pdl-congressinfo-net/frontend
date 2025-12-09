import { CanAccess } from "@refinedev/core";
import { NavigateToResource } from "@refinedev/react-router";
import { useLocation, Routes, Route, Outlet } from "react-router";
import { AdminTemp } from "../components/Admin/AdminTemp";
import { Layout } from "../components/Common/Layout";
import CreateEventPage from "./events/create";
import EditEventPage from "./events/edit";
import EventsPage from "./events/events";
import { EventShow } from "./events/show";
import EventsArchivePage from "./events/archive";
import AdminTempPage from "./admin/temp";

function AppRoutes() {
  const location = useLocation();
  const state = location.state as { background?: Location };

  return (
    <>
      {/* Background routing */}
      <Routes location={state?.background || location}>
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
            <Route path="create" element={<CreateEventPage />} />
            <Route path="edit/:id" element={<EditEventPage />} />
            <Route path="archive" element={<EventsArchivePage />} />
          </Route>

          <Route index element={<NavigateToResource resource="events" />} />
          <Route path="/admin" element={<AdminTempPage />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Route>
      </Routes>

      {/* Modal popup overlay */}
      {state?.background && (
        <Routes>
          <Route path="/events/show/:id" element={<EventShow />} />
        </Routes>
      )}
    </>
  );
}

export default AppRoutes;
