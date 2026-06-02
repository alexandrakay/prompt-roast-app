import { saveRoast } from '../app/actions';

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  serverTimestamp: jest.fn(() => 12345),
}));

jest.mock('../lib/firebase', () => ({ db: {} }));

const { addDoc, collection } = jest.requireMock('firebase/firestore');

const mockResult = {
  roast: 'Brutal critique.',
  charges: ['✗ Vague: No context.'],
  fixed: 'A better prompt.',
};

describe('saveRoast', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    addDoc.mockResolvedValue({ id: 'abc123' });
    collection.mockReturnValue('roasts-ref');
  });

  it('saves a roast document and returns the id', async () => {
    const id = await saveRoast('original prompt', mockResult, null);
    expect(id).toBe('abc123');
    expect(addDoc).toHaveBeenCalledWith(
      'roasts-ref',
      expect.objectContaining({
        userId: null,
        originalPrompt: 'original prompt',
        roast: mockResult.roast,
        charges: mockResult.charges,
        fixed: mockResult.fixed,
      })
    );
  });

  it('saves with userId when signed in', async () => {
    await saveRoast('my prompt', mockResult, 'user-42');
    expect(addDoc).toHaveBeenCalledWith(
      'roasts-ref',
      expect.objectContaining({ userId: 'user-42' })
    );
  });
});
