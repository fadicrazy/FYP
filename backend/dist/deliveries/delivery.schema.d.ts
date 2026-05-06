import { Document, Types } from 'mongoose';
export type DeliveryDocument = Delivery & Document;
export declare enum DeliveryStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled"
}
export declare class Delivery {
    prescriptionId: Types.ObjectId;
    pharmacyId: Types.ObjectId;
    status: DeliveryStatus;
    trackingNotes: string;
    deliveryAddress: string;
    estimatedDelivery: Date;
    deliveredAt: Date;
}
export declare const DeliverySchema: import("mongoose").Schema<Delivery, import("mongoose").Model<Delivery, any, any, any, any, any, Delivery>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Delivery, Document<unknown, {}, Delivery, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Delivery & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    prescriptionId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Delivery, Document<unknown, {}, Delivery, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Delivery & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    pharmacyId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Delivery, Document<unknown, {}, Delivery, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Delivery & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<DeliveryStatus, Delivery, Document<unknown, {}, Delivery, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Delivery & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    trackingNotes?: import("mongoose").SchemaDefinitionProperty<string, Delivery, Document<unknown, {}, Delivery, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Delivery & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    deliveryAddress?: import("mongoose").SchemaDefinitionProperty<string, Delivery, Document<unknown, {}, Delivery, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Delivery & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    estimatedDelivery?: import("mongoose").SchemaDefinitionProperty<Date, Delivery, Document<unknown, {}, Delivery, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Delivery & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    deliveredAt?: import("mongoose").SchemaDefinitionProperty<Date, Delivery, Document<unknown, {}, Delivery, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Delivery & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Delivery>;
