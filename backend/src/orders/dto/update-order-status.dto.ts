import { IsIn } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsIn(['pending', 'approved', 'completed', 'cancelled'])
  status!: 'pending' | 'approved' | 'completed' | 'cancelled';
}