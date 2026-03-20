import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'server', 'data');

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {}
}

export class JsonStore<T extends { id: string }> {
  private filename: string;
  private data: T[] = [];
  private loaded = false;

  constructor(filename: string) {
    this.filename = path.join(DATA_DIR, filename);
  }

  private async load() {
    if (this.loaded) return;
    try {
      const content = await fs.readFile(this.filename, 'utf-8');
      this.data = JSON.parse(content);
    } catch {
      this.data = [];
    }
    this.loaded = true;
  }

  private async save() {
    await ensureDataDir();
    await fs.writeFile(this.filename, JSON.stringify(this.data, null, 2));
  }

  async findAll(): Promise<T[]> {
    await this.load();
    return [...this.data];
  }

  async findById(id: string): Promise<T | undefined> {
    await this.load();
    return this.data.find((item) => item.id === id);
  }

  async create(item: T): Promise<T> {
    await this.load();
    this.data.push(item);
    await this.save();
    return item;
  }

  async update(id: string, updates: Partial<T>): Promise<T | undefined> {
    await this.load();
    const index = this.data.findIndex((item) => item.id === id);
    if (index === -1) return undefined;
    this.data[index] = { ...this.data[index], ...updates };
    await this.save();
    return this.data[index];
  }

  async delete(id: string): Promise<boolean> {
    await this.load();
    const index = this.data.findIndex((item) => item.id === id);
    if (index === -1) return false;
    this.data.splice(index, 1);
    await this.save();
    return true;
  }
}
