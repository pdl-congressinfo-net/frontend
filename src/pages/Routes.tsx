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

// Location Type pages
import LocationTypesListPage from "./locations/location-types/list";
import LocationTypeCreatePage from "./locations/location-types/create";
import LocationTypeEditPage from "./locations/location-types/edit";
import LocationTypeShowPage from "./locations/location-types/show";

// Country pages
import CountriesListPage from "./locations/countries/list";
import CountryCreatePage from "./locations/countries/create";
import CountryEditPage from "./locations/countries/edit";
import CountryShowPage from "./locations/countries/show";

// Location pages
import LocationsListPage from "./locations/list";
import LocationCreatePage from "./locations/create";
import LocationEditPage from "./locations/edit";
import LocationShowPage from "./locations/show";

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

          <Route path="locations">
            <Route
              index
              element={
                <CanAccess>
                  <LocationsListPage />
                </CanAccess>
              }
            />
            <Route path="create" element={<LocationCreatePage />} />
            <Route path="edit/:id" element={<LocationEditPage />} />
            <Route path="show/:id" element={<LocationShowPage />} />

            <Route path="types">
              <Route
                index
                element={
                  <CanAccess>
                    <LocationTypesListPage />
                  </CanAccess>
                }
              />
              <Route path="create" element={<LocationTypeCreatePage />} />
              <Route path="edit/:id" element={<LocationTypeEditPage />} />
              <Route path="show/:id" element={<LocationTypeShowPage />} />
            </Route>

            <Route path="countries">
              <Route
                index
                element={
                  <CanAccess>
                    <CountriesListPage />
                  </CanAccess>
                }
              />
              <Route path="create" element={<CountryCreatePage />} />
              <Route path="edit/:id" element={<CountryEditPage />} />
              <Route path="show/:id" element={<CountryShowPage />} />
            </Route>
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
