import { PartialType } from '@nestjs/mapped-types';
import { CreateChoferDto } from './create-chofer.dto';

export class UpdateChoferDto extends PartialType(CreateChoferDto) {}
