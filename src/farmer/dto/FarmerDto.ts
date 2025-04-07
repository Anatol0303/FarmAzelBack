import SurprizeBackTo from "./SurprizeBackTo"

export default class FarmerDto {
    private _login:string;
    private _firstName:string;
    private _lastName:string;
    private _address:string;
    private _phone:number;
    private _mail:string;
    private _postCode:number;
    private _products:string[];
    private _surprizeBacks: SurprizeBackTo[];

    constructor(login: string, firstName: string, lastName: string, address: string, phone: number, mail: string, postCode: number, products: string[], surprizeBacks:SurprizeBackTo[]) {
        this._login = login;
        this._firstName = firstName;
        this._lastName = lastName;
        this._address = address;
        this._phone = phone;
        this._mail = mail;
        this._postCode = postCode;
        this._products = products;
        this._surprizeBacks = surprizeBacks;
    }


    get login(): string {
        return this._login;
    }

    set login(value: string) {
        this._login = value;
    }

    get firstName(): string {
        return this._firstName;
    }

    set firstName(value: string) {
        this._firstName = value;
    }

    get lastName(): string {
        return this._lastName;
    }

    set lastName(value: string) {
        this._lastName = value;
    }

    get address(): string {
        return this._address;
    }

    set address(value: string) {
        this._address = value;
    }

    get phone(): number {
        return this._phone;
    }

    set phone(value: number) {
        this._phone = value;
    }

    get mail(): string {
        return this._mail;
    }

    set mail(value: string) {
        this._mail = value;
    }

    get postCode(): number {
        return this._postCode;
    }

    set postCode(value: number) {
        this._postCode = value;
    }

    get products(): string[] {
        return this._products;
    }

    set products(value: string[]) {
        this._products = value;
    }

    get surprizeBacks(): SurprizeBackTo[] {
        return this._surprizeBacks;
    }

    set surprizeBacks(value: SurprizeBackTo[]) {
        this._surprizeBacks = value;
    }
}