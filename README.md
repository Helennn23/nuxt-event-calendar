# Nuxt Event Calendar

A customizable event calendar built with **Nuxt 3** that allows users to select weekends or weekdays, switch between week and month views, and manage events with various features like recurring events, local storage integration, and color-coded event types.

## Features
- **Weekend/Weekday Selection:** Select either weekends or weekdays, automatically clearing non-selected day types.
- **Views:** Switch between week and month views of the calendar.
- **Select/Deselect Days:** Allow users to pick and unpick days on the calendar.
- **Add/Delete Events:** Events can be added or removed based on selected days.
  - Events are limited to weekends, weekdays, or both (general).
- **Event Colors:** Assign one of three colors to each event (optional).
- **LocalStorage Support:** All events are saved in LocalStorage to persist across sessions.
- **Recurring Events:** Add events that repeat monthly on specific dates (e.g., 2nd, 31st).
- **Event Limit (Optional):** Limit events to a maximum of three per day.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/nuxt-event-calendar.git
   cd nuxt-event-calendar

2. Install dependencies:
```sh
npm install
```

3. Run the development server:
```sh
npm run dev
```

4. Open your browser and navigate to:
```sh
http://localhost:3000
```

## Usage
- Use the radio buttons to toggle between viewing only weekends or weekdays.
- Add events by selecting a date and entering event details (type and color).
- Events are saved automatically in LocalStorage, ensuring they persist after page reloads.
- To delete an event, click on the event in the calendar and press the delete button.

## Future Improvements
- Integration with external APIs (e.g., Google Calendar).
- User authentication for event synchronization across devices.
- Enhanced support for recurring events with more complex recurrence rules.
