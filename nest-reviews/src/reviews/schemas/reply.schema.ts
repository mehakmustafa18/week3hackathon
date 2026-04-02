import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Reply extends Document {
  @Prop({ type: Types.ObjectId, required: true })
  reviewId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  userName: string;

  @Prop({ required: true })
  comment: string;
}

export const ReplySchema = SchemaFactory.createForClass(Reply);
