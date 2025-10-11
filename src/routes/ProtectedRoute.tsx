// src/routes/ProtectedRoute.tsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const ProtectedRoute: React.FC = () => {
    const location = useLocation();

    const isLoggedIn = true;
    const loading = false;

    if (loading) {
        return (
            <div className="grid min-h-screen place-items-center">
                <div className="animate-pulse text-sm text-muted-foreground">Checking session…</div>
            </div>
        );
    }

    if (!isLoggedIn) {
        return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
