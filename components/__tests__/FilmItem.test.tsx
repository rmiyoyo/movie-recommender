import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilmItem from '../FilmItem';
import { Film } from '@/types/interfaces';

const mockFilm: Film = {
  id: 1,
  title: 'Test Movie',
  poster_path: '/test-poster.jpg',
  vote_average: 8.5,
  release_date: '2023-01-01'
};

describe('FilmItem', () => {
  it('renders film information correctly', () => {
    render(<FilmItem {...mockFilm} />);
    
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByText('8.5')).toBeInTheDocument();
  });

  it('renders placeholder when poster_path is null', () => {
    const filmWithoutPoster = { ...mockFilm, poster_path: null };
    render(<FilmItem {...filmWithoutPoster} />);
    
    const image = screen.getByAltText('Test Movie');
    expect(image).toHaveAttribute('src', '/placeholder.svg');
  });
});