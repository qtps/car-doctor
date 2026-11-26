import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateTeamMemberDto, CreateTestimonialDto, UpdateTeamMemberDto, UpdateTestimonialDto } from './content.dto';
import { ContentService } from './content.service';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';

@Controller('content')
export class ContentController {
  constructor(private readonly content: ContentService) {}

  @Get('team')
  getTeam() {
    return this.content.getTeam();
  }

  @Get('testimonials')
  getTestimonials() {
    return this.content.getTestimonials();
  }

  @Post('team')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  createTeamMember(@Body() input: CreateTeamMemberDto) {
    return this.content.createTeamMember(input);
  }

  @Patch('team/:id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateTeamMember(@Param('id', ParseMongoIdPipe) id: string, @Body() input: UpdateTeamMemberDto) {
    return this.content.updateTeamMember(id, input);
  }

  @Delete('team/:id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  removeTeamMember(@Param('id', ParseMongoIdPipe) id: string) {
    return this.content.removeTeamMember(id);
  }

  @Post('testimonials')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  createTestimonial(@Body() input: CreateTestimonialDto) {
    return this.content.createTestimonial(input);
  }

  @Patch('testimonials/:id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateTestimonial(@Param('id', ParseMongoIdPipe) id: string, @Body() input: UpdateTestimonialDto) {
    return this.content.updateTestimonial(id, input);
  }

  @Delete('testimonials/:id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  removeTestimonial(@Param('id', ParseMongoIdPipe) id: string) {
    return this.content.removeTestimonial(id);
  }
}