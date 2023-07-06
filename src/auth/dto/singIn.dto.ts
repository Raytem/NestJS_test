import { IsString } from 'class-validator';

export class SingInDto {
  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsString()
  userAgent: string;
}
