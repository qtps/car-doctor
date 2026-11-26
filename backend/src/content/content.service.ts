import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TeamMember, TeamMemberDocument } from '../schemas/team-member.schema';
import { Testimonial, TestimonialDocument } from '../schemas/testimonial.schema';

const teamSeed = [
  { name: 'Alex Morgan', role: 'Engine Expert', image: '/team_member_1.png', order: 1 },
  { name: 'Jordan Lee', role: 'Service Technician', image: '/team_member_2.png', order: 2 },
  { name: 'Sam Rivera', role: 'Automotive Specialist', image: '/team_member_3.png', order: 3 },
];
const testimonialSeed = [
  { name: 'Awlad Hossain', role: 'Businessman', quote: 'The team explained everything clearly, finished on time, and my car has never driven better. I will be back for every service.', image: '/awlad.png', rating: 5 },
  { name: 'Monir Ahmed', role: 'Local customer', quote: 'Friendly service, fair pricing and no surprises. Booking was easy and the technicians did a fantastic job.', image: '/monir.png', rating: 5 },
];

@Injectable()
export class ContentService {
  constructor(
    @InjectModel(TeamMember.name) private readonly team: Model<TeamMemberDocument>,
    @InjectModel(Testimonial.name) private readonly testimonials: Model<TestimonialDocument>,
  ) {}

  async onModuleInit() {
    if (!(await this.team.exists({}))) await this.team.insertMany(teamSeed);
    if (!(await this.testimonials.exists({}))) await this.testimonials.insertMany(testimonialSeed);
  }

  getTeam() {
    return this.team.find().sort({ order: 1 }).lean();
  }

  getTestimonials() {
    return this.testimonials.find().sort({ createdAt: -1 }).lean();
  }

  createTeamMember(input: Partial<TeamMember>) {
    return this.team.create(input);
  }

  async updateTeamMember(id: string, input: Partial<TeamMember>) {
    const member = await this.team.findByIdAndUpdate(id, input, { new: true, runValidators: true });
    if (!member) throw new NotFoundException('Team member not found');
    return member;
  }

  async removeTeamMember(id: string) {
    if (!(await this.team.findByIdAndDelete(id))) throw new NotFoundException('Team member not found');
    return { message: 'Team member deleted' };
  }

  createTestimonial(input: Partial<Testimonial>) {
    return this.testimonials.create(input);
  }

  async updateTestimonial(id: string, input: Partial<Testimonial>) {
    const testimonial = await this.testimonials.findByIdAndUpdate(id, input, { new: true, runValidators: true });
    if (!testimonial) throw new NotFoundException('Testimonial not found');
    return testimonial;
  }

  async removeTestimonial(id: string) {
    if (!(await this.testimonials.findByIdAndDelete(id))) throw new NotFoundException('Testimonial not found');
    return { message: 'Testimonial deleted' };
  }
}