import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import NotesPage from "./pages/NotesPage";
import PlayerPage from "./pages/PlayerPage";


export const router = createBrowserRouter([
    { path: "/", element: <App /> },
    { path: "/signin", element: <Signin /> },
    { path: "/signup", element: <Signup /> },
    {   
        path: "/dashboard", 
        element: 
            <PrivateRoute>
                <Dashboard />
            </PrivateRoute> },
    { 
        path: "/notes",
        element: 
            <PrivateRoute>
                <NotesPage />
            </PrivateRoute> },
    {
        path: "/player",
        element:
            <PrivateRoute>
                <PlayerPage />
            </PrivateRoute> },

])