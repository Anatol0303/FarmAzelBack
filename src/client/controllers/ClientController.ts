import {
    Body,
    Controller,
    Delete,
    ForbiddenError,
    Get,
    Param,
    Post,
    Put,
    Req,
    Res,
    UseBefore
} from "routing-controllers";
import ClientService from "../service/ClientService";
import ClientServiceImpl from "../service/ClientServiceImpl";
import {Request, Response} from 'express';
import {AuthenticationMiddleware} from "../../farmer/Middleware/AuthenticationMiddleware";
//import {AuthorizationMiddleware} from "../Middleware/AuthorizationMiddleware";
import NewClientDto from "../dto/NewClientDto";
import {encodeBase64} from "../../utils/utilsForPassword";
import {Client} from "../model/Client";
import ClientDto from "../dto/ClientDto";



@Controller('/apifarm')
export default class ClientController {

    clientService: ClientService = new ClientServiceImpl();

    @Post("/registerClient")
    registerClient(@Body()newClientDto: NewClientDto) {
        return this.clientService.registerClient(newClientDto);
    }

    @Post("/loginClient")
    async loginClient(@Body() loginClientDto: { login: string, password: string }, @Res() res: Response) {
        try {
            const token = await this.clientService.loginClient(loginClientDto.login, loginClientDto.password);
            return res.json({ token });
        } catch (err: any) {
            return res.status(403).send({ error: err.message });
        }
    }

    @UseBefore(AuthenticationMiddleware)
    @Delete('/deleteClient')
    async removeClientByLogin(
                              @Req() req: Request,
                              @Res() res: Response) {
        const login = req.body.user.login;

        return await this.clientService.removeClientByLogin(login).catch((err: any) => res.status(404).send(err));
    }

    @UseBefore(AuthenticationMiddleware)
    @Put('/updateClient')
    async updateClient(@Body() updateClientDto: NewClientDto, @Res() res: Response, @Req() req: Request) {
        const login = req.body.user.login;
        return await this.clientService.updateClient(login, updateClientDto.firstName,updateClientDto.lastName,
            updateClientDto.address, updateClientDto.phone, updateClientDto.mail,updateClientDto.postCode)
            .catch((err: any) => res.status(404).send(err));
    }

    @UseBefore(AuthenticationMiddleware)
    @Get('/InfSurprizeBacksByProduct/:product')
    async InfSBbyProduct(
        @Param('product') product: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        return await this.clientService.InfSurprizeBacksByProduct(product);
    }

    @UseBefore(AuthenticationMiddleware)
    @Put('/createOrderSB/:nameSB')
    async createOrderSB(
        @Param('nameSB') nameSB: string,
        @Req() req: Request,
        @Res() res: Response,
    )
    {
        const login = req.body.user.login;
        return await this.clientService.createOrderSB(login,nameSB);
    }

    @UseBefore(AuthenticationMiddleware)
    @Put('/removeOrderSB/:nameSB')
    async removeOrderSB(
        @Param('nameSB') nameSB: string,
        @Req() req: Request,
        @Res() res: Response,
    )
    {
        const login = req.body.user.login;
        return await this.clientService.removeOrderSB(login, nameSB);
    }

    @UseBefore(AuthenticationMiddleware)
    @Get('/InfSurprizeBacksByFarmer/:loginFarmer')
    async InfSBbyFarmer(
        @Param('loginFarmer') loginFarmer: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        return await this.clientService.InfSurprizeBacksByFarmer(loginFarmer);
    }

@UseBefore(AuthenticationMiddleware)
@Get('/InfAllProducts')
async InfAllProducts(
    @Req() req: Request,
    @Res() res: Response,
) {
    return await this.clientService.InfAllProducts();
}

    @UseBefore(AuthenticationMiddleware)
    @Get('/InfFarmersByProductToClient/:product')
    async InfFarmersByProduct(
        @Param('product') product: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        return await this.clientService.InfFarmersByProduct(product);
    }

    @UseBefore(AuthenticationMiddleware)
    @Get('/InfMyOrderedSurprizeBacks')
    async InfMyOrderedSurprizeBacks(
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const login = req.body.user.login;
        return await this.clientService.InfMyOrderedSurprizeBacks(login);
    }

    @UseBefore(AuthenticationMiddleware)
    @Put('/updateClientPassword')
    async updateClientPassword(
        @Body() body: {password: string},
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const login = req.body.user.login;
        const newPassword = body.password
        return await this.clientService.updateClientPassword(login, newPassword);
    }




}