
import { Schema } from 'mongoose';

export default interface SurprizeBackTo {
    quantity: number;
    product: string;
}

export const SurprizeBackToSchema = new Schema<SurprizeBackTo>({
    quantity: { type: Number, required: true },
    product: { type: String, required: true },
});


