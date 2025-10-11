// Bring in React core functions + types
import React, { createContext, useState, useEffect, ReactNode } from "react";
// Import custom apiClient (wrapper for API calls) + function to set access token in memory
import apiClient, { setAccessToken } from "@/lib/apiClient";
// Import the User type definition for TypeScript
import { User } from "@/types/api";

/** Define shape of data required when registering or logging in */
interface AuthPayload {
    email: string;
    password: string;
    username?: string; // Optional, only used for registration
}

/** Define the contract for our AuthContext */
interface AuthContextType {
    user: User | null; // current logged-in user, or null if not
    loading: boolean; // whether auth state is still initializing
    isLoggedIn: boolean; // quick flag if user exists
    register: (payload: AuthPayload) => Promise<void>; // function to handle registration
    login: (payload: AuthPayload) => Promise<void>; // function to handle login
    logout: () => Promise<void>; // function to handle logout
}

// Create the actual context with default placeholder values
export const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    isLoggedIn: false,
    register: async () => {}, // placeholder async funcs so context has defaults
    login: async () => {},
    logout: async () => {},
});

interface Props {
    children: ReactNode; // anything wrapped inside the AuthProvider
}

// React component that provides auth state + functions to children
export const AuthProvider: React.FC<Props> = ({ children }) => {
    // Local state for currently logged-in user
    const [user, setUser] = useState<User | null>(null);
    // Local state for loading indicator (true while checking tokens/session)
    const [loading, setLoading] = useState<boolean>(true);

    // On first render, try to restore session automatically
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Step 1: Attempt to refresh the access token using httpOnly refresh cookie
                const { data } = await apiClient.post<{ access: string }>("user/auth/token/refresh/");
                // Save the fresh access token in memory for API calls
                setAccessToken(data.access);

                // Step 2: Fetch the logged-in user's profile
                const userResponse = await apiClient.get<User>("user/profile/");
                setUser(userResponse.data); // update state with user data
            } catch (error) {
                // If refresh fails, it means no valid session exists
                console.log("Initialization failed: No valid session found.");
                setUser(null); // ensure no stale user remains
                setAccessToken(null); // clear token just in case
            } finally {
                // Regardless of success/failure, stop showing loading
                setLoading(false);
            }
        };

        initializeAuth(); // run auth check once on mount
    }, []);

    // Helper function to fetch user profile explicitly
    const fetchCurrentUser = async () => {
        const res = await apiClient.get<User>("user/profile/");
        setUser(res.data);
    };

    // Handles user registration
    const register = async (payload: AuthPayload) => {
        try {
            // Send register request with email, password (+ optional username)
            const { data } = await apiClient.post<{ access: string }>("user/auth/register/", payload);
            // Store returned access token
            setAccessToken(data.access);
            // After registering, fetch the user profile
            await fetchCurrentUser();
        } catch (error) {
            throw error;
        }
    };

    // Handles user login
    const login = async (payload: AuthPayload) => {
        try {
            // Send login request
            const { data } = await apiClient.post<{ access: string }>("user/auth/login/", payload);
            // Save access token
            setAccessToken(data.access);
            // Then fetch user info
            await fetchCurrentUser();
        } catch (error) {
            throw error;
        }
    };

    // Boolean shortcut to know if user is logged in

    // Handles user logout
    const logout = async () => {
        try {
            // Inform backend to clear refresh token cookie
            await apiClient.post("user/auth/logout/");
        } catch (error) {
            throw error;
        } finally {
            setUser(null);
            setAccessToken(null); // clear memory token
        }
    };

    let isLoggedIn = !!user;

    // Wrap children with AuthContext.Provider so they can consume state + funcs
    return <AuthContext.Provider value={{ user, loading, isLoggedIn, register, login, logout }}>{children}</AuthContext.Provider>;
};
