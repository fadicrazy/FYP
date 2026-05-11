import { ConsultationsService } from './consultations.service';
export declare class ConsultationsController {
    private readonly consultationsService;
    constructor(consultationsService: ConsultationsService);
    create(body: any, req: any): Promise<import("./consultation.schema").ConsultationDocument>;
    findAll(status?: string, doctorId?: string): Promise<import("./consultation.schema").ConsultationDocument[]>;
    findPending(): Promise<import("./consultation.schema").ConsultationDocument[]>;
    findMyConsultations(req: any): Promise<import("./consultation.schema").ConsultationDocument[]>;
    findOne(id: string): Promise<import("./consultation.schema").ConsultationDocument>;
    accept(id: string, req: any): Promise<import("./consultation.schema").ConsultationDocument>;
    start(id: string): Promise<import("./consultation.schema").ConsultationDocument>;
    complete(id: string, body: {
        notes: string;
        diagnosis: string;
    }): Promise<import("./consultation.schema").ConsultationDocument>;
    cancel(id: string): Promise<import("./consultation.schema").ConsultationDocument>;
}
