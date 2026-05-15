"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarType = exports.EventType = exports.RecurrenceFrequency = exports.AttendeeStatus = exports.EventStatus = exports.EventVisibility = void 0;
var EventVisibility;
(function (EventVisibility) {
    EventVisibility["PUBLIC"] = "public";
    EventVisibility["TEAM"] = "team";
    EventVisibility["PRIVATE"] = "private";
})(EventVisibility || (exports.EventVisibility = EventVisibility = {}));
var EventStatus;
(function (EventStatus) {
    EventStatus["DRAFT"] = "draft";
    EventStatus["CONFIRMED"] = "confirmed";
    EventStatus["CANCELLED"] = "cancelled";
    EventStatus["TENTATIVE"] = "tentative";
})(EventStatus || (exports.EventStatus = EventStatus = {}));
var AttendeeStatus;
(function (AttendeeStatus) {
    AttendeeStatus["PENDING"] = "pending";
    AttendeeStatus["ACCEPTED"] = "accepted";
    AttendeeStatus["DECLINED"] = "declined";
    AttendeeStatus["TENTATIVE"] = "tentative";
})(AttendeeStatus || (exports.AttendeeStatus = AttendeeStatus = {}));
var RecurrenceFrequency;
(function (RecurrenceFrequency) {
    RecurrenceFrequency["DAILY"] = "daily";
    RecurrenceFrequency["WEEKLY"] = "weekly";
    RecurrenceFrequency["MONTHLY"] = "monthly";
    RecurrenceFrequency["YEARLY"] = "yearly";
})(RecurrenceFrequency || (exports.RecurrenceFrequency = RecurrenceFrequency = {}));
var EventType;
(function (EventType) {
    EventType["MEETING"] = "meeting";
    EventType["TASK"] = "task";
    EventType["REMINDER"] = "reminder";
    EventType["HOLIDAY"] = "holiday";
    EventType["OUT_OF_OFFICE"] = "out_of_office";
    EventType["DEADLINE"] = "deadline";
})(EventType || (exports.EventType = EventType = {}));
var CalendarType;
(function (CalendarType) {
    CalendarType["PERSONAL"] = "personal";
    CalendarType["TEAM"] = "team";
    CalendarType["ORGANIZATION"] = "organization";
    CalendarType["SHARED"] = "shared";
})(CalendarType || (exports.CalendarType = CalendarType = {}));
//# sourceMappingURL=calendar.enums.js.map