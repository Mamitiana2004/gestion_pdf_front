import { BrowserRouter, Route, Routes } from "react-router-dom";
import { protected_routes, routes } from "./routes";
import ProtectedRoute from "./ProtectedRoute";

const AppRouter = () => {

    return (
        <BrowserRouter>
            <Routes>
                {routes.map((route, key) => {
                    return <Route path={route.path} element={route.element} key={key} />
                })}
                
                {protected_routes.map((protected_route, key) => {
                    return <Route key={key} path={protected_route.path} element={
                        <ProtectedRoute>
                            {protected_route.element}
                        </ProtectedRoute>
                    } />
                })}
            </Routes>



        </BrowserRouter>
    )

}

export default AppRouter;