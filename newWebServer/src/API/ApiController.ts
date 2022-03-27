import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class ApiController {
    @Get()
    public async GetIndex(@Res() res: Response): Promise<void> {
        return res.render('index');
    }

    @Get('/content-policy')
    public async GetContentPolicy(@Res() res: Response): Promise<void> {
        return res.render('global/contentPolicy');
    }

    @Get('/cookie-policy')
    public async GetCookiePolicy(@Res() res: Response): Promise<void> {
        return res.render('global/cookiePolicy');
    }

    @Get('/privacy-policy')
    public async GetPrivacyPolicy(@Res() res: Response): Promise<void> {
        return res.render('global/privacyPolicy');
    }
}