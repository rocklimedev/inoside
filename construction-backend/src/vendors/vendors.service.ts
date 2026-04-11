import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from './entities/vendor.entity';
import { VendorQuotation } from './entities/vendor-quotation.entity';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { CreateVendorQuotationDto } from './dto/create-vendor-quotation.dto';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepo: Repository<Vendor>,

    @InjectRepository(VendorQuotation)
    private readonly quotationRepo: Repository<VendorQuotation>,
  ) {}

  // ====================== VENDORS ======================
  async create(dto: CreateVendorDto) {
    const vendor = this.vendorRepo.create(dto);
    return this.vendorRepo.save(vendor);
  }

  async findAll() {
    return this.vendorRepo.find({
      relations: ['primary_address'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string) {
    const vendor = await this.vendorRepo.findOne({
      where: { id },
      relations: ['primary_address', 'quotations'],
    });
    if (!vendor) throw new NotFoundException('Vendor not found');
    return vendor;
  }

  async update(id: string, dto: CreateVendorDto) {
    await this.findOne(id); // Check existence
    await this.vendorRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.vendorRepo.delete(id);
  }

  // ====================== VENDOR QUOTATIONS ======================
  async createQuotation(dto: CreateVendorQuotationDto) {
    const quotation = this.quotationRepo.create({
      trade_category: dto.trade_category,
      raw_quote_data: dto.raw_quote_data,

      total_amount: dto.total_amount?.toString(), // 🔥 important fix

      project: dto.project_id ? { id: dto.project_id } : undefined,
      vendor: dto.vendor_id ? { id: dto.vendor_id } : undefined,
    });

    return this.quotationRepo.save(quotation);
  }

  async findQuotationsByProject(project_id: string) {
    return this.quotationRepo.find({
      where: { project_id },
      relations: ['vendor'],
      order: { submitted_at: 'DESC' },
    });
  }

  async findQuotationsByVendor(vendor_id: string) {
    return this.quotationRepo.find({
      where: { vendor_id },
      relations: ['project'],
      order: { submitted_at: 'DESC' },
    });
  }
}
