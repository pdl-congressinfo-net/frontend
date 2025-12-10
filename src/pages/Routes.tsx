import { NavigateToResource } from "@refinedev/react-router";
import { useLocation, Routes, Route, Outlet } from "react-router";
import type { Location } from "react-router";
import { Layout } from "../components/Common/Layout";
import AdminTempPage from "./admin/temp";
import EventsListPage from "./events/list";
import EventShowPage from "./events/show";
import EventCreatePage from "./events/create";
import EventEditPage from "./events/edit";
import EventTypesListPage from "./events/types/list";
import EventTypeShowPage from "./events/types/show";
import EventTypeCreatePage from "./events/types/create";
import EventTypeEditPage from "./events/types/edit";
import LocationsListPage from "./locations/list";
import LocationShowPage from "./locations/show";
import LocationCreatePage from "./locations/create";
import LocationEditPage from "./locations/edit";
import LocationTypesListPage from "./locations/types/list";
import CountriesListPage from "./locations/countries/list";
import PermissionsListPage from "./permissions/list";
import PermissionCreatePage from "./permissions/create";
import PermissionEditPage from "./permissions/edit";
import PermissionShowPage from "./permissions/show";
import RolesListPage from "./roles/list";
import RoleCreatePage from "./roles/create";
import RoleEditPage from "./roles/edit";
import RoleShowPage from "./roles/show";


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
          <Route index element={<NavigateToResource resource="events" />} />

          {/* Events routes */}
          <Route path="/events" element={<EventsListPage />} />
          <Route path="/events/create" element={<EventCreatePage />} />
          <Route path="/events/edit/:id" element={<EventEditPage />} />

          {/* Event Types routes */}
          <Route path="/events/types" element={<EventTypesListPage />} />
          <Route path="/events/types/create" element={<EventTypeCreatePage />} />
          <Route path="/events/types/edit/:id" element={<EventTypeEditPage />} />

          {/* Locations routes */}
          <Route path="/locations" element={<LocationsListPage />} />
          <Route path="/locations/create" element={<LocationCreatePage />} />
          <Route path="/locations/edit/:id" element={<LocationEditPage />} />
          <Route path="/locations/show/:id" element={<LocationShowPage />} />

          {/* Location Types routes */}
          <Route path="/locations/types" element={<LocationTypesListPage />} />

          {/* Countries routes */}
          <Route path="/locations/countries" element={<CountriesListPage />} />

          {/* Permissions routes */}
          <Route path="/permissions" element={<PermissionsListPage />} />
          <Route path="/permissions/create" element={<PermissionCreatePage />} />
          <Route path="/permissions/edit/:id" element={<PermissionEditPage />} />
          <Route path="/permissions/show/:id" element={<PermissionShowPage />} />

          {/* Roles routes */}
          <Route path="/roles" element={<RolesListPage />} />
          <Route path="/roles/create" element={<RoleCreatePage />} />
          <Route path="/roles/edit/:id" element={<RoleEditPage />} />
          <Route path="/roles/show/:id" element={<RoleShowPage />} />

          <Route path="/admin" element={<AdminTempPage />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Route>
      </Routes>

      {/* Modal/Overlay routes that render on top of background */}
      {state?.background && (
        <Routes>
          <Route path="/events/show/:id" element={<EventShowPage />} />
          <Route path="/events/types/show/:id" element={<EventTypeShowPage />} />
          <Route path="/permissions/show/:id" element={<PermissionShowPage />} />
          <Route path="/roles/show/:id" element={<RoleShowPage />} />
        </Routes>
      )}
    </>
  );
}

export default AppRoutes;
