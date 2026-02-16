export class Product {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;

  constructor(data: Partial<Product> = {}) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.logo = data.logo || '';
    this.date_release = data.date_release || '';
    this.date_revision = data.date_revision || '';
  }

  static calculateRevisionDate(releaseDate: string): string {
    const date = new Date(releaseDate);
    date.setFullYear(date.getFullYear() + 1);
    return date.toISOString().split('T')[0];
  }

  // La fecha de revision debera ser de exactamente un 1 año
  isRevisionDateValid(): boolean {
    const expectedRevision = Product.calculateRevisionDate(this.date_release);
    return this.date_revision === expectedRevision;
  }
}
