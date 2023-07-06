import { Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  surname: string;

  @Type(() => Date)
  @IsDate()
  birthday: Date;

  @IsString()
  password: string;

  @IsString()
  userAgent: string;
}
