export class Address {
  id?: string;
  street: string;
  city: string;
  zip: string;

  constructor(street: string, city: string, zip: string, id?: string) {
    this.id = id;
    this.street = street;
    this.city = city;
    this.zip = zip;
  }

  getFullAddress(): string {
    return `${this.street}, ${this.city}, ${this.zip}`;
  }
}
