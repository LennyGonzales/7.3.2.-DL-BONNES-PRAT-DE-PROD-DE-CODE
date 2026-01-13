import { Address, createAddressDTO } from '../../domain/address';

export interface AddressPort {
  listAddresses(): Promise<Address[]>;
  getAddress(id: string): Promise<Address | null>;
  createAddress(input: createAddressDTO): Promise<Address>;
}