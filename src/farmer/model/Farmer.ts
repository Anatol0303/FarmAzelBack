import { Document, Schema, model } from 'mongoose';
import SurprizeBackTo, { SurprizeBackToSchema } from '../dto/SurprizeBackTo';

export interface IFarmer extends Document {
    login: string;
    password: string;
    firstName: string;
    lastName: string;
    address: string;
    phone: number;
    mail: string;
    postCode: number;
    products: string[];
    surprizeBacks: SurprizeBackTo[]; // Используйте интерфейс INewSurprizeBackTo здесь
}

const farmerSchema = new Schema<IFarmer>({
    login: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: false },
    phone: { type: Number, required: true },
    mail: { type: String, required: false },
    postCode: { type: Number, required: false },
    products: { type: [String], required: false },
    surprizeBacks: { type: [SurprizeBackToSchema], required: false }
});

export const Farmer = model<IFarmer>('Farmer', farmerSchema);
