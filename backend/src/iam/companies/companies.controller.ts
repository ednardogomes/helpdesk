import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateCompanyDto } from './dto/create-company.dto';
import { RegisterCompanyWithAdminDto } from './dto/register-company-with-admin.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) { }

  @Post('register')
  registerCompany(@Body() registerDto: RegisterCompanyWithAdminDto) {
    // Rota PÚBLICA - sem guard
    return this.companiesService.registerCompanyWithAdmin(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.companiesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: CreateCompanyDto) {
    return this.companiesService.update(+id, updateCompanyDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companiesService.remove(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/assign-modules')
  assignAllModules(@Param('id') id: string) {
    return this.companiesService.assignAllModulesToCompany(+id);
  }
}
