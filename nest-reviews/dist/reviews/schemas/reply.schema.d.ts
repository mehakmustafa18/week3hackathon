import { Document, Types } from 'mongoose';
export declare class Reply extends Document {
    reviewId: Types.ObjectId;
    userId: Types.ObjectId;
    userName: string;
    comment: string;
}
export declare const ReplySchema: import("mongoose").Schema<Reply, import("mongoose").Model<Reply, any, any, any, (Document<unknown, any, Reply, any, import("mongoose").DefaultSchemaOptions> & Reply & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Reply, any, import("mongoose").DefaultSchemaOptions> & Reply & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}), any, Reply>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Reply, Document<unknown, {}, Reply, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Reply & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Reply, Document<unknown, {}, Reply, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Reply & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    comment?: import("mongoose").SchemaDefinitionProperty<string, Reply, Document<unknown, {}, Reply, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Reply & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Reply, Document<unknown, {}, Reply, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Reply & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    userName?: import("mongoose").SchemaDefinitionProperty<string, Reply, Document<unknown, {}, Reply, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Reply & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    reviewId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Reply, Document<unknown, {}, Reply, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Reply & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Reply>;
