import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AppError } from '../../common/constants/errors';
import { CreateUserDTO } from '../user/dto';
import { UserLoginDTO } from './dto';
import * as bcrypt from 'bcrypt';
import { TokenService } from '../token/token.service';
import { AuthUserResponse } from './response';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  //registration user
  async registerUsers(dto: CreateUserDTO): Promise<AuthUserResponse> {
    this.logger.log('Attempting to register user with email: ' + dto.email);
    try {
      //if has user
      const existUser = await this.userService.findUserByEmail(dto.email);
      if (existUser) {
        this.logger.warn('User with email ' + dto.email + ' already exists');
        throw new BadRequestException(AppError.USER_EXIST);
      }

      // Create new user
      this.logger.log('Creating new user with email: ' + dto.email);
      await this.userService.createUser(dto);
      this.logger.log('User created with email: ' + dto.email);

      const user = await this.userService.findUserByEmail(dto.email);
      const token = await this.tokenService.generationJwtToken(user);
      return { user, token };
    } catch (error) {
      this.logger.error('Error registering user with email: ' + dto.email, error.stack);
      throw new BadRequestException(AppError.USER_EXIST);
    }
  }

  //login user
  async loginUser(dto: UserLoginDTO): Promise<AuthUserResponse> {
    this.logger.log('Attempting to log in user with email: ' + dto.email);
    try {
      //find user by email in DB
      const existUser = await this.userService.findUserByEmail(dto.email);
      if (!existUser) {
        this.logger.warn('User with email ' + dto.email + ' does not exist');
        throw new BadRequestException(AppError.USER_NOT_EXIST);
      }

      //verification re hash password
      const validatePassword = await bcrypt.compare(dto.password, existUser.password);
      if (!validatePassword) {
        this.logger.warn('Invalid password for user with email: ' + dto.email);
        throw new BadRequestException(AppError.WRONG_DATA);
      }

      this.logger.log('User logged in with email: ' + dto.email);
      const token = await this.tokenService.generationJwtToken(existUser);
      return { user: existUser, token };
    } catch (error) {
      this.logger.error('Error logging in user with email: ' + dto.email, error.stack);
      throw new BadRequestException(AppError.WRONG_DATA);
    }
  }
}
