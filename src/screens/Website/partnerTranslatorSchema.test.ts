import { partnerTranslatorSchema } from './partnerTranslatorSchema';

describe('partnerTranslatorSchema', () => {
  const valid = {
    name: 'Ada',
    surname: 'Okafor',
    birthDay: '12',
    birthMonth: '06',
    birthYear: '1995',
    contact: '2348012345678',
    email: 'ada@example.com',
    language1: 'Igbo',
    language2: '',
  };

  it('accepts a complete translator application', () => {
    expect(partnerTranslatorSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects missing required fields', () => {
    const result = partnerTranslatorSchema.safeParse({ ...valid, email: '' });
    expect(result.success).toBe(false);
  });
});
