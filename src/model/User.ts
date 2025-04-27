import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const  MessageSchema: Schema<Message> = new Schema({
   content:{
    type: String,
    required: true,
   },
   createdAt:{
    type: Date,
    required: true,
    default: Date.now,
   },
})

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    isVerified: boolean;
    expireVerifyCode: Date;
    isAcceptingMessages: boolean;
    messages: Message[];
}

const  UserSchema: Schema<User> = new Schema({
    username:{
     type: String,
     required: [true, "Username is required"],
     trim: true,
     unique: true,
    },
    email:{
     type: String,
     required: true,
     unique: true,
     match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    password:{
     type: String,
     required: [true, "Password is required"],
    },
    verifyCode:{
        type: String,
        required: [true, "Verify code is required"],
    },
    expireVerifyCode:{
        type: Date,
        required: [true, "Expire verify code is required"],
    },
    isVerified:{
        type: Boolean,
        default: false,
    },
    isAcceptingMessages:{
        type: Boolean,
        default: true,
    },
    messages:[MessageSchema],
 })

 const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User", UserSchema);

 export default UserModel;