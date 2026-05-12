// vendors.service.ts

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Vendor } from './models/vendor.model';
import { VendorType } from './models/vendor-type.model';
import { VendorTypeVendor } from './models/vendor-type-vendor.model';
import { ProjectVendor } from './models/project-vendor.model';

import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { AssignVendorDto } from './dto/assign-vendor.dto';

@Injectable()
export class VendorsService {
  constructor(
    @InjectModel(Vendor)
    private vendorModel: typeof Vendor,

    @InjectModel(VendorType)
    private vendorTypeModel: typeof VendorType,

    @InjectModel(VendorTypeVendor)
    private vendorTypeVendorModel: typeof VendorTypeVendor,

    @InjectModel(ProjectVendor)
    private projectVendorModel: typeof ProjectVendor,
  ) {}

  // ====================== Vendors ======================

  async createVendor(dto: CreateVendorDto) {
    const { type_ids, ...vendorData } = dto;

    const vendor = await this.vendorModel.create(vendorData as any);

    // assign vendor types
    if (type_ids?.length) {
      const mappings = type_ids.map((type_id) => ({
        vendor_id: vendor.id,
        type_id,
      }));

      await this.vendorTypeVendorModel.bulkCreate(mappings);
    }

    return this.findVendorById(vendor.id);
  }

  async findAllVendors() {
    return this.vendorModel.findAll({
      include: [
        {
          model: VendorType,
          through: { attributes: [] },
        },
      ],
      order: [['name', 'ASC']],
    });
  }

  async findVendorById(id: string) {
    const vendor = await this.vendorModel.findByPk(id, {
      include: [
        {
          model: VendorType,
          through: { attributes: [] },
        },
      ],
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    return vendor;
  }

  async updateVendor(id: string, dto: UpdateVendorDto) {
    const vendor = await this.findVendorById(id);

    const { type_ids, dob, ...vendorData } = dto;

    await vendor.update({
      ...vendorData,
      ...(dob !== undefined && {
        dob: dob ? new Date(dob) : null,
      }),
    });
    // update vendor types
    if (type_ids) {
      await this.vendorTypeVendorModel.destroy({
        where: { vendor_id: id },
      });

      if (type_ids.length) {
        const mappings = type_ids.map((type_id) => ({
          vendor_id: id,
          type_id,
        }));

        await this.vendorTypeVendorModel.bulkCreate(mappings);
      }
    }

    return this.findVendorById(id);
  }

  async deleteVendor(id: string) {
    const vendor = await this.findVendorById(id);

    await this.vendorTypeVendorModel.destroy({
      where: { vendor_id: id },
    });

    await vendor.destroy();

    return {
      message: 'Vendor deleted successfully',
    };
  }

  // ====================== Vendor Types ======================

  async createVendorType(name: string) {
    const exists = await this.vendorTypeModel.findOne({
      where: { name },
    });

    if (exists) {
      throw new ConflictException('Vendor type already exists');
    }

    return this.vendorTypeModel.create({ name });
  }

  async getVendorTypes() {
    return this.vendorTypeModel.findAll({
      order: [['name', 'ASC']],
    });
  }

  // ====================== Project Vendors ======================

  async assignVendorToProject(dto: AssignVendorDto) {
    const exists = await this.projectVendorModel.findOne({
      where: {
        project_id: dto.project_id,
        vendor_id: dto.vendor_id,
      },
    });

    if (exists) {
      throw new ConflictException('Vendor already assigned to this project');
    }

    return this.projectVendorModel.create(dto as any);
  }

  async getVendorsByProject(projectId: string) {
    return this.projectVendorModel.findAll({
      where: { project_id: projectId },

      include: [
        {
          model: Vendor,
          include: [
            {
              model: VendorType,
              through: { attributes: [] },
            },
          ],
        },
      ],

      order: [['created_at', 'DESC']],
    });
  }

  async updateProjectVendor(id: string, updateData: Partial<AssignVendorDto>) {
    const pv = await this.projectVendorModel.findByPk(id);

    if (!pv) {
      throw new NotFoundException('Project-Vendor record not found');
    }

    await pv.update(updateData);

    return pv;
  }

  async removeVendorFromProject(id: string) {
    const pv = await this.projectVendorModel.findByPk(id);

    if (!pv) {
      throw new NotFoundException('Project-Vendor record not found');
    }

    await pv.destroy();

    return {
      message: 'Vendor removed from project successfully',
    };
  }
}
