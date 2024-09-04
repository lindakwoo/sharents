
const customFetch = async (url, options = {}) => {
    let accessToken = localStorage.getItem("access_token");

    const fetchOptions = {
        ...options,
        headers: {
            ...options.headers,
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    };

    try {
        let response = await fetch(url, fetchOptions);

        if (response.status === 204) {
            // Handle 204 No Content: return an empty object
            return {};
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        try {
            const data = await response.json();
            return data;
        } catch (jsonError) {
            // Handle cases where response is not valid JSON
            console.error("Failed to parse JSON:", jsonError);
            throw new Error("Response is not valid JSON");
        }

    } catch (error) {
        console.error("Error during fetch:", error);
        throw error;  // Re-throw the error after logging it

    }

};

export default customFetch;
