
//import { Schema } from 'mongoose';

export default class SurprizeBackTo {
    private _loginFarmer: string;
    private _description: string;
    private _product: string;
    private _loginClient: string;
    private _nameSB: string;


    constructor(loginFarmer: string, description: string, product: string, loginClient: string, nameSB: string) {
        this._loginFarmer = loginFarmer;
        this._description = description;
        this._product = product;
        this._loginClient = loginClient;
        this._nameSB = nameSB;
    }


    get loginFarmer(): string {
        return this._loginFarmer;
    }

    set loginFarmer(value: string) {
        this._loginFarmer = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get product(): string {
        return this._product;
    }

    set product(value: string) {
        this._product = value;
    }

    get loginClient(): string {
        return this._loginClient;
    }

    set loginClient(value: string) {
        this._loginClient = value;
    }

    get nameSB(): string {
        return this._nameSB;
    }

    set nameSB(value: string) {
        this._nameSB = value;
    }
}







// export const SurprizeBackToSchema = new Schema<SurprizeBackTo>({
//     login: { type: String, required: true },
//     quantity: { type: Number, required: true },
//     product: { type: String, required: true },
//     ordered: { type: Boolean, required: true},
//     client: {type: {}, required: false},
//     IdSB: { type: String, required: true}
// });


