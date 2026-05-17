import { Document } from 'mongoose';
export type MedicineDocument = Medicine & Document;
export declare class Medicine {
    name: string;
    category: string;
    stock: number;
    minStock: number;
    price: number;
    unit: string;
    manufacturer: string;
}
export declare const MedicineSchema: import("mongoose").Schema<Medicine, import("mongoose").Model<Medicine, any, any, any, any, any, Medicine>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Medicine, Document<unknown, {}, Medicine, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Medicine & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Medicine, Document<unknown, {}, Medicine, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Medicine & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    category?: import("mongoose").SchemaDefinitionProperty<string, Medicine, Document<unknown, {}, Medicine, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Medicine & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    stock?: import("mongoose").SchemaDefinitionProperty<number, Medicine, Document<unknown, {}, Medicine, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Medicine & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    minStock?: import("mongoose").SchemaDefinitionProperty<number, Medicine, Document<unknown, {}, Medicine, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Medicine & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    price?: import("mongoose").SchemaDefinitionProperty<number, Medicine, Document<unknown, {}, Medicine, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Medicine & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    unit?: import("mongoose").SchemaDefinitionProperty<string, Medicine, Document<unknown, {}, Medicine, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Medicine & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    manufacturer?: import("mongoose").SchemaDefinitionProperty<string, Medicine, Document<unknown, {}, Medicine, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Medicine & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Medicine>;
