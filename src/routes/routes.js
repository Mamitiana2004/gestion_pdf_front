import { Navigate } from "react-router-dom"
import Login from "../pages/login/Login"
import Manifest from "../pages/Manifest"
import Recherche from "../pages/Recherche"
import Utilisateur from "../pages/Utilisateur"
import Vessel from "../pages/Vessel"


const routes = [
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/",
        element: <Navigate to="/login" relative />
    }
]

const protected_routes = [
    {
        path: "/admin/stat",
        element: <Manifest />
    },
    {
        path: "/admin/utilisateur",
        element: <Utilisateur />
    },
    {
        path: "/admin/resume",
        element: <Vessel />
    },
    {
        path: "/admin/pdf",
        element: <Recherche />
    }
]


export { protected_routes, routes }
