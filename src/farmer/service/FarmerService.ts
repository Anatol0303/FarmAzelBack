import NewFarmerDto from "../dto/NewFarmerDto";
import FarmerDto from "../dto/FarmerDto";
import SurprizeBackToSchema from "../../surprizeBack/dto/SurprizeBackTo";
import SurprizeBackTo from "../../surprizeBack/dto/SurprizeBackTo";
import {SurprizeBack} from "../../surprizeBack/model/SurprizeBack";
import ClientDto from "../../client/dto/ClientDto";
export default interface FarmerService {

    //registerFarmer(farmerRegDto: NewFarmerDto): Promise<FarmerDto>;
    registerFarmer(farmerRegDto: NewFarmerDto): Promise<string>;
    
    loginFarmer(login: string, password: string): Promise<string>;

    removeFarmerByLogin(login: string): Promise<FarmerDto>;

    updateFarmer(login: string, firstName: string, lastName: string, address: string, phone: number,
                 mail: string, postCode: number): Promise<FarmerDto>;

    addSB(login: string, description: string, product: string, nameSB: string): Promise<SurprizeBackTo>;

    delSB(login: string, nameSB: string): Promise<SurprizeBackTo>;

    updateSB(login: string, description: string, product: string, nameSB: string): Promise<SurprizeBackTo>;

    InfOrdersSB(login: string): Promise<SurprizeBackTo[]>;

    updateFarmerPassword(login: string, password:string): Promise<FarmerDto>;

    infFarmerByLogin(loginFarmer: string): Promise<FarmerDto>;

    infAllFarmers(): Promise<FarmerDto[]>;

    InfAllProducts(): Promise<String[]>;

    InfFarmersByProduct(product: string): Promise<String[]>

    InfSurprizeBacksByFarmer(loginFarmer: string): Promise<SurprizeBackTo[]>;

    infSBByNameSB(login: string, nameSB:string): Promise<SurprizeBackTo>;

}