function createDatePicker(element, fromYear, toYear) {
  const date = new Date(fromYear, 0, 1);
  let i = 0;

  do {
    date.

    date.setDate(++i);
  } while (date.getFullYear() <= toYear);
}
