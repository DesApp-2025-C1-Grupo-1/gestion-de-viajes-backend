import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateViajeDto } from './dto/create-viaje.dto';
import { UpdateViajeDto } from './dto/update-viaje.dto';
import { Viaje, ViajeDocument } from './schemas/viaje.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Chofer, ChoferDocument } from 'src/chofer/schemas/chofer.schema';
import { Model } from 'mongoose';
import { Empresa, EmpresaDocument } from 'src/empresa/schemas/empresa.schema';
import {
  Vehiculo,
  VehiculoDocument,
} from 'src/vehiculo/schemas/vehiculo.schema';
import {
  Deposito,
  DepositoDocument,
} from 'src/deposito/Schemas/deposito.schema';

@Injectable()
export class ViajeService {
  constructor(
    @InjectModel(Viaje.name) private viajeModel: Model<ViajeDocument>,
    @InjectModel(Deposito.name) private depositoModel: Model<DepositoDocument>,
    @InjectModel(Empresa.name) private empresaModel: Model<EmpresaDocument>,
    @InjectModel(Vehiculo.name) private vehiculoModel: Model<VehiculoDocument>,
    @InjectModel(Chofer.name) private choferModel: Model<ChoferDocument>,
  ) {}

  async create(createViajeDto: CreateViajeDto): Promise<Viaje> {
    const { deposito_origen, fecha_inicio, chofer, vehiculo, empresa } =
      createViajeDto;

    //Validar que no exista un viaje con los mismos datos
    const viajeExistente = await this.viajeModel.findOne({
      deposito_origen,
      fecha_inicio,
      chofer,
    });
    if (viajeExistente) {
      throw new ConflictException('Ya existe un Viaje con esos datos');
    }

    //Validar que chofer y vehiculo tengan el mismo id de empresa
    const vehiculoEncontrado = await this.vehiculoModel.findById(vehiculo);
    const choferEncontrado = await this.choferModel.findById(chofer);
    const empresaEncontrada = await this.empresaModel.findById(empresa);

    if (!vehiculoEncontrado) {
      throw new NotFoundException('El vehículo no existe');
    } else if (!choferEncontrado) {
      throw new NotFoundException('El chofer no existe');
    } else if (!empresaEncontrada) {
      throw new NotFoundException('La empresa no existe');
    }

    if (vehiculoEncontrado.empresa.toString() !== empresa.toString()) {
      throw new ConflictException(
        'El vehículo no pertenece a la misma empresa que el viaje',
      );

      // Este if da error, pero al testearno funciona sin problemas, lo raro es que el if anterior es igual y no da error.
      // desactivo el error por ahora
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
    } else if (choferEncontrado.empresa.toString() !== empresa.toString()) {
      throw new ConflictException(
        'El chofer no pertenece a la misma empresa que el viaje',
      );
    }

    const createdViaje = new this.viajeModel(createViajeDto);
    return createdViaje.save();
  }

  findAll() {
    return `This action returns all viaje`;
  }

  findOne(id: number) {
    return `This action returns a #${id} viaje`;
  }

  update(id: number, updateViajeDto: UpdateViajeDto) {
    return `This action updates a #${id} viaje`;
  }

  remove(id: number) {
    return `This action removes a #${id} viaje`;
  }
}
