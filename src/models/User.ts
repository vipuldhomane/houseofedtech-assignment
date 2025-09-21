// import { Schema, model, models } from "mongoose";

// const UserSchema = new Schema(
//   {
//     username: { type: String, required: true, unique: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true }, 
//   },
//   { timestamps: true }
// );

// export const User = models.User || model("User", UserSchema);
import { Schema, model, models, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export const User = models.User || model<IUser>("User", UserSchema);
