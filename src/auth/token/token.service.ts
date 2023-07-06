import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { jwtConfig } from 'config/jwt.config';
import { TokenEntity } from '../entities/token.entity';
import { Repository } from 'typeorm';
import { PayloadDto } from '../dto/payload.dto';
import { UserEntity } from 'src/realizations/user/entities/user.entity';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserData {
  user: UserEntity;
  tokens: Tokens;
}

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private jwtCfg: ConfigType<typeof jwtConfig>,

    @InjectRepository(TokenEntity)
    private tokenRepository: Repository<TokenEntity>,
  ) {}

  private async generateTokens(user: UserEntity, device: string) {
    const payload = new PayloadDto(user, device);
    const tokens = await Promise.all([
      this.jwtService.signAsync(
        { ...payload },
        {
          secret: this.jwtCfg.accessTokenSecret,
          expiresIn: this.jwtCfg.accessTokenLifetime,
        },
      ),
      this.jwtService.signAsync(
        { ...payload },
        {
          secret: this.jwtCfg.refreshTokenSecret,
          expiresIn: this.jwtCfg.refreshTokenLifetime,
        },
      ),
    ]);
    return {
      accessToken: tokens[0],
      refreshToken: tokens[1],
    };
  }

  async getTokens(user: UserEntity, device: string) {
    const token = await this.tokenRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        device,
        user: {
          id: user.id,
        },
      },
    });

    const tokens = await this.generateTokens(user, device);

    if (token) {
      token.refreshToken = tokens.refreshToken;
      await this.tokenRepository.save(token);
    } else {
      await this.tokenRepository.save({
        user,
        refreshToken: tokens.refreshToken,
        device,
      });
    }

    return tokens;
  }

  async removeToken(refreshToken: string) {
    const token = await this.tokenRepository.findOneBy({
      refreshToken,
    });
    if (!token) return null;
    await this.tokenRepository.remove(token);
    return token;
  }

  async refresh(
    user: UserEntity,
    device: string,
    refreshToken: string,
  ): Promise<Tokens> {
    const token = await this.tokenRepository.findOneBy({
      refreshToken,
    });
    if (!token) throw new UnauthorizedException('Invalid refresh token');

    return await this.getTokens(user, device);
  }

  async validateAccessToken(accessToken) {
    const tokenPayload = await this.jwtService
      .verifyAsync(accessToken, {
        secret: this.jwtCfg.accessTokenSecret,
      })
      .catch((err) => {
        throw new UnauthorizedException(err.message);
      });
    return tokenPayload;
  }

  async validateRefreshToken(refreshToken: string) {
    const tokenPayload = await this.jwtService
      .verifyAsync(refreshToken, {
        secret: this.jwtCfg.refreshTokenSecret,
      })
      .catch((err) => {
        throw new UnauthorizedException(err.message);
      });
    return tokenPayload;
  }
}
