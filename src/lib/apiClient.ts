import axios from "axios";
const API_BASE = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

let accessToken = null;

export const setAccessToken = (token) => {
    accessToken = token;
    // Update the default Authorization header for all subsequent requests
    if (token) {
        apiClient.defaults.headers["Authorization"] = `Bearer ${token}`;
    } else {
        delete apiClient.defaults.headers["Authorization"];
    }
};

// The request interceptor does not need to be changed.
// Setting the default header in setAccessToken handles this.
apiClient.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
});

// --- UPDATED RESPONSE INTERCEPTOR ---
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Note the 'async' keyword here
        const originalRequest = error.config;

        // Check if the error is 401, the request hasn't been retried,
        // AND the failed request was NOT for the refresh token endpoint itself.
        if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== "user/auth/token/refresh/") {
            originalRequest._retry = true; // Mark that we are retrying this request

            try {
                // Attempt to get a new access token
                const { data } = await apiClient.post("user/auth/token/refresh/");

                // If successful, update the access token
                setAccessToken(data.access);

                // The new token is now in apiClient.defaults, so we can re-run the original request
                return apiClient(originalRequest);
            } catch (refreshError) {
                // This block will execute if the refresh token is invalid, expired, or not present.
                // This is the expected behavior for a logged-out user.
                console.log("Could not refresh token. User is logged out.");
                // We don't want to loop, so we reject the promise, letting the original call fail.
                return Promise.reject(refreshError);
            }
        }

        // For any other errors, just reject the promise
        return Promise.reject(error);
    }
);

export default apiClient;
