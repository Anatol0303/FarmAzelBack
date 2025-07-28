
import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundError,
    Param,
    Post,
    Put,
    Req,
    Res,
    UseBefore,
    BadRequestError,
    ForbiddenError
} from "routing-controllers";
import FarmerService from "../service/FarmerService";
import FarmerServiceImpl from "../service/FarmerServiceImpl";
import { Response, Request } from "express";
import { AuthenticationMiddleware } from "../Middleware/AuthenticationMiddleware";
import NewFarmerDto from "../dto/NewFarmerDto";
import SurprizeBackToSchema from "../../surprizeBack/dto/SurprizeBackTo";

@Controller("/apifarm")
export default class FarmerController {
    farmService: FarmerService = new FarmerServiceImpl();

    @Post("/registerFarmer")
    async registerFarmer(@Body() newFarmerDto: NewFarmerDto, @Res() res: Response) {
        const token = await this.farmService.registerFarmer(newFarmerDto).catch((err: any) => res.send(err));
        return res.json({ token });
    }
    
    @Post("/loginFarmer")
    async loginFarmer(@Body() loginFarmerDto: { login: string; password: string }, @Res() res: Response) {
        const token = await this.farmService.loginFarmer(loginFarmerDto.login, loginFarmerDto.password).catch((err: any) => res.send(err));
        return res.json({ token });
    }

    @UseBefore(AuthenticationMiddleware)
    @Delete("/removeFarmer")
    async removeFarmerByLogin(@Req() req: Request, @Res() res: Response) {
        if (!req.user?.login) throw new BadRequestError("Missing login in token");
        if (req.user?.role !== 'farmer') throw new ForbiddenError("You are not registrated as farmer. Operation is forbidden");
        
        try {
            await this.farmService.removeFarmerByLogin(req.user.login);
            res.status(200).send({ message: "Farmer successfully deleted" });
        } catch (err) {
            res.status(404).send(err);
        }
    }

    @UseBefore(AuthenticationMiddleware)
    @Put("/updateFarmer")
    async updateFarmer(@Body() updateFarmerDto: NewFarmerDto, @Req() req: Request, @Res() res: Response) {
        if (!req.user?.login) {
            throw new BadRequestError("Missing login in token");
        }
        if (req.user?.role !== 'farmer') {
            throw new ForbiddenError("You are not registered as farmer. Operation is forbidden");
        }

        try {
            await this.farmService
                .updateFarmer(
                    req.user.login,
                    updateFarmerDto.firstName,
                    updateFarmerDto.lastName,
                    updateFarmerDto.address,
                    updateFarmerDto.phone,
                    updateFarmerDto.mail,
                    updateFarmerDto.postCode
                )
            res.status(200).send({ message: "Farmer successfully updated" });
        } catch (err) {
            res.status(404).send(err);
        }
    }

    @UseBefore(AuthenticationMiddleware)
    @Post("/addSurprizeBack")
    async addSB(@Body() body: { description: string; product: string; nameSB: string }, @Res() res: Response, @Req() req: Request) {
        if (!req.user?.login) {
            throw new BadRequestError("Missing login in token");
        }
        if (req.user?.role !== 'farmer') {
            throw new ForbiddenError("You are not registered as farmer. Operation is forbidden");
        }
        
        try {
            const { description, product, nameSB } = body;
            const result = await this.farmService.addSB(req.user.login, description, product, nameSB);
            return res.status(200).json(result);
        } catch (err: any) {
            return res.status(400).json({ message: err.message });
        }
    }

    @UseBefore(AuthenticationMiddleware)
    @Delete("/removeSurprizeBack/:nameSB")
    async delSB(@Param("nameSB") nameSB: string, @Req() req: Request, @Res() res: Response) {
        if (!req.user?.login) {
            throw new BadRequestError("Missing login in token");
        }
        if (req.user?.role !== 'farmer') {
            throw new ForbiddenError("You are not registered as farmer. Operation is forbidden");
        }

        try {
            const result = await this.farmService.delSB(req.user.login, nameSB);
            return res.status(200).json(result);
        } catch (err: any) {
            return res.status(400).json({ message: err.message });
        }
    }

