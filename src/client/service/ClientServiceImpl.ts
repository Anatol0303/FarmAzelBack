import ClientService from "./ClientService";
import NewClientDto from "../dto/NewClientDto";
import ClientDto from "../dto/ClientDto";
import {Client} from "../model/Client";
import {ForbiddenError, NotFoundError} from "routing-controllers";
import {encodeBase64} from "../../utils/utilsForPassword";
import jwt from "jsonwebtoken";
import SurprizeBackTo from "../../surprizeBack/dto/SurprizeBackTo";
import {Farmer} from "../../farmer/model/Farmer";
import {SurprizeBack} from "../../surprizeBack/model/SurprizeBack";
import FarmerDto from "../../farmer/dto/FarmerDto";
export default class ClientServiceImpl implements ClientService {

    async registerClient(newClientDto: NewClientDto): Promise<string> {
        let encodePass = encodeBase64(newClientDto.password);
        const newClient = new Client({
            ...newClientDto,
            password: encodePass
        });
        const checkClient = await Client.findOne({login: newClient.login});
        if (checkClient) {
            throw new Error(`User with login ${newClient.login} already exists`);
        }
        const res = await newClient.save();

        return jwt.sign({login: newClient.login, role: newClient.role}, '' + process.env.JWT_SECRET
            , {expiresIn: process.env.EXPIRED_TIME as any});
    }



    async loginClient(login: string, password: string): Promise<string> {
        const client = await Client.findOne({login: login});
        if (client === null) {
            throw new Error(`Client with login ${login} not found`);
        }
        const pass = client.password;
        const encodePass = encodeBase64(password);
        if (pass !== encodePass) {
            throw new Error(`Password not valid`);
        }
        return jwt.sign({login: client.login, role: client.role}, '' + process.env.JWT_SECRET
            , {expiresIn: process.env.EXPIRED_TIME as any});
    }

    async removeClientByLogin(login: string): Promise<ClientDto> {

        const client = await Client.findOne({login: login});
        const findsurprizeBack = await SurprizeBack.updateMany(
            {loginClient: login},
            {$set: {loginClient: "None"}}
        );

        await client!.deleteOne();
        return new ClientDto(client!.login, client!.firstName, client!.lastName, client!.address,
            client!.phone, client!.mail, client!.postCode, client!.role);
    }

    async updateClient(login: string, firstName: string, lastName: string, address: string, phone: number,
                       mail: string, postCode: number): Promise<ClientDto> {
        const client = await Client.findOneAndUpdate({login: login}, {
            $set: {
                firstName: firstName, lastName: lastName, address: address, phone: phone,
                mail: mail, postCode: postCode
            }
        }, {new: true});

        return new ClientDto(client!.login, client!.firstName, client!.lastName,
            client!.address, client!.phone, client!.mail, client!.postCode, client!.role//, client.products,client.surprizeBacks
        );
    }

    async infClientByLogin(loginClient: string): Promise<ClientDto> {

        const client = await Client.findOne({login: loginClient});
        if (client === null) {
            throw new NotFoundError(`Client with login ${loginClient} not found`);
            //throw new Error(`Farmer with login ${loginFarmer} not found`);
        }

        return new ClientDto(client.login, client.firstName, client.lastName, client.address,
            client.phone, client.mail, client.postCode, client.role);
    } 
    
    
    
    async InfSurprizeBacksByProduct(product: string): Promise<SurprizeBackTo[]> {
        const SurprizeBacksByProduct = await SurprizeBack.find({
            product: product
        });
        if (SurprizeBacksByProduct.length === 0) throw new Error('ERROR! No surprizebacks with product you are looking for');
        return SurprizeBacksByProduct.map(surprizeback => {
            return new SurprizeBackTo(
                surprizeback!.loginFarmer, surprizeback!.description,
                surprizeback!.product, surprizeback!.loginClient, surprizeback!.nameSB)
        });
    }

    async createOrderSB(login: string, nameSB: string, loginFarmer: string): Promise<SurprizeBackTo> {
        const SurprizeBackToOrder = await SurprizeBack.findOne({
            nameSB: nameSB, loginFarmer: loginFarmer
        });
        if (!SurprizeBackToOrder) throw new Error('ERROR! No surprizeback you want to order');
        if (SurprizeBackToOrder.loginClient !== "None") throw new Error('ORDER IS IMPOSSIBLE! This surprizeback have been ordered already');

        const orderedSurprizeBack = await SurprizeBack.findOneAndUpdate({nameSB: nameSB, loginFarmer: loginFarmer}, {
            $set: {
                loginClient: login
            }
        }, {new: true});
        return new SurprizeBackTo(orderedSurprizeBack!.loginFarmer, orderedSurprizeBack!.description, orderedSurprizeBack!.product,
            orderedSurprizeBack!.loginClient, orderedSurprizeBack!.nameSB);
    }

