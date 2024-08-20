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
