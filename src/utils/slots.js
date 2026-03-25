import { scheduleConfig } from '../data/schedule';
import { format, addMinutes, setHours, setMinutes } from 'date-fns';

/**
 * Generate all time slots for a given day
 */
function generateDaySlots(date) {
  const slots = [];
  const { startHour, endHour, slotIntervalMinutes } = scheduleConfig;
  
  // Create a new date instance to avoid mutating the original
  let current = new Date(date);
  current.setHours(startHour, 0, 0, 0);
  
  const end = new Date(date);
  end.setHours(endHour, 0, 0, 0);

  while (current < end) {
    slots.push(new Date(current));
    current = addMinutes(current, slotIntervalMinutes);
  }
  return slots;
}

/**
 * Check if a proposed slot conflicts with existing bookings
 */
function hasConflict(proposedStart, durationMinutes, bookings, excludeId = null) {
  const proposedEnd = addMinutes(proposedStart, durationMinutes);

  return bookings
    .filter(b => b.id !== excludeId && b.status !== 'cancelled')
    .some(booking => {
      const bookingStart = new Date(booking.datetime);
      const bookingEnd = addMinutes(bookingStart, booking.duration);
      return proposedStart < bookingEnd && proposedEnd > bookingStart;
    });
}

/**
 * Get available slots for a specific date and service duration
 */
export function generateSlots(date, durationMinutes, bookings) {
  // Check if it's a working day
  const dayOfWeek = new Date(date).getDay();
  if (!scheduleConfig.workingDays.includes(dayOfWeek)) return [];

  const allSlots = generateDaySlots(date);
  
  // We need to know when the day ends to avoid overallapping with closing time
  const dayEnd = new Date(date);
  dayEnd.setHours(scheduleConfig.endHour, 0, 0, 0);

  return allSlots.map(slot => {
    const slotEnd = addMinutes(slot, durationMinutes);
    const isPast = slot < new Date();
    const isWithinBounds = slotEnd <= dayEnd;
    const isConflict = hasConflict(slot, durationMinutes, bookings);
    
    return {
      time: format(slot, 'HH:mm'),
      datetime: slot.toISOString(),
      available: !isPast && isWithinBounds && !isConflict
    };
  });
}

/**
 * Check if a specific slot is still available (for double-checking before confirming)
 */
export function isSlotAvailable(datetime, durationMinutes, bookings, excludeId = null) {
  return !hasConflict(new Date(datetime), durationMinutes, bookings, excludeId);
}

/**
 * Format duration in minutes to human-readable string
 */
export function formatDuration(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h${m}min`;
}
