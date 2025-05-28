import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App.tsx";
import "./index.css";
import Toaster from "./components/portal/toaster.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./shared/layout.tsx";
import WatchList from "./pages/watch-list.tsx";
import Details from "./pages/details.tsx";
import Login from "./pages/login.tsx";
import AppProvider from "./context/app-context.tsx";
import ProtectedRoute from "./shared/protected-route.tsx";
import User from "./pages/admin/user.tsx";
import { UserRole } from "./common/enums.ts";
import Register from "./pages/register.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.Fragment>
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route
              path="/"
              element={<ProtectedRoute children={<App />} allowedRoles={[UserRole.Client, UserRole.Admin]} />}
            />
            <Route
              path="/watch-list"
              element={<ProtectedRoute children={<WatchList />} allowedRoles={[UserRole.Client, UserRole.Admin]} />}
            />
            <Route
              path="/details/:id"
              element={<ProtectedRoute children={<Details />} allowedRoles={[UserRole.Client, UserRole.Admin]} />}
            />
            <Route path="/users" element={<ProtectedRoute children={<User />} allowedRoles={[UserRole.Admin]} />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<h1>404 Not found</h1>} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
    <Toaster />
  </React.Fragment>
);
