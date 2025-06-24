import { Document } from "mongoose";
import { Schema } from "mongoose";

export interface IBorrow extends Document {
  book: Schema.Types.ObjectId;
  quantity: number;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
