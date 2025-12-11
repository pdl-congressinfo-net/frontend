import { NavigateToResource } from "@refinedev/react-router";
import { useLocation, Routes, Route, Outlet } from "react-router";
import type { Location } from "react-router";
import { Layout } from "../components/Common/Layout";
import { UserLayout } from "../components/Common/UserLayout";
import { AdminLayout } from "../components/Admin/AdminLayout";
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
import CompaniesListPage from "./companies/list";
import CompanyCreatePage from "./companies/create";
import CompanyEditPage from "./companies/edit";
import CompanyShowPage from "./companies/show";
import AdminDashboard from "./admin/dashboard";
import NotFound from "../components/Common/NotFound";

function AppRoutes() {
  const location = useLocation();
  const state = location.state as { background?: Location };
  return (
    <>
      {/* Background routing */}
      <Routes location={state?.background || location}>
        {/* Root layout wraps everything */}
        <Route
          element={
            <Layout>
              <Outlet />
            </Layout>
          }
        >
          {/* User routes with UserLayout */}
          <Route
            path="/"
            element={
              <UserLayout>
                <Outlet />
              </UserLayout>
            }
          >
            <Route index element={<NavigateToResource resource="events" />} />

            {/* Events routes */}
            <Route path="/events" element={<EventsListPage />} />
            <Route path="/events/create" element={<EventCreatePage />} />
            <Route path="/events/edit/:id" element={<EventEditPage />} />

            {/* Event Types routes */}
            <Route path="/events/types" element={<EventTypesListPage />} />
            <Route
              path="/events/types/create"
              element={<EventTypeCreatePage />}
            />
            <Route
              path="/events/types/edit/:id"
              element={<EventTypeEditPage />}
            />

            {/* Locations routes */}
            <Route path="/locations" element={<LocationsListPage />} />
            <Route path="/locations/create" element={<LocationCreatePage />} />
            <Route path="/locations/edit/:id" element={<LocationEditPage />} />
            <Route path="/locations/show/:id" element={<LocationShowPage />} />

            {/* Locaton Types routes */}
            <Route
              path="/locations/types"
              element={<LocationTypesListPage />}
            />

            {/* Countries routes */}
            <Route
              path="/locations/countries"
              element={<CountriesListPage />}
            />

            {/* Permissions routes */}
            <Route path="/permissions" element={<PermissionsListPage />} />
            <Route
              path="/permissions/create"
              element={<PermissionCreatePage />}
            />
            <Route
              path="/permissions/edit/:id"
              element={<PermissionEditPage />}
            />
            <Route
              path="/permissions/show/:id"
              element={<PermissionShowPage />}
            />

            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin routes with AdminLayout */}
          <Route
            path="/admin/*"
            element={
              <AdminLayout>
                <Outlet />
              </AdminLayout>
            }
          >
            <Route index element={<AdminDashboard />} />

            <Route path="permissions" element={<PermissionsListPage />} />
            {/* Access Control */}
            <Route path="roles" element={<RolesListPage />} />
            <Route path="roles/create" element={<RoleCreatePage />} />
            <Route path="roles/edit/:id" element={<RoleEditPage />} />
            <Route path="roles/show/:id" element={<RoleShowPage />} />
            {/* Companies */}
            <Route path="companies" element={<CompaniesListPage />} />
            <Route path="companies/create" element={<CompanyCreatePage />} />
            <Route path="companies/edit/:id" element={<CompanyEditPage />} />
            <Route path="companies/show/:id" element={<CompanyShowPage />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>

      {/* Modal/Overlay routes that render on top of background */}
      {state?.background && (
        <Routes>
          <Route path="/events/show/:id" element={<EventShowPage />} />
        </Routes>
      )}
    </>
  );
}

export default AppRoutes;
