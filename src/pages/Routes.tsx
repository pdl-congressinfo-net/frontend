import { CanAccess } from "@refinedev/core";
import { NavigateToResource } from "@refinedev/react-router";
import type { Location } from "react-router";
import { Outlet, Route, Routes, useLocation } from "react-router";
import { AdminLayout } from "../components/Admin/AdminLayout";
import { Layout } from "../components/Common/Layout";
import NotFound from "../components/Common/NotFound";
import { UserLayout } from "../components/Common/UserLayout";
import { AdminDashboard } from "./admin";
import {
  CompaniesListPage,
  CompanyCreatePage,
  CompanyEditPage,
  CompanyEmployeesListPage,
  CompanyShowPage,
} from "./companies";
import {
  EventCreatePage,
  EventEditPage,
  EventShowPage,
  EventsListPage,
  EventTypeCreatePage,
  EventTypeEditPage,
  EventTypeShowPage,
  EventTypesListPage,
} from "./events";
import {
  CountriesListPage,
  LocationCreatePage,
  LocationEditPage,
  LocationShowPage,
  LocationsListPage,
  LocationTypesListPage,
} from "./locations";
import {
  PermissionCreatePage,
  PermissionEditPage,
  PermissionShowPage,
  PermissionsListPage,
} from "./permissions";
import {
  RoleCreatePage,
  RoleEditPage,
  RoleShowPage,
  RolesListPage,
} from "./roles";
import {
  SponsoringCreatePage,
  SponsoringEditPage,
  SponsoringShowPage,
  SponsoringsListPage,
} from "./sponsorings";
import {
  ContactCreatePage,
  ContactEditPage,
  ContactShowPage,
  ContactsListPage,
  UserCreatePage,
  UserEditPage,
  UserShowPage,
  UsersListPage,
} from "./users";

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
            <Route path="events">
              <Route index element={<EventsListPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin routes with AdminLayout - Protected at layout level */}
          <Route
            path="admin"
            element={
              <CanAccess resource="admin" action="view" fallback={<NotFound />}>
                <AdminLayout>
                  <Outlet />
                </AdminLayout>
              </CanAccess>
            }
          >
            <Route index element={<AdminDashboard />} />

            <Route path="permissions">
              <Route index element={<PermissionsListPage />} />
              <Route path="create" element={<PermissionCreatePage />} />
              <Route path="edit/:id" element={<PermissionEditPage />} />
              <Route path="show/:id" element={<PermissionShowPage />} />
            </Route>

            <Route path="users">
              <Route index element={<UsersListPage />} />
              <Route path="create" element={<UserCreatePage />} />
              <Route path="edit/:id" element={<UserEditPage />} />
              <Route path="show/:id" element={<UserShowPage />} />
            </Route>

            <Route path="contacts">
              <Route index element={<ContactsListPage />} />
              <Route path="create" element={<ContactCreatePage />} />
              <Route path="edit/:id" element={<ContactEditPage />} />
              <Route path="show/:id" element={<ContactShowPage />} />
            </Route>

            <Route path="sponsorings">
              <Route index element={<SponsoringsListPage />} />
              <Route path="create" element={<SponsoringCreatePage />} />
              <Route path="edit/:id" element={<SponsoringEditPage />} />
              <Route path="show/:id" element={<SponsoringShowPage />} />
            </Route>

            <Route path="roles">
              <Route index element={<RolesListPage />} />
              <Route path="create" element={<RoleCreatePage />} />
              <Route path="edit/:id" element={<RoleEditPage />} />
              <Route path="show/:id" element={<RoleShowPage />} />
            </Route>

            <Route path="companies">
              <Route index element={<CompaniesListPage />} />
              <Route path="create" element={<CompanyCreatePage />} />
              <Route path="edit/:id" element={<CompanyEditPage />} />
              <Route path="show/:id" element={<CompanyShowPage />} />
              <Route path="employees">
                <Route
                  index
                  element={<NavigateToResource resource="companies" />}
                />
                <Route
                  path="show/:companyId"
                  element={<CompanyEmployeesListPage />}
                />
              </Route>
            </Route>

            <Route path="locations">
              <Route index element={<LocationsListPage />} />
              <Route path="create" element={<LocationCreatePage />} />
              <Route path="edit/:id" element={<LocationEditPage />} />
              <Route path="show/:id" element={<LocationShowPage />} />

              {/* Country & Location Types */}
              <Route path="countries" element={<CountriesListPage />} />
              <Route path="types" element={<LocationTypesListPage />} />
            </Route>

            <Route path="events">
              <Route path="create" element={<EventCreatePage />} />
              <Route path="edit/:id" element={<EventEditPage />} />
              <Route path="show/:id" element={<EventShowPage />} />
              <Route path="types">
                <Route index element={<EventTypesListPage />} />
                <Route path="create" element={<EventTypeCreatePage />} />
                <Route path="edit/:id" element={<EventTypeEditPage />} />
                <Route path="show/:id" element={<EventTypeShowPage />} />
              </Route>
            </Route>

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
