import { Document, Schema, model } from 'mongoose';


export interface IClient extends Document {
    login: string;
    password: string;
    firstName: string;
    lastName: string;
    address:string;
    phone: number;
    mail: string;
    postCode:number;
    role: string;
}

const clientSchema = new Schema<IClient>({
    login: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: false },
    phone: { type: Number, required: true },
    mail: { type: String, required: false },
    postCode: { type: Number, required: false },
    role: { type: String, default: 'client' }
});

export const Client = model<IClient>('Client', clientSchema);