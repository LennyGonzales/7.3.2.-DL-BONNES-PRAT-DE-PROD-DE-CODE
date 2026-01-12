import { AddressService } from './addressService';
import { Address } from '../domain/address';

describe('AddressService', () => {
  let mockRepo: {
    findAll: jest.Mock<Promise<Address[]>, []>;
    findById: jest.Mock<Promise<Address | null>, [string]>;
    save: jest.Mock<Promise<Address>, [Omit<Address, 'id'>]>;
  };
  let service: AddressService;

  beforeEach(() => {
    mockRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
    };
    service = new AddressService(mockRepo);
  });

  it('listAddresses retourne la liste fournie par le repo', async () => {
    const sample: Address[] = [new Address('Main', 'Town', 30100), new Address('Second', 'Village', 30200)];
    mockRepo.findAll.mockResolvedValue(sample);
    await expect(service.listAddresses()).resolves.toEqual(sample);
    expect(mockRepo.findAll).toHaveBeenCalledTimes(1);
  });

  it('getAddress retourne l\'adresse quand elle existe', async () => {
    const addr = new Address('Main','Town', 30100, '1');
    mockRepo.findById.mockResolvedValue(addr);
    await expect(service.getAddress('1')).resolves.toEqual(addr);
    expect(mockRepo.findById).toHaveBeenCalledWith('1');
  });

  it('getAddress retourne null quand l\'adresse est introuvable', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.getAddress('missing')).resolves.toBeNull();
    expect(mockRepo.findById).toHaveBeenCalledWith('missing');
  });

  it('createAddress appelle save et retourne l\'adresse créée', async () => {
    const input = new Address('New', 'City', 10100);
    const { street, city, zip } = input;
    const saved = new Address(street, city, zip, '2');
    mockRepo.save.mockResolvedValue(saved);
    await expect(service.createAddress(input)).resolves.toEqual(saved);
    expect(mockRepo.save).toHaveBeenCalledWith(input);
  });
});

