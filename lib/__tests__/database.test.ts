import { getFavorites, checkIfFavorite, addFavorite, removeFavorite } from '../database';

jest.mock('appwrite', () => ({
  Client: jest.fn().mockImplementation(() => ({
    setEndpoint: jest.fn().mockReturnThis(),
    setProject: jest.fn().mockReturnThis(),
  })),
  Databases: jest.fn().mockImplementation(() => ({
    listDocuments: jest.fn(),
    createDocument: jest.fn(),
    updateDocument: jest.fn(),
    deleteDocument: jest.fn(),
  })),
  ID: {
    unique: jest.fn(() => 'unique-id'),
  },
  Query: {
    equal: jest.fn(),
    orderDesc: jest.fn(),
    limit: jest.fn(),
  },
}));

describe('Database functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('gets favorites for user', async () => {
    const { Databases, Query } = require('appwrite');
    const mockListDocuments = Databases.mock.results[0].value.listDocuments;
    
    const mockFavorites = [{ $id: '1', filmId: 1, title: 'Test Movie' }];
    mockListDocuments.mockResolvedValueOnce({ documents: mockFavorites });

    const result = await getFavorites('test@example.com');
    
    expect(mockListDocuments).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      [Query.equal('userEmail', 'test@example.com')]
    );
    expect(result).toEqual(mockFavorites);
  });
});