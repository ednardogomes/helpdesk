import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
    Matches,
} from 'class-validator';

export class RegisterCompanyWithAdminDto {
    // --- Dados da Empresa ---

    @IsString()
    @IsNotEmpty({ message: 'O nome da empresa é obrigatório' })
    companyName: string;

    @IsString()
    @IsNotEmpty({ message: 'O CNPJ é obrigatório' })
    // Regex simples para CNPJ (apenas números ou formatado)
    @Matches(/^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}\-?\d{2}$/, {
        message: 'CNPJ em formato inválido',
    })
    cnpj: string;

    // --- Dados do Usuário Administrador ---

    @IsString()
    @IsNotEmpty({ message: 'O nome completo é obrigatório' })
    fullName: string;

    @IsEmail({}, { message: 'E-mail inválido' })
    @IsNotEmpty({ message: 'O e-mail é obrigatório' })
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'A senha é obrigatória' })
    @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
    password: string;
}
