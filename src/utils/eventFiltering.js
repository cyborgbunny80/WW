import { isEventUpcoming } from './dateFormatting';

export const filterEventsByLocation = (events, city, state) => {
  return events.filter(event =>
    event.city === city && event.state === state
  );
};

export const filterEventsBySearchAndCategory = (events, searchQuery, selectedCategory) => {
  return events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' ||
      event.category.toLowerCase().includes(selectedCategory) ||
      event.category.toLowerCase().replace('&', '').replace(' ', '') === selectedCategory;

    return matchesSearch && matchesCategory;
  });
};

export const getUpcomingAndPastEvents = (events) => {
  const upcoming = events.filter(event => isEventUpcoming(event.date));
  const past = events.filter(event => !isEventUpcoming(event.date));
  return { upcoming, past };
};