    @UseBefore(AuthenticationMiddleware)
    @Put("/updateSurprizeBack/:nameSB")
    async updateSB(@Param("nameSB") nameSB: string, @Req() req: Request, @Body() body: { description: string; product: string }) {
        if (!req.user?.login) {
            throw new BadRequestError("Missing login in token");
        }
        if (req.user?.role !== 'farmer') {
            throw new ForbiddenError("You are not registered as farmer. Operation is forbidden");
        }
        const { description, product } = body;
        return await this.farmService.updateSB(req.user.login, description, product, nameSB);
    }

    @UseBefore(AuthenticationMiddleware)
    @Get("/InfOrdersSB")
    async InfOrdersSB(@Req() req: Request, @Res() res: Response) {
        if (!req.user?.login) {
            throw new BadRequestError("Missing login in token");
        }
        if (req.user?.role !== 'farmer') {
            throw new ForbiddenError("You are not registered as farmer. Operation is forbidden");
        }

        try {

            const data = await this.farmService.InfOrdersSB(req.user.login);
            return res.json(data);
        } catch (err: any) {
            console.error("ERROR in InfOrdersSB:", err);
            return res.status(500).json({ message: err.message });
        }
    }
    
    
    
    @UseBefore(AuthenticationMiddleware)
    @Get('/InfSurprizeBacksByFarmer/:loginFarmer')
    async InfSBbyFarmer(
        @Param('loginFarmer') loginFarmer: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        return await this.farmService.InfSurprizeBacksByFarmer(loginFarmer);
    }
    
    
    @UseBefore(AuthenticationMiddleware)
    @Put("/updateFarmerPassword")
    async updateFarmerPassword(@Body() body: { password: string }, @Req() req: Request, @Res() res: Response) {
        if (!req.user?.login) {
            throw new BadRequestError("Missing login in token");
        }
        if (req.user?.role !== 'farmer') {
            throw new ForbiddenError("You are not registered as farmer. Operation is forbidden");
        }
        
        const { password } = body;
        return await this.farmService.updateFarmerPassword(req.user?.login, password);
    }

    @UseBefore(AuthenticationMiddleware)
    @Get("/infFarmerByLogin/:loginFarmer")
    async infFarmerByLogin(@Param("loginFarmer") loginFarmer: string, @Req() req: Request, @Res() res: Response) {
        return await this.farmService.infFarmerByLogin(loginFarmer).catch((err: any) => res.status(404).send(err));
    }

    @UseBefore(AuthenticationMiddleware)
    @Get("/infAllFarmers")
    async infAllFarmers(@Req() req: Request, @Res() res: Response) {
        if (!req.user?.login) {
            throw new BadRequestError("Missing login in token");
        }

        return await this.farmService.infAllFarmers().catch((err: any) => res.status(404).send(err));
    }

    @UseBefore(AuthenticationMiddleware)
    @Get('/InfAllProducts')
    async InfAllProducts(
        @Req() req: Request,
        @Res() res: Response,
    ) {
        return await this.farmService.InfAllProducts();
    }
    @UseBefore(AuthenticationMiddleware)
    @Get('/InfFarmersByProduct/:product')
    async InfFarmersByProduct(
        @Param('product') product: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        return await this.farmService.InfFarmersByProduct(product);
    }

    @UseBefore(AuthenticationMiddleware)
    @Get("/infSBByNameSB/:nameSB")
    async infSBByNameSB(@Param("nameSB") nameSB: string, @Req() req: Request, @Res() res: Response) {
        if (!req.user?.login) {
            throw new BadRequestError("Missing login in token");
        }
        if (req.user?.role !== 'farmer') {
            throw new ForbiddenError("You are not registered as farmer. Operation is forbidden");
        }
        return await this.farmService
            .infSBByNameSB(req.user.login, nameSB)
            .catch((err: any) => res.status(404).send(err));
    }
}

