import { Controller, Get, HttpStatus, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {

    @Get('discord')
	@UseGuards(AuthGuard('discord'))
    public async DiscordLogin(@Req() req, @Res() res) {
        return res.status(HttpStatus.FOUND).redirect('http://localhost:3000');
    }
}