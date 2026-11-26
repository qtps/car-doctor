import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayMaxSize,
  IsArray,
  IsEmail,
  IsInt,
  IsOptional,
  IsMongoId,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
  ValidateNested,
} from 'class-validator';

@ValidatorConstraint({ name: 'exactlyOneOrderReference', async: false })
class ExactlyOneOrderReference implements ValidatorConstraintInterface {
  validate(_value: unknown, args?: ValidationArguments): boolean {
    const item = args?.object as OrderItemDto | undefined;
    if (!item) return false;
    return Boolean(item.productId) !== Boolean(item.serviceId);
  }

  defaultMessage() {
    return 'Each order item must reference exactly one product or service';
  }
}

class OrderItemDto {
  @IsOptional()
  @IsMongoId()
  productId?: string;

  @IsOptional()
  @IsMongoId()
  serviceId?: string;

  @IsInt()
  @Min(1)
  @Max(50)
  @Validate(ExactlyOneOrderReference)
  quantity!: number;
}

export class CreateOrderDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  firstName!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(80)
  lastName!: string;

  @IsEmail()
  @MaxLength(254)
  email!: string;

  @IsString()
  @MinLength(5)
  @MaxLength(30)
  phone!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1200)
  message?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}