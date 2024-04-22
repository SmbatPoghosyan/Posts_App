const formatingDate = (date) => {
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let dayOfMonth = date.getDate();
  if (month < 10) month = "0" + month;
  if (dayOfMonth < 10) dayOfMonth = "0" + dayOfMonth;
  return `${year}-${month}-${dayOfMonth}`;
};

module.exports = formatingDate;
