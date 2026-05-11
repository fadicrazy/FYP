import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getStats(): Promise<{
        totalUsers: number;
        totalPatients: number;
        totalConsultations: number;
        totalPrescriptions: number;
        totalDeliveries: number;
        usersByRole: any[];
        consultationsByStatus: any[];
        deliveriesByStatus: any[];
        recentUsers: (import("mongoose").Document<unknown, {}, import("../users/user.schema").UserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../users/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    getUsers(role?: string): Promise<(import("mongoose").Document<unknown, {}, import("../users/user.schema").UserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../users/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    approveUser(id: string): Promise<(import("mongoose").Document<unknown, {}, import("../users/user.schema").UserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../users/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    deactivateUser(id: string): Promise<(import("mongoose").Document<unknown, {}, import("../users/user.schema").UserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../users/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    deleteUser(id: string): Promise<(import("mongoose").Document<unknown, {}, import("../users/user.schema").UserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../users/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    getActivityLog(): Promise<(import("mongoose").Document<unknown, {}, import("../consultations/consultation.schema").ConsultationDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../consultations/consultation.schema").Consultation & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
