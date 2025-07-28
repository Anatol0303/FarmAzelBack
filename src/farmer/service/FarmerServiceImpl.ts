import FarmerService from "./FarmerService";
import NewFarmerDto from "../dto/NewFarmerDto";
import FarmerDto from "../dto/FarmerDto";
import {Farmer} from "../model/Farmer";
import {ForbiddenError, HttpError} from "routing-controllers";
import {encodeBase64} from "../../utils/utilsForPassword";
import jwt from "jsonwebtoken";
import {SurprizeBack} from "../../surprizeBack/model/SurprizeBack";
import SurprizeBackToSchema from "../../surprizeBack/dto/SurprizeBackTo";
import SurprizeBackTo from "../../surprizeBack/dto/SurprizeBackTo";
import ClientDto from "../../client/dto/ClientDto";
import {Client} from "../../client/model/Client";
import { NotFoundError, BadRequestError } from 'routing-controllers';

export default class FarmerServiceImpl implements FarmerService {

        async registerFarmer(newFarmerDto: NewFarmerDto): Promise<string> {
        let encodePass = encodeBase64(newFarmerDto.password);
        const newFarmer = new Farmer({
            ...newFarmerDto,
            password: encodePass
        });
        const checkFarmer = await Farmer.findOne({login: newFarmer.login});
        if (checkFarmer) {
            throw new Error(`User with login ${newFarmer.login} already exists`);
        }
        const res = await newFarmer.save();

        return jwt.sign({login: newFarmer.login, role: newFarmer.role}, '' + process.env.JWT_SECRET
            , {expiresIn: process.env.EXPIRED_TIME as any});

    }

    async loginFarmer(login: string, password: string): Promise<string> {
        const farmer = await Farmer.findOne({login: login});
        if (farmer === null) {
            throw new ForbiddenError(`Farmer with login ${login} not found`);
        }
        const pass = farmer.password;
        const encodePass = encodeBase64(password);
        if (pass !== encodePass) {
            throw new ForbiddenError(`Password not valid`);
        }
        return jwt.sign({login: farmer.login, role: farmer.role}, '' + process.env.JWT_SECRET
            , {expiresIn: process.env.EXPIRED_TIME as any});
    }

    async removeFarmerByLogin(login: string): Promise<FarmerDto> {

        const farmer = await Farmer.findOne({login: login});
        if (farmer === null) {
            throw new NotFoundError(`Farmer with login ${login} not found`);
        }

        await farmer.deleteOne();
        return new FarmerDto(farmer.login, farmer.firstName, farmer.lastName, farmer.address,
            farmer.phone, farmer.mail, farmer.postCode, farmer.role);
    }

    async updateFarmer(login: string, firstName: string, lastName: string, address: string, phone: number,
                       mail: string, postCode: number): Promise<FarmerDto> {
        const farmer = await Farmer.findOneAndUpdate({login: login}, {
            $set: {
                firstName: firstName, lastName: lastName, address: address, phone: phone,
                mail: mail, postCode: postCode
            }
        }, {new: true});

        return new FarmerDto(farmer!.login, farmer!.firstName, farmer!.lastName,
            farmer!.address, farmer!.phone, farmer!.mail, farmer!.postCode, farmer!.role);
    }

    async addSB(login: string, description: string, product: string, nameSB: string): Promise<SurprizeBackTo> {
        const findsurprizeBack = await SurprizeBack.findOne({loginFarmer: login, nameSB: nameSB});
        if (findsurprizeBack) throw new Error(`Your surprizeBack with nameSB = ${nameSB} already exists`);

        const surprizeBack = new SurprizeBack({
            loginFarmer: login,
            description: description,
            product: product,
            loginClient: "None",
            nameSB: nameSB
        });

        const res = await surprizeBack.save();


        return new SurprizeBackTo(res.loginFarmer, res.description, res.product,
            res.loginClient, res.nameSB);
    }

    async delSB(login: string, nameSB: string): Promise<SurprizeBackTo> {

        const findsurprizeBack = await SurprizeBack.findOne({loginFarmer: login, nameSB: nameSB});
        if (!findsurprizeBack) throw new Error(`Your surprizeBack with nameSB = ${nameSB} does not exist`);

        if (findsurprizeBack.loginClient !== "None") throw new Error('Cannot delete ORDERED surprizeBack');
        const surprizeBack = await SurprizeBack.deleteOne({loginFarmer: login, nameSB: nameSB})

        return new SurprizeBackTo(findsurprizeBack.loginFarmer, findsurprizeBack.description, findsurprizeBack.product,
            findsurprizeBack.loginClient, findsurprizeBack.nameSB);
    }

