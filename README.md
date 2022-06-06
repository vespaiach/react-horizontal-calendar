# React Horizontal Infinity-Scrolling Calendar

A simple and reusable calendar for React application with supporting of infinity scrolling horizontally.

![Demo](https://raw.githubusercontent.com/vespaiach/react-horizontal-calendar/main/view.gif)

# Installation

The Calendar can be installed via [npm](https://github.com/npm/cli):

```
npm install @vespaiach/horizontal-calendar --save
```

Or via [yarn](https://github.com/yarnpkg/yarn):

```
yarn add @vespaiach/horizontal-calendar
```

You will need to install packages: [React](https://github.com/facebook/react), [@use-gesture/react](https://github.com/pmndrs/use-gesture) and [classnames](https://github.com/JedWatson/classnames). Please find their support versions under `peerDependencies` section in [package.json](https://github.com/vespaiach/react-horizontal-calendar/blob/main/package.json)

# The Gist

You will also need to include CSS file `calendar.css` from this package. The below example shows how to include CSS files

```js
import '@vespaiach/horizontal-calendar/dist/calendar.css';
import '@vespaiach/horizontal-calendar/dist/defaultTheme.css';

import React from 'react';
import ReactDOM from 'react-dom';

import Calendar from '@vespaiach/horizontal-calendar';

function App() {
    return (
        <div>
            <Calendar allowRangeSelection />
        </div>
    );
}

ReactDOM.render(<App />, document.querySelector('#root'));
```

**Note:** overwrite `defaultTheme.css` to re-style the calendar as you wish 

# Configuration

The basic usage:

```js
<Calendar onChange={handleChange} />
```

| options             | Note                                             | required                                |
| ------------------- | ------------------------------------------------ | --------------------------------------- |
| onChange            | (values: Date \| [Date, Date] \| null) => void   | no                                      |
| className           | string - css class                               | no                                      |
| startDate           | Date - the date calendar will show from begining | no (default current date)               |
| allowRangeSelection | boolean - allow to select a range of dates       | no (default to only select single date) |
| monthBoxWidth       | number - width of each month box                 | no (default = 290px)                    |
| monthNameCellHeight | number - height of very top cell                 | no (default = 32px)                     |
| weekDayCellHeight   | number - height of week day cell                 | no (default = 32px)                     |
| dateCellHeight      | number - height of date cell                     | no (default = 32px)                     |

# License

See the [MIT license](https://github.com/vespaiach/react-horizontal-calendar/blob/main/LICENSE) file.
