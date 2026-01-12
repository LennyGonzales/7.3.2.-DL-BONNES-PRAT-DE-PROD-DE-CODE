import { Address } from '../../domain/address';

export interface AddressRepositoryPort {
  findAll(): Promise<Address[]>;
  findById(id: string): Promise<Address | null>;
  save(address: Omit<Address, 'id'>): Promise<Address>;
}