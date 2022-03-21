import { render, RenderResult } from '@testing-library/react';
import { Link } from './link';

let documentBody: RenderResult;

const CONFIG = {
  text: 'TEST',
};

describe('<Link />', () => {
  beforeEach(() => {
    documentBody = render(<Link href="#">{CONFIG.text}</Link>);
  });
  it('shows text in link', () => {
    expect(documentBody.getByText(`${CONFIG.text}`)).toBeInTheDocument();
  });
});
