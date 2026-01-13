import { Address, createAddressDTO } from '../../domain/address';
import { AddressRepositoryPort } from '../../ports/driven/addressRepositoryPort';
import { v4 as uuidv4 } from 'uuid';

export class InMemoryAddressRepo implements AddressRepositoryPort {
  constructor(private readonly store: Address[] = []) {}

  async findAll(): Promise<Address[]> {
    return this.store.slice();
  }

  async findById(id: string): Promise<Address | null> {
    const found = this.store.find((s) => s.id === id);
    return found ?? null;
  }

  async save(address: createAddressDTO): Promise<Address> {
    const uuid = uuidv4();
    const newAddress: Address = new Address(address.street, address.city, address.zip, uuid);
    this.store.push(newAddress);
    return newAddress;
  }
}
