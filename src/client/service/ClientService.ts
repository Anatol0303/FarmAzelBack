import NewClientDto from "../dto/NewClientDto";
import ClientDto from "../dto/ClientDto";
import SurprizeBackToSchema from "../../surprizeBack/dto/SurprizeBackTo";
import SurprizeBackTo from "../../surprizeBack/dto/SurprizeBackTo";
import FarmerDto from "../../farmer/dto/FarmerDto";

export default interface ClientService {

    registerClient(сlientRegDto: NewClientDto): Promise<ClientDto>;

    loginClient(login: string, password: string): Promise<string>;

    removeClientByLogin(login: string): Promise<ClientDto>;

    updateClient(login: string, firstName: string, lastName: string, address: string, phone: number,
                 mail: string, postCode: number): Promise<ClientDto>;

    InfSurprizeBacksByProduct(product:string):Promise<SurprizeBackTo[]>;

    createOrderSB(login: string, nameSB: string): Promise<SurprizeBackTo>;

    removeOrderSB(login: string, nameSB: string): Promise<SurprizeBackTo>;

    InfSurprizeBacksByFarmer(loginFarmer: string): Promise<SurprizeBackTo[]>;

    InfAllProducts(): Promise<String[]>;

    InfFarmersByProduct(product: string): Promise<String[]>

    InfMyOrderedSurprizeBacks(login: string): Promise<SurprizeBackTo[]>;

    updateClientPassword(login: string, password:string): Promise<ClientDto>;

}