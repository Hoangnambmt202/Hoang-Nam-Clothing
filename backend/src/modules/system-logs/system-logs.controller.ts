import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SystemLogsService } from './system-logs.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/common/enums/role.enum';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { SystemLogType } from '@/common/enums/system-log-type.enum';

@Controller('system-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class SystemLogsController {
  constructor(private readonly systemLogsService: SystemLogsService) {}

  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query('type') type?: SystemLogType,
    @Query('search') search?: string,
  ) {
    const data = await this.systemLogsService.findAll(paginationDto, type, search);
    return {
      success: true,
      message: 'System logs retrieved successfully',
      data,
    };
  }
}
