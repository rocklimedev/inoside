"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivitySeverity = exports.ActivityAction = exports.ContextTag = exports.OwnershipStatus = exports.TimelineExpectation = exports.PurposeType = exports.ServiceType = exports.ProjectType = exports.AddressType = exports.PreferredCommunication = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["CLIENT"] = "client";
    UserRole["ARCHITECT"] = "architect";
    UserRole["SUPERVISOR"] = "supervisor";
    UserRole["ADMIN"] = "admin";
    UserRole["VENDOR"] = "vendor";
    UserRole["TEAM_MEMBER"] = "team_member";
})(UserRole || (exports.UserRole = UserRole = {}));
var PreferredCommunication;
(function (PreferredCommunication) {
    PreferredCommunication["CALL"] = "Call";
    PreferredCommunication["WHATSAPP"] = "WhatsApp";
    PreferredCommunication["EMAIL"] = "Email";
})(PreferredCommunication || (exports.PreferredCommunication = PreferredCommunication = {}));
var AddressType;
(function (AddressType) {
    AddressType["RESIDENTIAL"] = "residential";
    AddressType["BILLING"] = "billing";
    AddressType["CORRESPONDENCE"] = "correspondence";
    AddressType["OFFICE"] = "office";
    AddressType["PROJECT_SITE"] = "project_site";
    AddressType["TEMPORARY"] = "temporary";
    AddressType["WAREHOUSE"] = "warehouse";
    AddressType["OTHER"] = "other";
})(AddressType || (exports.AddressType = AddressType = {}));
var ProjectType;
(function (ProjectType) {
    ProjectType["NEW_CONSTRUCTION"] = "New Construction";
    ProjectType["RENOVATION"] = "Renovation";
    ProjectType["INTERIOR_FITOUT"] = "Interior Fit-out";
})(ProjectType || (exports.ProjectType = ProjectType = {}));
var ServiceType;
(function (ServiceType) {
    ServiceType["CONSTRUCTION"] = "Construction";
    ServiceType["INTERIOR"] = "Interior";
    ServiceType["RENOVATION"] = "Renovation";
})(ServiceType || (exports.ServiceType = ServiceType = {}));
var PurposeType;
(function (PurposeType) {
    PurposeType["RESIDENTIAL"] = "Residential";
    PurposeType["COMMERCIAL"] = "Commercial";
    PurposeType["MIXED"] = "Mixed";
})(PurposeType || (exports.PurposeType = PurposeType = {}));
var TimelineExpectation;
(function (TimelineExpectation) {
    TimelineExpectation["IMMEDIATE"] = "Immediate";
    TimelineExpectation["FLEXIBLE"] = "Flexible";
    TimelineExpectation["FIXED_DATE"] = "Fixed Date";
})(TimelineExpectation || (exports.TimelineExpectation = TimelineExpectation = {}));
var OwnershipStatus;
(function (OwnershipStatus) {
    OwnershipStatus["OWNED"] = "Owned";
    OwnershipStatus["RENTED"] = "Rented";
    OwnershipStatus["UNDER_PROCESS"] = "Under Process";
})(OwnershipStatus || (exports.OwnershipStatus = OwnershipStatus = {}));
var ContextTag;
(function (ContextTag) {
    ContextTag["AUTH"] = "AUTH";
    ContextTag["USER"] = "USER";
    ContextTag["PROJECT"] = "PROJECT";
    ContextTag["INVENTORY"] = "INVENTORY";
    ContextTag["BOQ"] = "BOQ";
    ContextTag["VENDOR"] = "VENDOR";
    ContextTag["CLIENT"] = "CLIENT";
    ContextTag["SITE"] = "SITE";
    ContextTag["TASK"] = "TASK";
    ContextTag["DRAWING"] = "DRAWING";
    ContextTag["COST_ESTIMATE"] = "COST_ESTIMATE";
})(ContextTag || (exports.ContextTag = ContextTag = {}));
var ActivityAction;
(function (ActivityAction) {
    ActivityAction["CREATE"] = "CREATE";
    ActivityAction["UPDATE"] = "UPDATE";
    ActivityAction["DELETE"] = "DELETE";
    ActivityAction["VIEW"] = "VIEW";
    ActivityAction["LOGIN"] = "LOGIN";
    ActivityAction["LOGOUT"] = "LOGOUT";
    ActivityAction["ASSIGN"] = "ASSIGN";
    ActivityAction["APPROVE"] = "APPROVE";
    ActivityAction["REJECT"] = "REJECT";
    ActivityAction["DOWNLOAD"] = "DOWNLOAD";
    ActivityAction["UPLOAD"] = "UPLOAD";
})(ActivityAction || (exports.ActivityAction = ActivityAction = {}));
var ActivitySeverity;
(function (ActivitySeverity) {
    ActivitySeverity["INFO"] = "INFO";
    ActivitySeverity["WARNING"] = "WARNING";
    ActivitySeverity["ERROR"] = "ERROR";
    ActivitySeverity["CRITICAL"] = "CRITICAL";
})(ActivitySeverity || (exports.ActivitySeverity = ActivitySeverity = {}));
//# sourceMappingURL=index.js.map