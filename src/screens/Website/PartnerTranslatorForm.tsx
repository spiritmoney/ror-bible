import React, { useId, useMemo, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
// @ts-ignore
import 'react-phone-input-2/lib/style.css';
// @ts-ignore
import './partnerPhoneInput.css';
import {
  buildDobOptions,
  partnerTranslatorSchema,
  TRANSLATION_LANGUAGE_OPTIONS,
  type PartnerTranslatorField,
} from './partnerTranslatorSchema';

const TRANSLATOR_TEXT =
  "ROR Bible+ staff makes the Bible App and the Bible App for Kids and Teenagers, but it's our extended team of world-class volunteers who serve our millions of users. When you use your gifts to help us connect people with God, you're not just watching God move through this historical spiritual revolution... you're actively participating in it.";

type FieldErrors = Partial<Record<PartnerTranslatorField, string>>;

const emptyForm = {
  name: '',
  surname: '',
  birthDay: '',
  birthMonth: '',
  birthYear: '',
  contact: '2348012345678',
  email: '',
  language1: '',
  language2: '',
};

function FieldWrap({
  label,
  error,
  className = '',
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`mkt-form-field ${className}`.trim()}>
      <span className="mkt-label">{label}</span>
      {children}
      {error ? (
        <span className="mkt-field-error" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}

export default function PartnerTranslatorForm() {
  const formId = useId();
  const { years, months, days } = useMemo(() => buildDobOptions(), []);
  const [values, setValues] = useState(emptyForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const setField = (field: PartnerTranslatorField, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
    setSuccess(false);
    setFormError('');
  };

  const inputClass = (field: PartnerTranslatorField) =>
    `mkt-input${errors[field] ? ' mkt-input--invalid' : ''}`;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
    setSuccess(false);

    const payload = {
      name: values.name,
      surname: values.surname,
      birthDay: values.birthDay,
      birthMonth: values.birthMonth,
      birthYear: values.birthYear,
      contact: values.contact,
      email: values.email,
      language1: values.language1,
      language2: values.language2 || undefined,
    };

    const parsed = partnerTranslatorSchema.safeParse(payload);
    if (!parsed.success) {
      const flattened = parsed.error.flatten().fieldErrors;
      const nextErrors: FieldErrors = {};
      (Object.keys(flattened) as PartnerTranslatorField[]).forEach((key) => {
        const msg = flattened[key]?.[0];
        if (msg) nextErrors[key] = msg;
      });
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      setSuccess(true);
      setValues(emptyForm);
    } catch {
      setFormError('Unable to submit your application right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="be_a_translator" className="mkt-form-card">
      <h2 className="mkt-band-title">Be a Translator</h2>
      <p className="mkt-body mkt-band-content">{TRANSLATOR_TEXT}</p>

      <p className="mkt-kicker mkt-kicker--spaced">Translator details</p>

      {success ? (
        <p className="mkt-form-success" role="status">
          Thank you. Your translator application has been received.
        </p>
      ) : null}

      {formError ? (
        <p className="mkt-form-error" role="alert">
          {formError}
        </p>
      ) : null}

      <form
        id={formId}
        className="mkt-partner-form mt-4"
        onSubmit={handleSubmit}
        noValidate
      >
        <FieldWrap label="Name" error={errors.name}>
          <input
            id={`${formId}-name`}
            className={inputClass('name')}
            type="text"
            name="translator-name"
            autoComplete="given-name"
            aria-label="Name"
            value={values.name}
            onChange={(e) => setField('name', e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${formId}-name-error` : undefined}
          />
        </FieldWrap>

        <FieldWrap label="Surname" error={errors.surname}>
          <input
            id={`${formId}-surname`}
            className={inputClass('surname')}
            type="text"
            name="translator-surname"
            autoComplete="family-name"
            aria-label="Surname"
            value={values.surname}
            onChange={(e) => setField('surname', e.target.value)}
            aria-invalid={Boolean(errors.surname)}
          />
        </FieldWrap>

        <FieldWrap
          label="Date of Birth"
          error={errors.birthDay || errors.birthMonth || errors.birthYear}
          className="mkt-form-field--dob"
        >
          <div className="mkt-dob-grid">
            <select
              id={`${formId}-dob-day`}
              className={`${inputClass('birthDay')} mkt-dob-select`}
              aria-label="Birth day"
              value={values.birthDay}
              onChange={(e) => setField('birthDay', e.target.value)}
            >
              <option value="">Day</option>
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <select
              className={`${inputClass('birthMonth')} mkt-dob-select`}
              aria-label="Birth month"
              value={values.birthMonth}
              onChange={(e) => setField('birthMonth', e.target.value)}
            >
              <option value="">Month</option>
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <select
              className={`${inputClass('birthYear')} mkt-dob-select`}
              aria-label="Birth year"
              value={values.birthYear}
              onChange={(e) => setField('birthYear', e.target.value)}
            >
              <option value="">Year</option>
              {years.map((year) => (
                <option key={year} value={String(year)}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </FieldWrap>

        <FieldWrap label="Contact" error={errors.contact}>
          <PhoneInput
            country="ng"
            value={values.contact}
            onChange={(value) => setField('contact', value)}
            enableSearch
            disableSearchIcon
            countryCodeEditable={false}
            containerClass={`partner-phone-input${errors.contact ? ' partner-phone-input--invalid' : ''}`}
            inputClass="partner-phone-input__field"
            buttonClass="partner-phone-input__button"
            dropdownClass="partner-phone-input__dropdown"
            searchClass="partner-phone-input__search"
            inputProps={{
              name: 'translator-contact',
              id: `${formId}-contact`,
              'aria-invalid': Boolean(errors.contact),
            }}
          />
        </FieldWrap>

        <FieldWrap label="Email" error={errors.email} className="mkt-form-field--full">
          <input
            id={`${formId}-email`}
            className={inputClass('email')}
            type="email"
            name="translator-email"
            autoComplete="email"
            aria-label="Email"
            value={values.email}
            onChange={(e) => setField('email', e.target.value)}
            aria-invalid={Boolean(errors.email)}
          />
        </FieldWrap>

        <FieldWrap label="Language to Translate 1" error={errors.language1}>
          <select
            id={`${formId}-lang1`}
            className={inputClass('language1')}
            name="language-1"
            aria-label="Language to Translate 1"
            value={values.language1}
            onChange={(e) => setField('language1', e.target.value)}
          >
            <option value="">Select language</option>
            {TRANSLATION_LANGUAGE_OPTIONS.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </FieldWrap>

        <FieldWrap label="Language to Translate 2 (Optional)" error={errors.language2}>
          <select
            id={`${formId}-lang2`}
            className={inputClass('language2')}
            name="language-2"
            value={values.language2}
            onChange={(e) => setField('language2', e.target.value)}
          >
            <option value="">Select language (optional)</option>
            {TRANSLATION_LANGUAGE_OPTIONS.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </FieldWrap>

        <div className="mkt-form-field--full mkt-form-actions">
          <button type="submit" className="mkt-btn-give" disabled={submitting}>
            {submitting ? 'SUBMITTING...' : 'SUBMIT'}
          </button>
        </div>
      </form>
    </div>
  );
}
