import { Model } from 'mongoose';
import { User, UserDocument } from '../users/user.schema';
import { PatientDocument } from '../patients/patient.schema';
import { Consultation, ConsultationDocument } from '../consultations/consultation.schema';
import { PrescriptionDocument } from '../prescriptions/prescription.schema';
import { DeliveryDocument } from '../deliveries/delivery.schema';
export declare class AdminService {
    private userModel;
    private patientModel;
    private consultationModel;
    private prescriptionModel;
    private deliveryModel;
    constructor(userModel: Model<UserDocument>, patientModel: Model<PatientDocument>, consultationModel: Model<ConsultationDocument>, prescriptionModel: Model<PrescriptionDocument>, deliveryModel: Model<DeliveryDocument>);
    getStats(): Promise<{
        totalUsers: number;
        totalPatients: number;
        totalConsultations: number;
        totalPrescriptions: number;
        totalDeliveries: number;
        usersByRole: any[];
        consultationsByStatus: any[];
        deliveriesByStatus: any[];
        recentUsers: (import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    getAllUsers(role?: string): Promise<(import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    approveUser(userId: string): Promise<(import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    deactivateUser(userId: string): Promise<(import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    deleteUser(userId: string): Promise<(import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    getActivityLog(): Promise<(import("mongoose").Document<unknown, {}, ConsultationDocument, {}, import("mongoose").DefaultSchemaOptions> & Consultation & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getMonthlyStats(): Promise<{
        monthlyConsultations: any[];
        monthlyRegistrations: any[];
    }>;
}
