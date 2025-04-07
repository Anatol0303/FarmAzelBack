import FarmerService from "./FarmerService";
import NewFarmerDto from "../dto/NewFarmerDto";
import FarmerDto from "../dto/FarmerDto";
import {Farmer} from "../model/Farmer";
import {ForbiddenError, NotFoundError} from "routing-controllers";
import {encodeBase64} from "../utils/utilsForPassword";
import jwt from "jsonwebtoken";
import SurprizeBackToSchema from "../dto/SurprizeBackTo";
import SurprizeBackTo from "../dto/SurprizeBackTo";
export default class FarmerServiceImpl implements FarmerService {

    async registerFarmer(newFarmerDto: NewFarmerDto):Promise<FarmerDto>  {
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
        return new FarmerDto(res.login, res.firstName, res.lastName, res.address,
            res.phone, res.mail, res.postCode, res.products, res.surprizeBacks);
    }

    async loginFarmer(login: string, password: string): Promise<string> {
        const farmer = await Farmer.findOne({login: login});
        if (farmer === null) {
            throw new ForbiddenError (`Farmer with login ${login} not found`);
        }
        const pass = farmer.password;
        const encodePass = encodeBase64(password);
        if (pass !== encodePass) {
            throw new ForbiddenError(`Password not valid`);
        }
        return jwt.sign({login: farmer.login, firstName: farmer.firstName}, '' + process.env.JWT_SECRET
            , {expiresIn: process.env.EXPIRED_TIME as any});
    }

    async removeFarmerByLogin(login: string): Promise<FarmerDto> {

        const farmer = await Farmer.findOne({login: login});
        if (farmer === null) {
            throw new NotFoundError(`Farmer with login ${login} not found`);
        }
        await farmer.deleteOne();
        return new FarmerDto(farmer.login,farmer.firstName, farmer.lastName, farmer.address,
            farmer.phone, farmer.mail, farmer.postCode, farmer.products, farmer.surprizeBacks);
    }

    async updateFarmer(login: string, firstName: string, lastName: string, address: string, phone: number,
                       mail: string, postCode: number, products: string[]): Promise<FarmerDto> {
        const farmer = await Farmer.findOneAndUpdate({login: login}, {
            $set: {
                firstName: firstName, lastName: lastName, address: address, phone: phone,
                mail: mail, postCode: postCode, products: products
            }
        }, {new: true});
        if (farmer === null) {
            throw new NotFoundError(`Farmer with login ${login} not found`);
        }
        return new FarmerDto(farmer.login, farmer.firstName, farmer.lastName,
            farmer.address, farmer.phone, farmer.mail, farmer.postCode, farmer.products,farmer.surprizeBacks);
    }

    async addSB(login: string, quantity: string, product: string): Promise<FarmerDto> {
        const farmer = await Farmer.findOneAndUpdate({login: login}, {
            $push:{
                surprizeBacks: {
                    quantity: +quantity,
                    product: product
                }
        }}, {new: true}).lean();

        if (farmer === null) {
            throw new NotFoundError(`Farmer with login ${login} not found`);
        }

        return new FarmerDto(farmer.login, farmer.firstName, farmer.lastName,
            farmer.address, farmer.phone, farmer.mail, farmer.postCode, farmer.products, farmer.surprizeBacks
                );
    }

}