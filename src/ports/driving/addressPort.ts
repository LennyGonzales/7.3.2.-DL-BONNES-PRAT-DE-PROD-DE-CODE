import { Address } from '../../domain/address';

export interface AddressPort {
  listAddresses(): Promise<Address[]>;
  getAddress(id: string): Promise<Address | null>;
  createAddress(input: Omit<Address, 'id'>): Promise<Address>;
}