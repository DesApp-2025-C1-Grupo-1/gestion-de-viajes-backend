import { BadRequestException } from '@nestjs/common';

const licenciasCompatiblesMap: { [key: string]: string[] } = {
  'A1.1': ['A1.1'],
  'A1.2': ['A1.2', 'A1.1'],
  'A1.3': ['A1.3', 'A1.2', 'A1.1'],
  'A1.4': ['A1.4', 'A1.3', 'A1.2', 'A1.1'],

  'A2.1': ['A2.1'],
  'A2.2': ['A2.2', 'A2.1'],

  A3: ['A3'],

  B1: ['B1', 'A3'],
  B2: ['B2', 'B1'],

  C1: ['C1', 'B1'],
  C2: ['C2', 'C1', 'B1'],
  C3: ['C3', 'C2', 'C1', 'B1'],

  D1: ['D1', 'B1'],
  D2: ['D2', 'D1', 'B1'],
  D3: ['D3', 'D2', 'D1', 'B1'],

  E1: ['E1', 'B2', 'C1', 'C2', 'C3'],
  E2: ['E2'],

  F: ['F'],
  G1: ['G1'],
  G2: ['G2'],
};

export function getLicenciasCompatibles(tipoLicencia: string): string[] {
  const licenciasCompatibles = licenciasCompatiblesMap[tipoLicencia];

  if (!licenciasCompatibles) {
    console.warn(
      `Tipo de licencia de chofer '${tipoLicencia}' no encontrado en el mapa de compatibilidad.`,
    );
    return [tipoLicencia];
  }
  return licenciasCompatibles;
}

export function validateLicenseCompatibility(
  tipoLicencia: string,
  vehicleRequiredLicenses: string[],
): boolean {
  if (
    !tipoLicencia ||
    !vehicleRequiredLicenses ||
    vehicleRequiredLicenses.length === 0
  ) {
    if (vehicleRequiredLicenses.length === 0) return true;
    throw new BadRequestException(
      'Faltan datos de licencia para la validación.',
    );
  }

  const driverCanDriveLicenses = getLicenciasCompatibles(tipoLicencia);
  const esCompatible = driverCanDriveLicenses.some((license) =>
    vehicleRequiredLicenses.includes(license),
  );

  return esCompatible;
}
