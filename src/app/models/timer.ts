    export class Timers {
        Timers: Timer[];
    }
    export class Timer {
        Name: string;
        Time: Time;
        MultiPart: boolean;
        PartTimers: Array<PartTimer> = [];
        State: number;
        Interval: any;
        SecondsCountdown: number;
        Percent: number;
        PartTimerSeqNo = 0;
    }

    export class PartTimer {
        Name: string;
        SeqNo: number;
        Time: Time;
        State: number;
        Interval: any;
        SecondsCountdown: number;
        Percent: number;
    }

    export class Time {
        DisplayTime: string;
        Minutes: number;
        Seconds: number;
        DurationSeconds: number;
    }
    export enum TimerState {
        Stopped = 0,
        Started = 1,
        Completed = 2,
        NotStarted = 3
    }
