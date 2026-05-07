export enum EventVisibility {
  PUBLIC = 'public', // visible to entire org
  TEAM = 'team', // visible to team members
  PRIVATE = 'private', // only creator + explicit attendees
}

export enum EventStatus {
  DRAFT = 'draft',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  TENTATIVE = 'tentative',
}

export enum AttendeeStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  TENTATIVE = 'tentative',
}

export enum RecurrenceFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export enum EventType {
  MEETING = 'meeting',
  TASK = 'task',
  REMINDER = 'reminder',
  HOLIDAY = 'holiday',
  OUT_OF_OFFICE = 'out_of_office',
  DEADLINE = 'deadline',
}

export enum CalendarType {
  PERSONAL = 'personal',
  TEAM = 'team',
  ORGANIZATION = 'organization',
  SHARED = 'shared',
}
