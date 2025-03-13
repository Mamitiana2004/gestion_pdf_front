import { Navigate } from "react-router-dom"
import Consigne from "../pages/Consigne"
import Login from "../pages/login/Login"
import Manifest from "../pages/Manifest"
import Recherche from "../pages/Recherche"
import Shipper from "../pages/Shipper"
import Utilisateur from "../pages/Utilisateur"
import Vessel from "../pages/Vessel"
import Voyage from "../pages/Voyage"


const routes = [
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/",
        element:<Navigate to="/login" relative/>
    }
]

const protected_routes = [
    {
        path:"/admin/manifest",
        element:<Manifest/>
    },
    {
        path:"/admin/utilisateur",
        element:<Utilisateur/>
    },
    {
        path:"/admin/data",
        element:<Vessel/>
    },
    {
        path:"/admin/recherche",
        element:<Recherche/>
    }
]


export {routes,protected_routes}