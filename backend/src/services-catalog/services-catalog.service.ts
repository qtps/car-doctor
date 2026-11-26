import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service, ServiceDocument } from '../schemas/service.schema';
import { ServiceDto } from './services-catalog.dto';

const demoServices: ServiceDto[] = [
  { name: 'Electrical System', description: 'Battery, starter, alternator and wiring diagnostics with clear repair recommendations.', price: 20, image: '/cart_items_1.png' },
  { name: 'Engine Diagnostics', description: 'Accurate engine scans and expert troubleshooting to get you back on the road.', price: 20, image: '/cart_items_2.png' },
  { name: 'Auto Car Repair', description: 'Reliable repairs carried out by experienced, certified automotive technicians.', price: 20, image: '/cart_items_3.png' },
  { name: 'Brake & Suspension', description: 'Keep your ride safe and steady with brake, steering and suspension care.', price: 35, image: '/cart_items_4.png' },
  { name: 'Engine Oil Change', description: 'Fresh oil and quality filters to support a healthy, longer-lasting engine.', price: 25, image: '/cart_items_5.png' },
  { name: 'Battery Service', description: 'Battery testing, replacement and charging system checks for peace of mind.', price: 30, image: '/cart_items_6.png' },
];

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

@Injectable()
export class ServicesCatalogService {
  constructor(@InjectModel(Service.name) private readonly services: Model<ServiceDocument>) {}

  async onModuleInit() {
    if (await this.services.exists({})) return;
    await this.services.insertMany(demoServices.map((service) => ({
      ...service,
      slug: slugify(service.slug ?? service.name),
    })));
  }

  findAll(includeInactive = false) {
    return this.services.find(includeInactive ? {} : { active: true }).sort({ createdAt: 1 }).lean();
  }

  async findOne(slug: string) {
    const service = await this.services.findOne({ slug, active: true }).lean();
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  create(dto: ServiceDto) {
    return this.services.create({ ...dto, slug: slugify(dto.slug ?? dto.name) });
  }

  async update(id: string, dto: Partial<ServiceDto>) {
    const service = await this.services.findByIdAndUpdate(id, {
      ...dto,
      ...(dto.slug || dto.name ? { slug: slugify(dto.slug ?? dto.name!) } : {}),
    }, { new: true, runValidators: true });
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  async remove(id: string) {
    const service = await this.services.findByIdAndDelete(id);
    if (!service) throw new NotFoundException('Service not found');
    return { message: 'Service deleted' };
  }
}