import {Body, Controller, Delete, Get, Param, Post, Put, Res, UseBefore} from "routing-controllers";
import FarmerService from "../service/FarmerService";
import FarmerServiceImpl from "../service/FarmerServiceImpl";
import {Response} from 'express';
import {AuthenticationMiddleware} from "../Middleware/AuthenticationMiddleware";
//import {AuthorizationMiddleware} from "../Middleware/AuthorizationMiddleware";
import NewFarmerDto from "../dto/NewFarmerDto";
import {encodeBase64} from "../utils/utilsForPassword";
import {Farmer} from "../model/Farmer";
import FarmerDto from "../dto/FarmerDto";
import SurprizeBackToSchema from "../dto/SurprizeBackTo";


@Controller('/apifarm')
export default class FarmerController {

    farmService: FarmerService = new FarmerServiceImpl();

    @Post("/registerFarmer")
    registerFarmer(@Body()newFarmerDto: NewFarmerDto) {
        return this.farmService.registerFarmer(newFarmerDto);
    }

    @Post("/loginFarmer")
    async loginFarmer(@Body() loginFarmerDto: { login: string, password: string }, @Res() res: Response) {
        const token =  await this.farmService.loginFarmer(loginFarmerDto.login, loginFarmerDto.password)
            .catch((err: any) => res.send(err));
        return res.json({token});
    }

    @UseBefore(AuthenticationMiddleware)
    @Delete('/farmer/:login')
    async removeFarmerByLogin(@Param('login') login: string, @Res() res: Response) {
        return await this.farmService.removeFarmerByLogin(login).catch((err: any) => res.status(404).send(err));
    }

   @UseBefore(AuthenticationMiddleware)
    @Put('/farmer/:login')
    async updateFarmer(@Param('login') login: string, @Body() updateFarmerDto: NewFarmerDto, @Res() res: Response) {
        return await this.farmService.updateFarmer(login, updateFarmerDto.firstName,updateFarmerDto.lastName,
            updateFarmerDto.address, updateFarmerDto.phone, updateFarmerDto.mail,updateFarmerDto.postCode,updateFarmerDto.products)
            .catch((err: any) => res.status(404).send(err));
    }

    @UseBefore(AuthenticationMiddleware)
    @Put('/surprizeBack/:login')
    async addSB(
        @Param('login') login: string,
        @Body() body: { quantity: string; product: string }
    ) {
        const { quantity, product } = body;
        return await this.farmService.addSB(login, quantity, product);
    }

}