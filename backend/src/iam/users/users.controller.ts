import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from './enums/role.enum';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async create(@Body() createUserDto: any, @Request() req: any) {
    // Apenas ADMIN e SUPER_ADMIN podem criar novos usuários
    if (req.user.role !== Role.ADMIN && req.user.role !== Role.SUPER_ADMIN) {
      throw new ForbiddenException(
        'Apenas administradores podem criar usuários',
      );
    }

    // Se for ADMIN, só pode criar usuários para sua própria empresa
    if (
      req.user.role === Role.ADMIN &&
      createUserDto.company_id !== req.user.company_id
    ) {
      throw new ForbiddenException(
        'Você pode apenas criar usuários em sua empresa',
      );
    }

    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(@Request() req: any) {
    // Se for ADMIN, retorna apenas usuários da sua empresa
    if (req.user.role === Role.ADMIN) {
      return this.usersService.findByCompanyId(req.user.company_id);
    }
    // SUPER_ADMIN vê todos
    return this.usersService.findAll();
  }

  @Get('me')
  async me(@Request() req: any) {
    const user = await this.usersService.findOne(req.user.userId);
    const { password_hash, ...result } = user;
    return result;
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    const user = await this.usersService.findOne(+id);

    // Se for ADMIN, só pode ver usuários da sua empresa
    if (
      req.user.role === Role.ADMIN &&
      user.company_id !== req.user.company_id
    ) {
      throw new ForbiddenException(
        'Você não tem permissão para ver este usuário',
      );
    }

    const { password_hash, ...result } = user;
    return result;
  }
}
