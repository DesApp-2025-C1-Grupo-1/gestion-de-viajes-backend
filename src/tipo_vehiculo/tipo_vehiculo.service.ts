import { Injectable } from '@nestjs/common';
import { CreateTipoVehiculoDto } from './dto/create-tipo_vehiculo.dto';
import { UpdateTipoVehiculoDto } from './dto/update-tipo_vehiculo.dto';

@Injectable()
export class TipoVehiculoService {
  create(createTipoVehiculoDto: CreateTipoVehiculoDto) {
    return 'This action adds a new tipoVehiculo';
  }

  findAll() {
    return `This action returns all tipoVehiculo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tipoVehiculo`;
  }

  update(id: number, updateTipoVehiculoDto: UpdateTipoVehiculoDto) {
    return `This action updates a #${id} tipoVehiculo`;
  }

  remove(id: number) {
    return `This action removes a #${id} tipoVehiculo`;
  }
}
