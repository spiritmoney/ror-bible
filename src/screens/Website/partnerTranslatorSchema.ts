import { z } from 'zod';

const phoneDigits = (value: string) => value.replace(/\D/g, '');

const monthValues = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

export const partnerTranslatorSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required'),
    surname: z.string().trim().min(1, 'Surname is required'),
    birthDay: z.string().min(1, 'Select day'),
    birthMonth: z.string().min(1, 'Select month').refine((m) => monthValues.includes(m), {
      message: 'Select month',
    }),
    birthYear: z.string().min(1, 'Select year'),
    contact: z
      .string()
      .trim()
      .min(1, 'Contact is required')
      .refine((val) => phoneDigits(val).length >= 8, {
        message: 'Enter a valid phone number',
      }),
    email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
    language1: z.string().min(1, 'Select a language'),
    language2: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const day = Number(data.birthDay);
    const month = Number(data.birthMonth);
    const year = Number(data.birthYear);
    const dob = new Date(year, month - 1, day);
    if (
      dob.getFullYear() !== year ||
      dob.getMonth() !== month - 1 ||
      dob.getDate() !== day
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Enter a valid date of birth',
        path: ['birthDay'],
      });
      return;
    }
    const ageMs = Date.now() - dob.getTime();
    const ageYears = ageMs / (365.25 * 24 * 60 * 60 * 1000);
    if (ageYears < 16) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'You must be at least 16 years old',
        path: ['birthYear'],
      });
    }
  });

export type PartnerTranslatorFormValues = z.infer<typeof partnerTranslatorSchema>;

export type PartnerTranslatorField = keyof PartnerTranslatorFormValues;

export const TRANSLATION_LANGUAGE_OPTIONS = [
  'English',
  'French',
  'Spanish',
  'Portuguese',
  'German',
  'Arabic',
  'Igbo',
  'Yoruba',
  'Hausa',
  'Zulu',
  'Swahili',
  'Hindi',
  'Mandarin',
  'Tagalog',
  'Other',
] as const;

export function buildDobOptions() {
  const now = new Date().getFullYear();
  const years: number[] = [];
  for (let y = now - 16; y >= now - 80; y -= 1) years.push(y);

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));

  return { years, months, days };
}
