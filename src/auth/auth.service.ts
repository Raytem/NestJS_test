import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/enums/role.enum';
import { RoleEntity } from 'src/realizations/role/entities/role.entity';
import { CreateUserDto } from 'src/realizations/user/dto/create-user.dto';
import { UserEntity } from 'src/realizations/user/entities/user.entity';
import { UserService } from 'src/realizations/user/user.service';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SingInDto } from './dto/singIn.dto';
import { TokenService, Tokens, UserData } from './token/token.service';
import { PayloadDto } from './dto/payload.dto';
import { getDevice } from './utils/getDevice.util';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,

    private tokenService: TokenService,

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<UserData> {
    let user = await this.userRepository.findOneBy({
      name: createUserDto.name,
    });

    if (user) {
      throw new BadRequestException(
        `User with name '${createUserDto.name}' already exists.`,
      );
    }

    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    const defaultUserRole = await this.roleRepository.findOneBy({
      name: Role.USER,
    });

    user = await this.userRepository.save({
      ...createUserDto,
      roles: [defaultUserRole],
    });

    const device = getDevice(createUserDto.userAgent);
    const tokens = await this.tokenService.getTokens(user, device);

    return {
      user: new UserEntity(user),
      tokens,
    };
  }

  async signIn(singInDto: SingInDto): Promise<Tokens> {
    const { name, password } = singInDto;
    const user = await this.userService.findOne(null, name);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    const device = getDevice(singInDto.userAgent);
    const tokens = await this.tokenService.getTokens(user, device);

    return tokens;
  }

  async refresh(refreshToken: string) {
    const tokenPayload: PayloadDto =
      await this.tokenService.validateRefreshToken(refreshToken);
    const user = await this.userRepository.findOneBy({
      id: tokenPayload.userId,
    });
    return this.tokenService.refresh(user, tokenPayload.device, refreshToken);
  }

  async logout(refreshToken) {
    return await this.tokenService.removeToken(refreshToken);
  }
}
