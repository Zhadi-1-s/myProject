// src/core/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Request,Get,Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiTags,ApiBody,ApiBearerAuth } from '@nestjs/swagger';
import { ForgotPasswordDto } from './dto/forgot-password';

import { ResetPasswordDto } from './dto/reset-password';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { UploadedFile } from '@nestjs/common';
import { Express } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}



  @UseInterceptors(FileInterceptor('avatar', {
    storage: diskStorage({
      destination: './uploads/avatars',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, uniqueSuffix + extname(file.originalname));
      }
    })
  }))
  // Регистрация
  @Post('register')
  @ApiBody({ type: RegisterDto })
  async register(
    @Body() dto: RegisterDto,
    @UploadedFile() file?: Express.Multer.File   // 👈 вот этого не хватает
  ) {
    console.log('BODY:', dto);
    console.log('FILE:', file);

    const avatarUrl = file
      ? `/uploads/avatars/${file.filename}`
      : '/assets/png/avatart-default.jpg';  // 👈 если файла нет — ставим дефолт

    return this.authService.register({ ...dto, avatarUrl });
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
