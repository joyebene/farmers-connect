import axios from 'axios';

const apiClient = axios.create({
    baseURL: '/api', // Your API base URL
});

// Request Interceptor: Adds the access token to every request
apiClient.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handles token expiration and refresh
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Check if the error is a 401 and we haven't retried yet
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Mark this request as retried

            try {
                // The browser will automatically send the httpOnly cookie
                const { data } = await axios.post('/api/auth/refresh');

                // Store the new access token
                if (typeof window !== 'undefined') {
                    localStorage.setItem('accessToken', data.accessToken);
                }

                // Update the authorization header for the original request
                apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;

                // Retry the original request with the new token
                return apiClient(originalRequest);
            } catch (refreshError) {
                // If refreshing fails, clear storage and redirect to login
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('role');
                    window.location.href = '/login';
                }

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;