    async removeOrderSB(login: string, nameSB: string, loginFarmer: string): Promise<SurprizeBackTo> {
        const SurprizeBackToRemoveOrder = await SurprizeBack.findOne({
            loginClient: login, nameSB: nameSB, loginFarmer: loginFarmer
        });
        if (!SurprizeBackToRemoveOrder) throw new Error('ERROR! This surprizeback does not exist or exists, but not ordered or ordered not by you');
        const removeOrderedSurprizeBack = await SurprizeBack.findOneAndUpdate({nameSB: nameSB, loginFarmer: loginFarmer}, {
            $set: {
                loginClient: "None"
            }
        }, {new: true});
        return new SurprizeBackTo(removeOrderedSurprizeBack!.loginFarmer, removeOrderedSurprizeBack!.description, removeOrderedSurprizeBack!.product,
            removeOrderedSurprizeBack!.loginClient, removeOrderedSurprizeBack!.nameSB);
    }

    async InfSurprizeBacksByFarmer(loginFarmer: string): Promise<SurprizeBackTo[]> {
        const farmer = await Farmer.findOne({login: loginFarmer});
        if (farmer === null) {
            throw new Error(`Farmer with login ${loginFarmer} not found`);
        }

        const SurprizeBacksByFarmer = await SurprizeBack.find({
            loginFarmer: loginFarmer
        });
        if (SurprizeBacksByFarmer.length === 0) throw new Error('ERROR! No surprizebacks by farmer you are looking for');
        return SurprizeBacksByFarmer.map(surprizeback => {
            return new SurprizeBackTo(
                surprizeback!.loginFarmer, surprizeback!.description,
                surprizeback!.product, surprizeback!.loginClient, surprizeback!.nameSB)
        });
    }

    async infFarmerByLogin(loginFarmer: string): Promise<FarmerDto> {

        const farmer = await Farmer.findOne({login: loginFarmer});
        if (farmer === null) {
            throw new NotFoundError(`Farmer with login ${loginFarmer} not found`);
            //throw new Error(`Farmer with login ${loginFarmer} not found`);
        }

        return new FarmerDto(farmer.login, farmer.firstName, farmer.lastName, farmer.address,
            farmer.phone, farmer.mail, farmer.postCode, farmer.role);
    }


    async InfAllProducts(): Promise<String[]> {
        const SurprizeBacks = await SurprizeBack.find();
        if (SurprizeBacks.length === 0) throw new Error('ERROR! Still no surprizebacks in this application ');
        const products: string[] = [];
        SurprizeBacks.forEach(surprizeback => {
            if (surprizeback.product && !products.includes(surprizeback.product)) products.push(surprizeback.product)
        })
        return products;
    }

    async infAllFarmers(): Promise<FarmerDto[]> {
        const farmersByFormatDataBase = await Farmer.find();
        if (farmersByFormatDataBase.length === 0) throw new Error('ERROR! Still no farmers registrated in this application');
        const farmersByFormatUsual:FarmerDto[] = [];
        return farmersByFormatDataBase.map(farmer => {
            return new FarmerDto(
                farmer.login, farmer.firstName, farmer.lastName, farmer.address,
                farmer.phone, farmer.mail, farmer.postCode, farmer.role)
        });
    }




    async InfFarmersByProduct(product: string): Promise<String[]> {
        const SurprizeBacksByProduct = await SurprizeBack.find({
            product: product
        });
        if (SurprizeBacksByProduct.length === 0) throw new Error('ERROR! No farmers with product you are looking for');
        const farmers: string[] = [];
        SurprizeBacksByProduct.forEach(surprizeback => {
            if (surprizeback.loginFarmer &&
                !farmers.includes(surprizeback.loginFarmer)) farmers.push(surprizeback.loginFarmer)
        });
        return farmers;

    }

    async InfMyOrderedSurprizeBacks(login: string): Promise<SurprizeBackTo[]> {
        const MyOrderedSurprizeBacks = await SurprizeBack.find({
            loginClient: login
        });
        if (MyOrderedSurprizeBacks.length === 0) throw new Error('ERROR! You have not  ordered any surprizebacks' );
        return MyOrderedSurprizeBacks.map(surprizeback => {
            return new SurprizeBackTo(
                surprizeback!.loginFarmer, surprizeback!.description,
                surprizeback!.product, surprizeback!.loginClient, surprizeback!.nameSB)
        });

    }

    async updateClientPassword(login: string, newPassword: string): Promise<ClientDto> {
        const passToUpdate = await Client.findOneAndUpdate(
            {login: login},
            {password:encodeBase64(newPassword)},
            {new: true});
        return new ClientDto(passToUpdate!.login, passToUpdate!.firstName, passToUpdate!.lastName, passToUpdate!.address,
            passToUpdate!.phone, passToUpdate!.mail, passToUpdate!.postCode, passToUpdate!.role);
    }

}