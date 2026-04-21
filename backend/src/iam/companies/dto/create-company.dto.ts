import {
    IsNotEmpty,
    IsString,
    Length,
    IsBoolean,
    IsOptional,
    Matches,
} from 'class-validator';

export class CreateCompanyDto {
    @IsString()
    @IsNotEmpty({ message: 'O nome da empresa é obrigatório.' })
    @Length(2, 255, { message: 'O nome deve ter entre 2 e 255 caracteres.' })
    name: string;

    @IsString()
    @IsNotEmpty({ message: 'O CNPJ é obrigatório.' })
    @Length(14, 14, { message: 'O CNPJ deve ter exatamente 14 dígitos.' })
    @Matches(/^\d{14}$/, { message: 'O CNPJ deve conter apenas números.' })
    cnpj: string;

    @IsBoolean()
    @IsOptional()
    is_active?: boolean;
}
