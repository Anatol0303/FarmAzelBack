
export default class ClientDto {
    private _login:string;
    private _firstName:string;
    private _lastName:string;
    private _address:string;
    private _phone:number;
    private _mail:string;
    private _postCode:number;
    private _role: string;

    constructor(login: string, firstName: string, lastName: string, address: string,
                phone: number, mail: string, postCode: number, role: string) {
        this._login = login;
        this._firstName = firstName;
        this._lastName = lastName;
        this._address = address;
        this._phone = phone;
        this._mail = mail;
        this._postCode = postCode;
        this._role = role;
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

    get role(): string {
        return this._role;
    }

    set role(value: string) {
        this._role = value;
    }
}