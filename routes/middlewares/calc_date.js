function addDays(date, days) {
    const copy = new Date(Number(date));
    copy.setDate(date.getDate() + days);
    return copy;
}

function addMonths(date, months) {
    const copy = new Date(Number(date));
    copy.setMonth(date.getMonth() + months);
    return copy;
}

module.exports = {addDays, addMonths}