export class Address {
  id?: string;
  street: string;
  city: string;
  zip: number;

  constructor(street: string, city: string, zip: number, id?: string) {
    this.id = id;
    this.street = street;
    this.city = city;
    this.zip = zip;
  }

  getFullAddress(): string {
    return `${this.street}, ${this.city}, ${this.zip}`;
  }
}
