// const refreshAccessToken = async () => {
//     const refreshToken = localStorage.getItem("refresh_token");
//     try {
//         const response = await fetch("http://localhost:8000/api/token/refresh/", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ refresh: refreshToken }),
//         });

//         if (!response.ok) {
//             throw new Error("Failed to refresh access token");
//         }

//         const data = await response.json();
//         localStorage.setItem("access_token", data.access);
//         return data.access;
//     } catch (error) {
//         console.error("Error refreshing access token:", error);
//         localStorage.removeItem("access_token");
//         localStorage.removeItem("refresh_token");
//         localStorage.removeItem("user");
//         window.location.href = "/login";  // Redirect to login
//         throw error;
//     }
// };

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

        // if (response.status === 401) {
        //     // Attempt to refresh the access token
        //     accessToken = await refreshAccessToken();
        //     fetchOptions.headers.Authorization = `Bearer ${accessToken}`;
        //     response = await fetch(url, fetchOptions);
        // }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json()

        return data;

    } catch (error) {
        console.error("Error during fetch:", error);
        throw error;  // Re-throw the error after logging it

    }

};

export default customFetch;
