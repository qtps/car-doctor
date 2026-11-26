import { IsBoolean, IsNumber, IsOptional, IsString, Min, Max, MaxLength, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsString()
  @MinLength(5)
  @MaxLength(2000)
  description!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsString()
  @MaxLength(500)
  image!: string;

  @IsString()
  @MaxLength(60)
  category!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}