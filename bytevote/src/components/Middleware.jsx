import { Navigate } from "react-router-dom";

const ProtectedPage = ({ children, requiredRole }) => {
    const userRole = localStorage.getItem("role");

    if (!userRole || userRole !== requiredRole) {
        return <Navigate to="/unauthorized" />; // Redirect to an error page
    }

    return children;
};

export default ProtectedPage;