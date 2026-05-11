import { Document, Types } from 'mongoose';
export type PatientDocument = Patient & Document;
export declare class Patient {
    userId: Types.ObjectId;
    age: number;
    gender: string;
    address: string;
    bloodGroup: string;
    medicalHistory: string[];
    allergies: string[];
    emergencyContact: string;
    emergencyContactName: string;
}
export declare const PatientSchema: import("mongoose").Schema<Patient, import("mongoose").Model<Patient, any, any, any, any, any, Patient>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Patient, Document<unknown, {}, Patient, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Patient & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Patient, Document<unknown, {}, Patient, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Patient & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    age?: import("mongoose").SchemaDefinitionProperty<number, Patient, Document<unknown, {}, Patient, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Patient & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    gender?: import("mongoose").SchemaDefinitionProperty<string, Patient, Document<unknown, {}, Patient, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Patient & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    address?: import("mongoose").SchemaDefinitionProperty<string, Patient, Document<unknown, {}, Patient, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Patient & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    bloodGroup?: import("mongoose").SchemaDefinitionProperty<string, Patient, Document<unknown, {}, Patient, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Patient & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    medicalHistory?: import("mongoose").SchemaDefinitionProperty<string[], Patient, Document<unknown, {}, Patient, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Patient & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    allergies?: import("mongoose").SchemaDefinitionProperty<string[], Patient, Document<unknown, {}, Patient, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Patient & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    emergencyContact?: import("mongoose").SchemaDefinitionProperty<string, Patient, Document<unknown, {}, Patient, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Patient & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    emergencyContactName?: import("mongoose").SchemaDefinitionProperty<string, Patient, Document<unknown, {}, Patient, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Patient & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Patient>;
