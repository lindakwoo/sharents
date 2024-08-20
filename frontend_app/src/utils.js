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

    // If the current month is earlier than the birth month, adjust years and months
    if (months < 0) {
        years--;
        months += 12;
    }

    // If the current day of the month is earlier than the birth day, adjust months
    if (today.getDate() < birthDate.getDate()) {
        months--;
        // Handle case where months go below zero
        if (months < 0) {
            years--;
            months += 12;
        }
    }

    // Return 0 for years or months if they are 0
    return { years: years || 0, months: months || 0 };
};
