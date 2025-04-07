import React, { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const { session, loading } = UserAuth();

    if (loading) {
        return <div> Loading, please stand by </div>
    }

    return session ? children : <Navigate to="/signup" />;
}

export default PrivateRoute;