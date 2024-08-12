export interface SearchTimeTrackerResponseModel {
    collaboratorId: string;
    collaboratorName: string;
    startTime: Date;
    endTime: Date;
    hours: string;
}

export interface TimeTrackerRequest {
    startDate?: Date;
    endDate?: Date;
    timeZoneId?: string;
    taskId?: string;
    collaboratorId?: string;
}

export interface HoursResponse{
    hoursToday: string;
    hoursMonth: string;
}