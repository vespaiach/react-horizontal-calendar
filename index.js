const dimension = 7 * 5; // columns * rows
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function createDatePicker(element, fromYear, toYear) {
  let counter = 1;
  let monthEl = document.createElement('div');
  monthEl.classList.add('month');

  const lastDate = new Date(toYear + 1, 0, 1);
  lastDate.setDate(-1);

  for (let curr = new Date(fromYear, 0, 1); curr <= lastDate; curr.setDate(curr.getDate() + 1)) {
    if (counter > dimension) {
      element.append(monthEl);

      monthEl = document.createElement('div');
      monthEl.classList.add('month');
      monthEl.dataset.month = curr.getMonth();
      monthEl.dataset.year = curr.getFullYear();

      counter = 1;
    }

    const buttonEl = document.createElement('button');
    buttonEl.classList.add('date');
    buttonEl.dataset.date = curr.toISOString();

    if (curr.getDate() === 1) {
      const spanEl = document.createElement('span');
      spanEl.appendChild(document.createTextNode(monthNames[curr.getMonth()]));
      buttonEl.append(spanEl);
    }

    const spanEl = document.createElement('span');
    spanEl.appendChild(document.createTextNode(curr.getDate()));
    buttonEl.append(spanEl);
    monthEl.append(buttonEl);

    counter++;
  }
}
