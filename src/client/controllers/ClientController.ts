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
    UseBefore,
    BadRequestError
} from "routing-controllers";
import ClientService from "../service/ClientService";
import ClientServiceImpl from "../service/ClientServiceImpl";
import {Request, Response} from 'express';
import {AuthenticationMiddleware} from "../../farmer/Middleware/AuthenticationMiddleware";
//import {AuthorizationMiddleware} from "../Middleware/AuthorizationMiddleware";
import NewClientDto from "../dto/NewClientDto";

@Controller('/apifarm')
export default class ClientController {
    clientService: ClientService = new ClientServiceImpl();
    
    @Post("/registerClient")
    async registerClient(@Body() newClientDto: NewClientDto, @Res() res: Response) {
        const token = await this.clientService.registerClient(newClientDto).catch((err: any) => res.send(err));
        return res.json({ token });
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
    @Get("/infClientByLogin/:loginClient")
    async infClientByLogin(@Param("loginClient") loginClient: string, @Req() req: Request, @Res() res: Response) {
        return await this.clientService.infClientByLogin(loginClient).catch((err: any) => res.status(404).send(err));
    }

    @UseBefore(AuthenticationMiddleware)
    @Get("/infFarmerByLogin/:loginFarmer")
    async infFarmerByLogin(@Param("loginFarmer") loginFarmer: string, @Req() req: Request, @Res() res: Response) {
        return await this.clientService.infFarmerByLogin(loginFarmer).catch((err: any) => res.status(404).send(err));
    }


    @UseBefore(AuthenticationMiddleware)
    @Delete("/deleteClient")
    async removeClientByLogin(@Req() req: Request, @Res() res: Response) {
        if (!req.user?.login) throw new BadRequestError("Missing login in token");
        if (req.user?.role !== 'client') throw new ForbiddenError("You are not registrated as client. Operation is forbidden");
        try {
            await this.clientService.removeClientByLogin(req.user.login);
            res.status(200).send({ message: "Client successfully deleted" });
        } catch (err) {
            res.status(404).send(err);
        }
    }

    @UseBefore(AuthenticationMiddleware)
    @Put("/updateClient")
    async updateClient(@Body() updateClientDto: NewClientDto, @Req() req: Request, @Res() res: Response) {
        if (!req.user?.login) {
            throw new BadRequestError("Missing login in token");
        }
        if (req.user?.role !== 'client') {
            throw new ForbiddenError("You are not registered as client. Operation is forbidden");
        }
        return await this.clientService
            .updateClient(
                req.user.login,
                updateClientDto.firstName,
                updateClientDto.lastName,
                updateClientDto.address,
                updateClientDto.phone,
                updateClientDto.mail,
                updateClientDto.postCode
            )
            .catch((err: any) => res.status(404).send(err));
    }

    @UseBefore(AuthenticationMiddleware)
    @Get('/InfSurprizeBacksByProduct/:product')
    async InfSBbyProduct(
        @Param('product') product: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        if (!req.user?.login) {
            throw new BadRequestError("Missing login in token");
        }
        if (req.user?.role !== 'client') {
            throw new ForbiddenError("You are not registered as client. Operation is forbidden");
        }
        return await this.clientService.InfSurprizeBacksByProduct(product);
    }

    @UseBefore(AuthenticationMiddleware)
    @Put('/createOrderSB/:nameSB/:loginFarmer')
    async createOrderSB(
        @Param('nameSB') nameSB: string,
        @Param('loginFarmer') loginFarmer: string,
        @Req() req: Request,
        @Res() res: Response,
    )
    {

        if (!req.user?.login) {
            throw new BadRequestError("Missing login in token");
        }
        if (req.user?.role !== 'client') {
            throw new ForbiddenError("You are not registered as client. Operation is forbidden");
        }
        const login = req.user.login;
        return await this.clientService.createOrderSB(login, nameSB, loginFarmer);
    }

    @UseBefore(AuthenticationMiddleware)
    @Put('/removeOrderSB/:nameSB/:loginFarmer')
    async removeOrderSB(
        @Param('nameSB') nameSB: string,
        @Param('loginFarmer') loginFarmer: string,
        @Req() req: Request,
        @Res() res: Response,
    )
    {
        if (!req.user?.login) {
            throw new BadRequestError("Missing login in token");
        }
        if (req.user?.role !== 'client') {
            throw new ForbiddenError("You are not registered as client. Operation is forbidden");
        }

        const login = req.user.login;
        return await this.clientService.removeOrderSB(login, nameSB, loginFarmer);
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
    @Get("/infAllFarmers")
    async infAllFarmers(@Req() req: Request, @Res() res: Response) {
        if (!req.user?.login) {
            throw new BadRequestError("Missing login in token");
        }
        return await this.clientService.infAllFarmers().catch((err: any) => res.status(404).send(err));
    }




    @UseBefore(AuthenticationMiddleware)
    @Get('/InfFarmersByProduct/:product')
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
        if (!req.user?.login) {
            throw new BadRequestError("Missing login in token");
        }
        if (req.user?.role !== 'client') {
            throw new ForbiddenError("You are not registered as client. Operation is forbidden");
        }

        const login = req.user.login;
        return await this.clientService.InfMyOrderedSurprizeBacks(login);
    }

    @UseBefore(AuthenticationMiddleware)
    @Put("/updateClientPassword")
    async updateClientPassword(@Body() body: { password: string }, @Req() req: Request, @Res() res: Response) {
        if (!req.user?.login) {
            throw new BadRequestError("Missing login in token");
        }
        if (req.user?.role !== 'client') {
            throw new ForbiddenError("You are not registered as client. Operation is forbidden");
        }


        const { password } = body;
        return await this.clientService.updateClientPassword(req.user?.login, password);
    }
    
}