import config from 'react-global-configuration';

// Define environment variables
const ENV = process.env.NODE_ENV || 'development'; // Default to development if not set

// Base URLs for different environments
const BASE_URLS = {
    production: "https://ticketbooking-12.appspot.com",
    development: "http://192.168.0.103:8080",
};

// Set the configuration based on the environment
try {
    const baseUrl = BASE_URLS[ENV] || BASE_URLS.development; // Fallback to development if the environment is unknown

    config.set({
        base_url: baseUrl,
        local_url: BASE_URLS.development, // Local URL can remain the same for development
    });

    console.log(`Configuration set: base_url = ${baseUrl}, local_url = ${BASE_URLS.development}`);
} catch (error) {
    console.error("Error setting configuration:", error);
}

// Function to get the base URL
export const getBaseUrl = () => {
    return config.get('base_url');
};

// Function to get the local URL
export const getLocalUrl = () => {
    return config.get('local_url');
};

// Function to log the current configuration
export const logCurrentConfig = () => {
    console.log("Current Configuration:", config.get());
};

export default config;