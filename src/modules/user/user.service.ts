import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO, UpdatePasswordDTO, UpdateUserDTO } from './dto';
import { TokenService } from '../token/token.service';
import { AuthUserResponse } from '../auth/response';
import { AppError } from '../../common/constants/errors';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
    private readonly tokenService: TokenService,
  ) {}

  //hashing to password
  async hashPassword(password: string): Promise<string> {
    try {
      return bcrypt.hash(password, 10);
    } catch (error) {
      throw new Error(error);
    }
  }

  // Find user by email
  async findUserByEmail(email: string): Promise<User> {
    this.logger.log('Searching for user with email: ' + email);
    return this.userRepository.findOne({
      where: { email },
    });
  }

  // Find user by id
  async findUserById(id: number): Promise<User> {
    this.logger.log('Searching for user with id: ' + id);
    return this.userRepository.findOne({
      where: { id },
    });
  }
  //create new user
  async createUser(dto: CreateUserDTO): Promise<User> {
    try {
      // Hash the password before saving the user
      const hashedPassword = await this.hashPassword(dto.password);

      // Create new user object
      const newUser = await this.userRepository.create({
        userName: dto.userName,
        email: dto.email,
        password: hashedPassword,
        language: dto.language,
        themeModeDevice: dto.themeModeDevice,
        avatar: dto.avatar,
      });
      this.logger.log(
        'User successfully created in database with email: ' + dto.email,
      );

      return newUser;
    } catch (error) {
      throw new Error(error);
    }
  }

  // Get user info
  async getUserInfo(userId: number): Promise<User> {
    this.logger.log('Fetching user info for user with id: ' + userId);
    return this.userRepository.findOne({
      where: { id: userId },
      attributes: { exclude: ['password'] }, // Exclude password from the result
    });
  }

  // Update user
  async updateUser(userId: number, dto: UpdateUserDTO): Promise<User> {
    this.logger.log('Updating user with id: ' + userId);
    await this.userRepository.update(dto, { where: { id: userId } });
    return this.findUserById(userId);
  }

  // Update user password
  async updatePassword(userId: number, dto: UpdatePasswordDTO): Promise<any> {
    this.logger.log(`Updating password for user with id: ${userId}`);
    const user = await this.findUserById(userId);

    const isOldPasswordValid = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new BadRequestException(AppError.WRONG_DATA);
    }

    const hashedNewPassword = await this.hashPassword(dto.newPassword);
    await this.userRepository.update({ password: hashedNewPassword }, { where: { id: userId } });
    return { message: 'Password updated successfully' };
  }

  // Delete user account
  async deleteUser(id: number): Promise<boolean> {
    this.logger.log('Deleting user with id: ' + id);
    const result = await this.userRepository.destroy({ where: { id } });
    return result > 0;
  }
  //delete user account end---
}
