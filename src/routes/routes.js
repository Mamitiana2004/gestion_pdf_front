import Home from "../pages/Home"
import Login from "../pages/login/Login"


const routes = [
    {
        path:"/login",
        element:<Login/>
    }
]

const protected_routes = [
    {
        path:"/home",
        element:<Home/>
    }
]


export {routes,protected_routes}