import NewFarmerDto from "../dto/NewFarmerDto";
import FarmerDto from "../dto/FarmerDto";
import SurprizeBackToSchema from "../dto/SurprizeBackTo";

export default interface FarmerService {

    registerFarmer(farmerRegDto: NewFarmerDto): Promise<FarmerDto>;

    loginFarmer(login: string, password: string): Promise<string>;

    removeFarmerByLogin(login: string): Promise<FarmerDto>;

    updateFarmer(login: string, firstName: string, lastName: string, address: string, phone: number,
                 mail: string, postCode: number, products: string[]): Promise<FarmerDto>;

    addSB(login: string, quantity: string, product: string): Promise<FarmerDto>;
}