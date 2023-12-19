import {
  Controller,
  Post,
  UseGuards,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { RefreshJwtAuthGuard } from './guards/refresh-jwt-auth.guard';
// import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthConfirmEmailDto } from './dto/auth-confirm-email.dto';
import { GoogleAuthGuard } from './guards/google.guard';
import { Request } from 'express';
import { AuthLoginDto } from './dto/auth-login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'login by user' })
  @ApiResponse({
    status: HttpStatus.OK,
    content: {
      'application/json': {
        example: {
          token: 'string',
          tokenExpires: 'number',
          refreshToken: 'refreshToken',
          user: {
            id: 'id',
            name: 'John Doe',
            phone: '+380509999999',
            email: 'email@examole.com',
            isConfirm: 'boolean',
            online: 'boolean',
            createdAt: 'Date',
            updatedAt: 'Date',
            deletedAt: 'Date or null',
          },
        },
      },
    },
  })
  async login(@Body() loginDto: AuthLoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('admin/login')
  @ApiOperation({ summary: 'login by admin' })
  async adminLogin(@Body() loginDto: AuthLoginDto) {
    return await this.authService.adminLogin(loginDto);
  }

  @Post('email/register')
  @ApiOperation({ summary: 'user registration' })
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: AuthRegisterDto): Promise<void> {
    return this.authService.register(createUserDto);
  }

  @Post('email/confirm')
  @ApiOperation({ summary: 'user email confirmation' })
  @ApiResponse({
    status: HttpStatus.OK,
    content: {
      'application/json': {
        example: {
          token: 'string',
          tokenExpires: 'number',
          refreshToken: 'refreshToken',
          user: {
            id: 'id',
            name: 'John Doe',
            phone: '+380509999999',
            email: 'email@examole.com',
            isConfirm: 'boolean',
            online: 'boolean',
            createdAt: 'Date',
            updatedAt: 'Date',
            deletedAt: 'Date or null',
          },
        },
      },
    },
  })
  async confirmEmail(
    @Body() confirmEmailDto: AuthConfirmEmailDto,
  ): Promise<object> {
    return this.authService.confirmEmail(confirmEmailDto.hash);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req: Request) {
    return req.user;
  }

  @Get('google/redirect')
  @HttpCode(HttpStatus.OK)
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req: Request) {
    return await this.authService.googleLogin(req);
  }

  @ApiBearerAuth()
  @Post('refresh')
  @ApiOperation({ summary: "refreshing user's tokens when token expired " })
  @ApiResponse({
    status: HttpStatus.OK,
    content: {
      'application/json': {
        example: {
          token: 'string',
          tokenExpires: 'number',
          refreshToken: 'refreshToken',
        },
      },
    },
  })
  @UseGuards(RefreshJwtAuthGuard)
  async refreshToken(@Req() req) {
    return this.authService.refreshToken(req.user.id);
  }

  @ApiBearerAuth()
  @Post('logout')
  @ApiOperation({ summary: 'logout by user' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req) {
    return this.authService.logout(req.user.id);
  }

  // @Post('/forgotPassword')
  // async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
  //   return this.authService.forgotPassword(forgotPasswordDto);
  // }
}
