import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHealth(): string;
    getStats(): Promise<{
        patientsServed: number;
        doctorsOnline: number;
        remoteAreas: number;
        patientsToday: number;
    }>;
}
