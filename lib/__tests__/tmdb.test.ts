import { getFilms } from '../tmdb';

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('TMDB API', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('fetches films successfully', async () => {
    const mockResponse = {
      page: 1,
      results: [],
      total_pages: 1,
      total_results: 0
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await getFilms({});
    
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.themoviedb.org/3/discover/movie?page=1&sort_by=popularity.desc',
      { headers: expect.any(Object) }
    );
    expect(result).toEqual(mockResponse);
  });

  it('handles fetch error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
    });

    await expect(getFilms({})).rejects.toThrow('Failed to fetch films');
  });
});