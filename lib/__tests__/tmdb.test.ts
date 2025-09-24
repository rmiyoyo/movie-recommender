import { getFilms, getFilmInfo, getTrendingFilms } from '../tmdb';

global.fetch = jest.fn();

describe('TMDB API', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('fetches films successfully', async () => {
    const mockResponse = {
      page: 1,
      results: [],
      total_pages: 1,
      total_results: 0
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await getFilms({});
    
    expect(fetch).toHaveBeenCalledWith(
      'https://api.themoviedb.org/3/discover/movie?page=1&sort_by=popularity.desc',
      { headers: expect.any(Object) }
    );
    expect(result).toEqual(mockResponse);
  });

  it('handles fetch error', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    await expect(getFilms({})).rejects.toThrow('Failed to fetch films');
  });
});