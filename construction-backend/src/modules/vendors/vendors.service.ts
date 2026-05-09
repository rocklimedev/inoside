import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Vendor } from './models/vendor.model';
import { ProjectVendor } from './models/project-vendor.model';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { AssignVendorDto } from './dto/assign-vendor.dto';

@Injectable()
export class VendorsService {
  constructor(
    @InjectModel(Vendor) private vendorModel: typeof Vendor,
    @InjectModel(ProjectVendor)
    private projectVendorModel: typeof ProjectVendor,
  ) {}

  async createVendor(dto: CreateVendorDto) {
    return this.vendorModel.create(dto);
  }

  async findAllVendors() {
    return this.vendorModel.findAll({ order: [['name', 'ASC']] });
  }

  async findVendorById(id: number) {
    const vendor = await this.vendorModel.findByPk(id);
    if (!vendor) throw new NotFoundException('Vendor not found');
    return vendor;
  }

  async updateVendor(id: number, dto: UpdateVendorDto) {
    const vendor = await this.findVendorById(id);
    await vendor.update(dto);
    return vendor;
  }

  // ====================== Project Vendors ======================
  async assignVendorToProject(dto: AssignVendorDto) {
    return this.projectVendorModel.create(dto);
  }

  async getVendorsByProject(projectId: number) {
    return this.projectVendorModel.findAll({
      where: { project_id: projectId },
      include: [{ model: Vendor }],
      order: [['created_at', 'DESC']],
    });
  }

  async updateProjectVendor(id: number, updateData: Partial<AssignVendorDto>) {
    const pv = await this.projectVendorModel.findByPk(id);
    if (!pv) throw new NotFoundException('Project-Vendor record not found');
    await pv.update(updateData);
    return pv;
  }
}
