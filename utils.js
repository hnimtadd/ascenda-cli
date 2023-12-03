const DateParse = (dateString) => {
  var parts = dateString.split("-");
  const [year, month, day] = [
    parseInt(parts[0], 10),
    parseInt(parts[1], 10) - 1,
    parseInt(parts[2], 10),
  ];

  if (0 > month || month > 12) {
    throw ErrInvalidDate;
  }

  if (1 > day || day > 31) {
    throw ErrInvalidDate;
  }
  return new Date(year, month, day);
};
const ErrInvalidDate = new Error("invalid datetime");

export default DateParse;
