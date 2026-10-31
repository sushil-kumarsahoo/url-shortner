import { Outlet } from "@tanstack/react-router";
import "./App.css";
import Navbar from "./components/NavBar";

function RootLayout() {
  return (
    <>
    <Navbar />
      <Outlet />
      
    </>
  );
}

export default RootLayout;
