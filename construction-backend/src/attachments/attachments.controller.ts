import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Delete,
  Param,
  Req,
  ParseEnumPipe,
} from '@nestjs/common';

import { AttachmentsService } from './attachments.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { AttachmentEntityType } from './entities/attachments.entity';

@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly service: AttachmentsService) {}

  @Post()
  create(@Body() dto: CreateAttachmentDto, @Req() req) {
    return this.service.create(dto, req.user.id);
  }

  @Get()
  getByEntity(
    @Query('entity_type', new ParseEnumPipe(AttachmentEntityType))
    entity_type: AttachmentEntityType,

    @Query('entity_id')
    entity_id: string,
  ) {
    return this.service.findByEntity(entity_type, entity_id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
