import { Model } from 'mongoose';
import { Consultation, ConsultationDocument } from './consultation.schema';
import { NotificationsService } from '../notifications/notifications.service';
export declare class ConsultationsService {
    private consultationModel;
    private readonly notificationsService;
    constructor(consultationModel: Model<ConsultationDocument>, notificationsService: NotificationsService);
    create(data: Partial<Consultation>): Promise<ConsultationDocument>;
    findAll(filters?: any): Promise<ConsultationDocument[]>;
    findById(id: string): Promise<ConsultationDocument>;
    findByDoctor(doctorId: string): Promise<ConsultationDocument[]>;
    findByPatient(patientId: string): Promise<ConsultationDocument[]>;
    findPending(): Promise<ConsultationDocument[]>;
    accept(id: string, doctorId: string): Promise<ConsultationDocument>;
    start(id: string): Promise<ConsultationDocument>;
    complete(id: string, notes: string, diagnosis: string): Promise<ConsultationDocument>;
    cancel(id: string): Promise<ConsultationDocument>;
    count(filters?: any): Promise<number>;
    countByStatus(): Promise<any>;
}
