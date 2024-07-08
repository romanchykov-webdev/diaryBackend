import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO, UpdatePasswordDTO, UpdateUserDTO } from '../user/dto';
import { UserLoginDTO } from './dto';
import { AuthUserResponse } from './response';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from '../../guards/jwt-guard';
import { User } from '../user/models/user.model';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  //registration user
  //to describer the documentation
  @ApiTags('API')
  @ApiResponse({ status: 201, type: CreateUserDTO })
  //to describer the documentation end--
  @Post('register')
  register(@Body() dto: CreateUserDTO): Promise<AuthUserResponse> {
    this.logger.log('Attempting to register user with email: ' + dto.email);
    return this.authService.registerUsers(dto);
  }

  //registration user end-------------

  //login user
  //to describer the documentation
  @ApiTags('API')
  @ApiResponse({ status: 200, type: AuthUserResponse })
  //to describer the documentation end--
  @Post('login')
  login(@Body() dto: UserLoginDTO): Promise<AuthUserResponse> {
    this.logger.log(
      'Attempting to login user with email: ' + dto.email,
      'Attempting to login user with password: ' + dto.password,
    );
    return this.authService.loginUser(dto);
  }

  //login user end------------------

  // Update user
  @ApiTags('API')
  @ApiResponse({ status: 200, type: UpdateUserDTO })
  @UseGuards(JwtAuthGuard)
  @Patch('update')
  update(@Req() request, @Body() dto: UpdateUserDTO): Promise<User> {
    const user = request.user;
    return this.userService.updateUser(user.id, dto);
  }

  // delete user
  @ApiTags('API')
  @ApiResponse({ status: 200, type: Boolean })
  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  delete(@Req() request): Promise<boolean> {
    const user = request.user;
    return this.userService.deleteUser(user.id);
  }

  // get public user info
  @UseGuards(JwtAuthGuard)
  @Get('get-public-user-info')
  @ApiTags('API')
  @ApiResponse({ status: 200, type: User })
  getPublicUserInfo(@Req() request): Promise<User> {
    const user = request.user;
    return this.userService.getUserInfo(user.id);
  }

  // get public user info end

  // update user password
  @ApiTags('API')
  @ApiResponse({ status: 200, type: Object })
  @UseGuards(JwtAuthGuard)
  @Patch('update-password')
  updatePassword(@Req() request, @Body() dto: UpdatePasswordDTO): Promise<any> {
    const user = request.user;
    return this.userService.updatePassword(user.id, dto);
  }
}
