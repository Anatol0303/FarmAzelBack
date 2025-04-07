import SurprizeBackTo from "./SurprizeBackTo"

export default interface NewFarmerDto {
    login:string;
    password:string;
    firstName:string;
    lastName:string;
    address:string;
    phone:number;
    mail:string;
    postCode:number;
    products:string[];
    surprizeBacks: SurprizeBackTo[];
}