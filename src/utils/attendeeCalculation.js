/**
 * Calculate the dynamic attendee count for an event
 * Count = number of users who favorited + number of users who added to calendar
 *
 * @param {string|number} eventId - The event ID
 * @param {Set} favoriteEvents - Set of event IDs that are favorited
 * @param {Set} calendarEvents - Set of event IDs that are in calendar
 * @returns {number} Total count of interested users
 */
export const calculateAttendeeCount = (eventId, favoriteEvents, calendarEvents) => {
  const eventIdStr = String(eventId);

  // Count favorites
  const hasFavorite = favoriteEvents && favoriteEvents.has(eventIdStr) ? 1 : 0;

  // Count calendar adds
  const hasCalendar = calendarEvents && calendarEvents.has(eventIdStr) ? 1 : 0;

  // For now, this returns 0, 1, or 2 (current user's interactions only)
  // In a real multi-user system, this would query a database for total counts
  return hasFavorite + hasCalendar;
};

/**
 * Get the attendee count to display for an event
 * Uses the static attendees field as a base count, then adds current user's interactions
 *
 * @param {object} event - The event object
 * @param {Set} favoriteEvents - Set of event IDs that are favorited
 * @param {Set} calendarEvents - Set of event IDs that are in calendar
 * @returns {number} Display count
 */
export const getDisplayAttendeeCount = (event, favoriteEvents, calendarEvents) => {
  // Use existing attendees count as base (represents other users)
  const baseCount = event.attendees || 0;

  // Add current user's interactions
  const userInteractions = calculateAttendeeCount(event.id, favoriteEvents, calendarEvents);

  return baseCount + userInteractions;
};
