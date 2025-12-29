import { IsOptional, IsString, IsNumber, IsPositive } from 'class-validator';

export class CreateTokenDto {
  @IsOptional()
  @IsString()
  sub?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  clientId?: number;

  @IsOptional()
  @IsString()
  expiresIn?: string;
}
