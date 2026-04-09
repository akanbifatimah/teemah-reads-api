import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BookDocument = HydratedDocument<Book>;

@Schema({ timestamps: true })  // adds createdAt and updatedAt automatically
export class Book {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  author: string;

  @Prop()
  year: number;

  @Prop({ default: false })
  read: boolean;
}

export const BookSchema = SchemaFactory.createForClass(Book);