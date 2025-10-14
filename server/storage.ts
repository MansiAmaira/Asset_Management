// This file is not used in the current implementation
// The Express server acts as a proxy to the Spring Boot backend
// All data storage is handled by Spring Boot

export interface IStorage {
  // Placeholder interface for future use
}

export class MemStorage implements IStorage {
  constructor() {}
}

export const storage = new MemStorage();
