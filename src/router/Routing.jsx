/* eslint-disable no-unused-vars */
import React from "react";
import { Routes, Route, BrowserRouter, Navigate, Link } from "react-router-dom";
import { PublicLayout } from "../component/layout/public/PublicLayout";
import { Login } from "../component/users/Login";
import { Registro } from "../component/users/Registro";
import { PrivateLayout } from "../component/layout/general/PrivateLayout";
import { Feed } from "../component/publication/Feed";
import { AuthProvider } from "../context/AuthProvider";
import { Logout } from "../component/users/Logout";
import { People } from "../component/users/People";
import { Config } from "../component/users/Config";
import { Fallowing } from "../component/fallows/Fallowing";
import { Fallowers } from "../component/fallows/Fallowers";
import { Profile } from "../component/users/profile";

export const Routing = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Login />} />
            <Route path="login" element={<Login />} />
            <Route path="registro" element={<Registro />} />
          </Route>

          <Route path="/social" element={<PrivateLayout />}>
            <Route index element={<Feed />} />
            <Route path="feed" element={<Feed />} />
            <Route path="logout" element={<Logout/>} />
            <Route path="gente" element={<People/>} />
            <Route path="ajustes" element={<Config/>} />
            <Route path="siguiendo/:userId" element={<Fallowing/>} />
            <Route path="seguidores/:userId" element={<Fallowers/>} />
            <Route path="perfil/:userId" element={<Profile/>} />
          </Route>

          <Route
            path="*"
            element={
              <>
                <p>
                  {" "}
                  <h1>Error 404</h1>
                  <Link to="/">Volver al inicio</Link>
                </p>
              </>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};
