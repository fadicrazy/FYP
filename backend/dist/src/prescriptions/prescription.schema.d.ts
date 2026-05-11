import { Document, Types } from 'mongoose';
export type PrescriptionDocument = Prescription & Document;
export declare class Prescription {
    consultationId: Types.ObjectId;
    doctorId: Types.ObjectId;
    patientId: Types.ObjectId;
    medicines: {
        name: string;
        dosage: string;
        frequency: string;
        duration: string;
        instructions: string;
    }[];
    instructions: string;
    diagnosis: string;
    notes: string;
}
export declare const PrescriptionSchema: import("mongoose").Schema<Prescription, import("mongoose").Model<Prescription, any, any, any, any, any, Prescription>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Prescription, Document<unknown, {}, Prescription, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Prescription & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    consultationId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Prescription, Document<unknown, {}, Prescription, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Prescription & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    doctorId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Prescription, Document<unknown, {}, Prescription, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Prescription & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    patientId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Prescription, Document<unknown, {}, Prescription, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Prescription & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    medicines?: import("mongoose").SchemaDefinitionProperty<{
        name: string;
        dosage: string;
        frequency: string;
        duration: string;
        instructions: string;
    }[], Prescription, Document<unknown, {}, Prescription, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Prescription & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    instructions?: import("mongoose").SchemaDefinitionProperty<string, Prescription, Document<unknown, {}, Prescription, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Prescription & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    diagnosis?: import("mongoose").SchemaDefinitionProperty<string, Prescription, Document<unknown, {}, Prescription, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Prescription & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    notes?: import("mongoose").SchemaDefinitionProperty<string, Prescription, Document<unknown, {}, Prescription, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Prescription & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Prescription>;
