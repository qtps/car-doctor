import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

const demoProducts: CreateProductDto[] = [
  { name: 'Car Engine Plug', description: 'Precision-engineered spark plugs for reliable ignition and a smoother drive.', price: 20, image: '/product_1.png', category: 'Engine', stock: 24, rating: 5, featured: true },
  { name: 'Car Air Filter', description: 'High-efficiency air filter that helps protect your engine and restore performance.', price: 20, image: '/product_2.png', category: 'Filters', stock: 18, rating: 5, featured: true },
  { name: 'Cools LED Light', description: 'Bright, durable automotive lighting built for a clear view on every road.', price: 20, image: '/product_3.png', category: 'Lighting', stock: 15, rating: 5, featured: true },
  { name: 'Performance Brake Kit', description: 'Responsive, dependable braking components inspected by our technicians.', price: 35, image: '/product_4.png', category: 'Brakes', stock: 12, rating: 5, featured: true },
  { name: 'All-season Tire Set', description: 'Road-ready tires selected for dependable grip and everyday comfort.', price: 80, image: '/product_5.png', category: 'Tires', stock: 9, rating: 5, featured: true },
  { name: 'Car Battery', description: 'Reliable starting power tested to meet your vehicle specifications.', price: 65, image: '/product_6.png', category: 'Electrical', stock: 11, rating: 5, featured: true },
];

function makeSlug(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private readonly products: Model<ProductDocument>) {}

  async onModuleInit(): Promise<void> {
    if (await this.products.exists({})) return;
    await this.products.insertMany(demoProducts.map((product) => ({
      ...product,
      slug: makeSlug(product.name),
    })));
  }

  findAll() {
    return this.products.find().sort({ featured: -1, createdAt: -1 }).lean();
  }

  async findOne(idOrSlug: string) {
    const product = await this.products.findOne({
      $or: [{ slug: idOrSlug }, ...(idOrSlug.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: idOrSlug }] : [])],
    }).lean();
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(dto: CreateProductDto) {
    return this.products.create({ ...dto, slug: makeSlug(dto.slug ?? dto.name) });
  }

  async update(id: string, dto: UpdateProductDto) {
    const patch = { ...dto, ...(dto.slug || dto.name ? { slug: makeSlug(dto.slug ?? dto.name!) } : {}) };
    const product = await this.products.findByIdAndUpdate(id, patch, { new: true, runValidators: true });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async remove(id: string) {
    const product = await this.products.findByIdAndDelete(id);
    if (!product) throw new NotFoundException('Product not found');
    return { message: 'Product deleted' };
  }
}