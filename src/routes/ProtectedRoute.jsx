import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute(props) {
    const isAuthentifier = useAuth();

    if (!isAuthentifier) {
        return <Navigate to={"/login"}/>
    }

    return props.children;
}