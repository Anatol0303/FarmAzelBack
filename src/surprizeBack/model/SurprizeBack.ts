import { Document, Schema, model } from 'mongoose';


export interface ISurprizeBack extends Document {
    loginFarmer: string;
    description: string;
    product: string;
    loginClient: string;
    nameSB: string
}

const surprizeBackSchema = new Schema<ISurprizeBack>({
    loginFarmer: { type: String, required: true },
    description: { type: String, required: true },
    product: { type: String, required: true },
    loginClient: { type: String, required: false  },
    nameSB: { type: String, required: true },
});

export const SurprizeBack = model<ISurprizeBack>('surprizeBack', surprizeBackSchema);