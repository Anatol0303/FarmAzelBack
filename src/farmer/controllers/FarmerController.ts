import {
    Body,
    Controller,
    Delete,
    ForbiddenError,
    Get, NotFoundError,
    Param,
    Post,
    Put,
    Req,
    Res,
    UseBefore
} from "routing-controllers";
import FarmerService from "../service/FarmerService";
import FarmerServiceImpl from "../service/FarmerServiceImpl";
import {Response, Request} from 'express';
import {AuthenticationMiddleware} from "../Middleware/AuthenticationMiddleware";
//import {AuthorizationMiddleware} from "../Middleware/AuthorizationMiddleware";
import NewFarmerDto from "../dto/NewFarmerDto";
import {encodeBase64} from "../../utils/utilsForPassword";
import {Farmer} from "../model/Farmer";
import FarmerDto from "../dto/FarmerDto";
import SurprizeBackToSchema from "../../surprizeBack/dto/SurprizeBackTo";



@Controller('/apifarm')
export default class FarmerController {

    farmService: FarmerService = new FarmerServiceImpl();

    @Post("/registerFarmer")
    registerFarmer(@Body() newFarmerDto: NewFarmerDto) {
        return this.farmService.registerFarmer(newFarmerDto);
    }

    @Post("/loginFarmer")
    async loginFarmer(@Body() loginFarmerDto: { login: string, password: string }, @Res() res: Response) {
        const token = await this.farmService.loginFarmer(loginFarmerDto.login, loginFarmerDto.password)
            .catch((err: any) => res.send(err));
        return res.json({token});
    }

    @UseBefore(AuthenticationMiddleware)
    @Delete('/removeFarmer')
    async removeFarmerByLogin(@Req() req: Request,
                              @Res() res: Response) {
        const login = req.body.user.login;
        return await this.farmService.removeFarmerByLogin(login).catch((err: any) => res.status(404).send(err));
    }

    @UseBefore(AuthenticationMiddleware)
    @Put('/updateFarmer')
    async updateFarmer(@Body() updateFarmerDto: NewFarmerDto,
                       @Req() req: Request,
                       @Res() res: Response) {
        const login = req.body.user.login;
        return await this.farmService.updateFarmer(login, updateFarmerDto.firstName, updateFarmerDto.lastName,
            updateFarmerDto.address, updateFarmerDto.phone, updateFarmerDto.mail, updateFarmerDto.postCode)
            .catch((err: any) => res.status(404).send(err));
    }

    @UseBefore(AuthenticationMiddleware)
    @Post('/addSurprizeBack')
    async addSB(
        @Body() body: { description: string; product: string, nameSB: string },
        @Res() res: Response,
        @Req() req: Request
    ) {
        const login = req.body.user.login;
        const {description, product, nameSB} = body;
        return await this.farmService.addSB(login, description, product, nameSB);
    }

    @UseBefore(AuthenticationMiddleware)
    @Delete('/removeSurprizeBack/:nameSB')
    async delSB(
        @Param('nameSB') nameSB: string,
        @Req() req: Request,
        @Res() res: Response,
        // @Body() body: {IdSB: string}
    ) {
        const login = req.body.user.login;

        return await this.farmService.delSB(login, nameSB);
    }

    @UseBefore(AuthenticationMiddleware)
    @Put('/updateSurprizeBack/:nameSB')
    async updateSB(
        @Param('nameSB') nameSB: string,
        @Req() req: Request,
        @Res() res: Response,
        @Body() body: { description: string; product: string }
    ) {
        const login = req.body.user.login;
        const {description, product} = body;
        return await this.farmService.updateSB(login, description, product, nameSB);
    }

    @UseBefore(AuthenticationMiddleware)
    @Get('/InfOrdersSB')
    async InfOrdersSB(
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const login = req.body.user.login;
        return await this.farmService.InfOrdersSB(login);
    }

    @UseBefore(AuthenticationMiddleware)
    @Put('/updateFarmerPassword')
    async updateFarmerPassword(
        @Body() body: { password: string },
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const login = req.body.user.login;
        const newPassword = body.password
        return await this.farmService.updateFarmerPassword(login, newPassword);
    }

    @UseBefore(AuthenticationMiddleware)
    @Get('/infFarmerByLogin/:loginFarmer')
    async infFarmerByLogin(@Param('loginFarmer') loginFarmer: string,
                           @Req() req: Request,
                           @Res() res: Response) {
        //const login = req.body.user.login;
        return await this.farmService.infFarmerByLogin(loginFarmer).catch((err: any) => res.status(404).send(err));
    }

    @UseBefore(AuthenticationMiddleware)
    @Get('/infAllFarmers')
    async infAllFarmers(
        @Req() req: Request,
        @Res() res: Response) {
        //const login = req.body.user.login;
        return await this.farmService.infAllFarmers().catch((err: any) => res.status(404).send(err));

    }

    @UseBefore(AuthenticationMiddleware)
    @Get('/InfFarmersByProductToFarmer/:product')
    async InfFarmersByProduct(
        @Param('product') product: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        return await this.farmService.InfFarmersByProduct(product);
    }
}