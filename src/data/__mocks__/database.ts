// Mock pour database.ts utilisé par Jest
export const mockDB = {
  userProfile: {
    get: jest.fn(),
    add: jest.fn(),
    put: jest.fn(),
    update: jest.fn(),
    clear: jest.fn(),
    toArray: jest.fn().mockResolvedValue([])
  },
  stock: {
    toArray: jest.fn().mockResolvedValue([])
  },
  recipes: {
    toArray: jest.fn().mockResolvedValue([])
  },
  planning: {
    toArray: jest.fn().mockResolvedValue([])
  },
  transaction: jest.fn().mockImplementation((mode, tables, callback) => {
    return callback();
  }),
  delete: jest.fn(),
  open: jest.fn()
};

// Export par défaut
export const db = mockDB;

// Export des types pour la compatibilité
export const UserProfile = {};
