// src/core/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Request,Get,Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiTags,ApiBody,ApiBearerAuth } from '@nestjs/swagger';
import { ForgotPasswordDto } from './dto/forgot-password';

import { ResetPasswordDto } from './dto/reset-password';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}



  // Регистрация
  @Post('register')
  @ApiBody({ type: RegisterDto })
  async register(
    @Body() dto:RegisterDto) {
        console.log('BODY:', dto);
        return this.authService.register(dto);
  }

  @Post('request-reset')
  async RequestReset(@Body()dto:ForgotPasswordDto ) {
    return this.authService.requestPasswordReset(dto.email);
  }
  
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  async getProfile(@Req() req) {
    return this.authService.getProfile(req.user.userId); // достаём ID юзера из токена
  }

  // Логин (получение JWT)
  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: any) {
    return this.authService.login(loginDto);
  }

  // Пример защищённого эндпоинта

  //   @UseGuards(JwtAuthGuard)
//   @Post('profile')
//   async getProfile(@Request() req) {
//     return req.user;
//   }
}
