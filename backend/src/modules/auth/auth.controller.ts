import { Controller, Post, Body, UseGuards, Request, Get, Res, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Response } from 'express';

const isProduction = process.env.NODE_ENV === 'production';

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST:  auth/login
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(loginDto);
    
    // Set refresh token in HttpOnly cookie
    response.cookie('refreshToken', result.refreshToken, cookieOptions);

    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  // POST: auth/register
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.register(registerDto);

    // Set refresh token in HttpOnly cookie
    response.cookie('refreshToken', result.refreshToken, cookieOptions);

    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  // POST: auth/refresh
  @Post('refresh')
  async refresh(
    @Request() req: any,
    @Res({ passthrough: true }) response: Response,
  ) {
    // Manually parse cookies from the raw cookie header
    const cookieHeader = req.headers.cookie || '';
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map((c) => {
        const parts = c.trim().split('=');
        return [parts[0], parts.slice(1).join('=')];
      })
    );
    
    const token = cookies['refreshToken'];
    if (!token) {
      throw new UnauthorizedException('Không tìm thấy refresh token trong cookie');
    }

    const result = await this.authService.refreshToken(token);

    // Update refresh token in HttpOnly cookie
    response.cookie('refreshToken', result.refreshToken, cookieOptions);

    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  // POST: auth/logout
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('refreshToken', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
    });
    return { message: 'Đăng xuất thành công' };
  }

  // GET: auth/me
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Request() req) {
    return req.user;
  }

  // POST: auth/change-password
  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(req.user.id, changePasswordDto);
  }
}
