import { Document, Types } from 'mongoose';
export type ConsultationDocument = Consultation & Document;
export declare enum ConsultationStatus {
    PENDING = "pending",
    ACCEPTED = "accepted",
    ACTIVE = "active",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare class Consultation {
    patientId: Types.ObjectId;
    doctorId: Types.ObjectId;
    nurseId: Types.ObjectId;
    status: ConsultationStatus;
    videoRoomId: string;
    symptoms: string;
    notes: string;
    diagnosis: string;
    scheduledAt: Date;
    startedAt: Date;
    endedAt: Date;
}
export declare const ConsultationSchema: import("mongoose").Schema<Consultation, import("mongoose").Model<Consultation, any, any, any, any, any, Consultation>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Consultation, Document<unknown, {}, Consultation, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Consultation & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    patientId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Consultation, Document<unknown, {}, Consultation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Consultation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    doctorId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Consultation, Document<unknown, {}, Consultation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Consultation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    nurseId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Consultation, Document<unknown, {}, Consultation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Consultation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<ConsultationStatus, Consultation, Document<unknown, {}, Consultation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Consultation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    videoRoomId?: import("mongoose").SchemaDefinitionProperty<string, Consultation, Document<unknown, {}, Consultation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Consultation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    symptoms?: import("mongoose").SchemaDefinitionProperty<string, Consultation, Document<unknown, {}, Consultation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Consultation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    notes?: import("mongoose").SchemaDefinitionProperty<string, Consultation, Document<unknown, {}, Consultation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Consultation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    diagnosis?: import("mongoose").SchemaDefinitionProperty<string, Consultation, Document<unknown, {}, Consultation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Consultation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    scheduledAt?: import("mongoose").SchemaDefinitionProperty<Date, Consultation, Document<unknown, {}, Consultation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Consultation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    startedAt?: import("mongoose").SchemaDefinitionProperty<Date, Consultation, Document<unknown, {}, Consultation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Consultation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    endedAt?: import("mongoose").SchemaDefinitionProperty<Date, Consultation, Document<unknown, {}, Consultation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Consultation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Consultation>;
