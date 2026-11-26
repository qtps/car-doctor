import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { TeamMember, TeamMemberSchema } from '../schemas/team-member.schema';
import { Testimonial, TestimonialSchema } from '../schemas/testimonial.schema';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TeamMember.name, schema: TeamMemberSchema },
      { name: Testimonial.name, schema: TestimonialSchema },
    ]),
    AuthModule,
  ],
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}