    async updateSB(login: string, description: string, product: string, nameSB: string): Promise<SurprizeBackTo> {
        const findsurprizeBack = await SurprizeBack.findOne({ loginFarmer: login, nameSB });
        if (!findsurprizeBack) throw new NotFoundError(`You do not have surprizeBack with name ${nameSB} `);

        if (findsurprizeBack.loginClient !== 'None')
            throw new BadRequestError('Cannot update ORDERED surprizeBack');

        const updatedSurprizeBack = await SurprizeBack.findOneAndUpdate(
            { loginFarmer: login, nameSB },
            { $set: { description, product, nameSB } },
            { new: true }
        );

        return new SurprizeBackTo(
            updatedSurprizeBack!.loginFarmer,
            updatedSurprizeBack!.description,
            updatedSurprizeBack!.product,
            updatedSurprizeBack!.loginClient,
            updatedSurprizeBack!.nameSB
        );
    }

    async InfOrdersSB(login: string): Promise<SurprizeBackTo[]> {

        const ordered = await SurprizeBack.find({loginFarmer:login,
            loginClient: {$ne:"None"}});
        if (ordered.length === 0) throw new Error('No ordered surprizebacks');

        return ordered.map(surprizeback => {return new SurprizeBackTo(
            surprizeback.loginFarmer, surprizeback.description,
        surprizeback.product, surprizeback.loginClient, surprizeback.nameSB)});
    }



    async DelOrdersSB(login: string, nameSB: string): Promise<SurprizeBackTo> {

        const findsurprizeBack = await SurprizeBack.findOne({loginFarmer: login, nameSB: nameSB});
        if (!findsurprizeBack) throw new Error(`Your surprizeBack with nameSB = ${nameSB} does not exist`);

        if (findsurprizeBack.loginClient === "None") throw new Error('This surprizeBack is NOT ORDERED');
        const unorderedSurprizeBack = await SurprizeBack.findOneAndUpdate({loginFarmer: login, nameSB: nameSB}, {
            $set: {
                loginClient: "None"
            }
        }, {new: true});

        return new SurprizeBackTo(unorderedSurprizeBack!.loginFarmer, unorderedSurprizeBack!.description, unorderedSurprizeBack!.product,
            unorderedSurprizeBack!.loginClient, unorderedSurprizeBack!.nameSB);


    }

    async updateFarmerPassword(login: string, newPassword: string): Promise<FarmerDto> {
        const passToUpdate = await Farmer.findOneAndUpdate(
            {login: login},
            {password:encodeBase64(newPassword)},
            {new: true});
        return new FarmerDto(passToUpdate!.login, passToUpdate!.firstName, passToUpdate!.lastName, passToUpdate!.address,
            passToUpdate!.phone, passToUpdate!.mail, passToUpdate!.postCode, passToUpdate!.role);
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

    async InfAllProducts(): Promise<String[]> {
        const SurprizeBacks = await SurprizeBack.find();
        if (SurprizeBacks.length === 0) throw new Error('ERROR! Still no surprizebacks in this application ');
        const products: string[] = [];
        SurprizeBacks.forEach(surprizeback => {
            if (surprizeback.product && !products.includes(surprizeback.product)) products.push(surprizeback.product)
        })
        return products;
    }

    async InfSurprizeBacksByFarmer(loginFarmer: string): Promise<SurprizeBackTo[]> {
        const farmer = await Farmer.findOne({login: loginFarmer});
        if (farmer === null) {
            throw new Error(`Farmer with login ${loginFarmer} not found`);
        }

        const SurprizeBacksByFarmer = await SurprizeBack.find({
            loginFarmer: loginFarmer
        });
        if (SurprizeBacksByFarmer.length === 0) throw new Error('No surprizebacks by farmer you are looking for');
        return SurprizeBacksByFarmer.map(surprizeback => {
            return new SurprizeBackTo(
                surprizeback!.loginFarmer, surprizeback!.description,
                surprizeback!.product, surprizeback!.loginClient, surprizeback!.nameSB)
        });
    }


    async InfFarmersByProduct(product: string): Promise<String[]> {
        const SurprizeBacksByProduct = await SurprizeBack.find({
            product: product
        });
        if (SurprizeBacksByProduct.length === 0) throw new Error('No farmers with product you are looking for');
        const farmers: string[] = [];
        SurprizeBacksByProduct.forEach(surprizeback => {
            if (surprizeback.loginFarmer &&
                !farmers.includes(surprizeback.loginFarmer)) farmers.push(surprizeback.loginFarmer)
        });
        return farmers;
    }

    async infSBByNameSB(login: string, nameSB:string):Promise<SurprizeBackTo> {

        const surprizeback = await SurprizeBack.findOne({loginFarmer: login,nameSB: nameSB});
        if (surprizeback === null) {
            throw new Error(`You don't have surprizeBack with name ${nameSB}`);

        }

        return new SurprizeBackTo(surprizeback.loginFarmer, surprizeback.description, surprizeback.product, surprizeback.loginClient,
            surprizeback.nameSB);
    }
    

}
