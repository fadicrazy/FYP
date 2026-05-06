import { Document, Types } from 'mongoose';
export type VitalDocument = Vital & Document;
export declare class Vital {
    patientId: Types.ObjectId;
    bloodPressure: string;
    temperature: number;
    sugarLevel: number;
    pulse: number;
    oxygenSaturation: number;
    weight: number;
    height: number;
    recordedBy: Types.ObjectId;
    notes: string;
}
export declare const VitalSchema: import("mongoose").Schema<Vital, import("mongoose").Model<Vital, any, any, any, any, any, Vital>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Vital, Document<unknown, {}, Vital, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Vital & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    patientId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Vital, Document<unknown, {}, Vital, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vital & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    bloodPressure?: import("mongoose").SchemaDefinitionProperty<string, Vital, Document<unknown, {}, Vital, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vital & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    temperature?: import("mongoose").SchemaDefinitionProperty<number, Vital, Document<unknown, {}, Vital, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vital & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    sugarLevel?: import("mongoose").SchemaDefinitionProperty<number, Vital, Document<unknown, {}, Vital, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vital & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    pulse?: import("mongoose").SchemaDefinitionProperty<number, Vital, Document<unknown, {}, Vital, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vital & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    oxygenSaturation?: import("mongoose").SchemaDefinitionProperty<number, Vital, Document<unknown, {}, Vital, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vital & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    weight?: import("mongoose").SchemaDefinitionProperty<number, Vital, Document<unknown, {}, Vital, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vital & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    height?: import("mongoose").SchemaDefinitionProperty<number, Vital, Document<unknown, {}, Vital, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vital & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    recordedBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Vital, Document<unknown, {}, Vital, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vital & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    notes?: import("mongoose").SchemaDefinitionProperty<string, Vital, Document<unknown, {}, Vital, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Vital & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Vital>;
