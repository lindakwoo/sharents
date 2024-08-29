import customFetch from "./fetchWrapper";

export const formatDate = (date, withTime = true) => {
    const dateObj = new Date(date);
    // const hasTime = dateObj.getHours() !== 0 || dateObj.getMinutes() !== 0;
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        ...(withTime && {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        }),
    };
    return new Intl.DateTimeFormat("en-US", options).format(dateObj);
};


export const getAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    // If the current month is earlier than the birth month, adjust years and months
    if (months < 0) {
        years--;
        months += 12;
    }

    // If the current day of the month is earlier than the birth day, adjust months and days
    if (days < 0) {
        months--;
        // Get the number of days in the previous month
        const previousMonth = (today.getMonth() - 1 + 12) % 12;
        const previousMonthYear = previousMonth === 11 ? today.getFullYear() - 1 : today.getFullYear();
        const daysInPreviousMonth = new Date(previousMonthYear, previousMonth + 1, 0).getDate();

        days += daysInPreviousMonth;

        // Handle case where months go below zero
        if (months < 0) {
            years--;
            months += 12;
        }
    }

    // Return 0 for years, months, or days if they are 0
    return { years: years || 0, months: months || 0, days: days || 0 };
};

export const deleteComment = async (commentId) => {
    console.log(commentId);
    const url = `http://localhost/api/comments/${commentId}`;
    const options = { method: "DELETE" };
    console.log(url);
    try {
        const response = await customFetch(url, options);
        console.log(response);
    } catch (error) {
        console.error("Error deleting comment: ", error);
    }
};
