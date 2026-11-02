import React from 'react';
import f01 from '../../assets/website/new/feature-01-personalized-study.jpg';
import f02 from '../../assets/website/new/feature-02-solution-search.jpg';
import f03 from '../../assets/website/new/feature-03-audio-bible.jpg';
import f04 from '../../assets/website/new/feature-04-pulpit.jpg';
import f05 from '../../assets/website/new/feature-05-study-resources.jpg';
import f06 from '../../assets/website/new/feature-06-parallel-study.jpg';
import f07 from '../../assets/website/new/feature-07-study-utilities.jpg';
import f08 from '../../assets/website/new/feature-08-roar.jpg';
import f09 from '../../assets/website/new/feature-09-colour-search.jpg';
import f10 from '../../assets/website/new/feature-10-study-workspace.jpg';

export type WebsiteFeature = {
  id: string;
  num: string;
  label: string;
  title: React.ReactNode;
  description: string;
  bullets: string[];
  image: string;
  alt: string;
};

export const WEBSITE_FEATURES: WebsiteFeature[] = [
  {
    id: 'f1',
    num: '01',
    label: 'Personalized Study Experience',
    title: (
      <>
        Read. Study. Meditate. <span className="text-brand-orange">Triumph.</span>
      </>
    ),
    description: 'A beautifully personal space for Scripture, study and reflection.',
    bullets: [
      'Choose a reading layout that suits your study',
      'Adjust fonts, themes and display preferences',
      'Follow Scripture references in pop-up windows',
    ],
    image: f01,
    alt: 'ROR Bible+ Personalized Study Experience on iPhone',
  },
  {
    id: 'f2',
    num: '02',
    label: 'Solution Search',
    title: (
      <>
        Bring your questions to <span className="text-brand-orange">Scripture.</span>
      </>
    ),
    description: 'Explore with Student Agent or go deeper with Minister Agent.',
    bullets: [
      'Ask everyday questions in plain language',
      'Student Agent for guided Scripture-based study',
      'Minister Agent for deeper biblical research, with references and source context',
    ],
    image: f02,
    alt: 'ROR Bible+ Solution Search on iPhone',
  },
  {
    id: 'f3',
    num: '03',
    label: 'Personalized Audio Bible',
    title: (
      <>
        Hear the Word in <span className="text-brand-orange">Pastor Chris’s</span> voice.
      </>
    ),
    description: 'Listen to the ROR Audio Bible and explore audio commentaries.',
    bullets: [
      'The ROR Audio Bible in Pastor Chris’s voice',
      'Pastor Chris audio commentaries',
      'Read-to-Me and playback controls with verse follow',
    ],
    image: f03,
    alt: 'ROR Bible+ Audio Bible on iPhone',
  },
  {
    id: 'f4',
    num: '04',
    label: '@Pulpit',
    title: (
      <>
        From revelation to <span className="text-brand-orange">ministration.</span>
      </>
    ),
    description: 'Shape your study into a message with Scripture and personal notes.',
    bullets: [
      'A sermon preparation workspace',
      'Organize Scripture, personal notes and research',
      'Keep source context close to your message',
    ],
    image: f04,
    alt: 'ROR Bible+ @Pulpit on iPhone',
  },
  {
    id: 'f5',
    num: '05',
    label: 'Study Resources',
    title: (
      <>
        Discover the depth of <span className="text-brand-orange">every word.</span>
      </>
    ),
    description: 'Explore Hebrew and Greek with Strong’s and dictionary resources integrated with Scripture.',
    bullets: [
      'Hebrew Greek KJV Bible and dictionaries',
      'Enhanced Strong’s Concordance',
      'LoveWorld Concordance and study references',
    ],
    image: f05,
    alt: 'ROR Bible+ Study Resources on iPhone',
  },
  {
    id: 'f6',
    num: '06',
    label: 'Parallel Study',
    title: (
      <>
        See Scripture <span className="text-brand-orange">side by side.</span>
      </>
    ),
    description: 'Compare translations and follow the meaning in context.',
    bullets: [
      'Side-by-side Bible versions',
      'Split-view parallel study',
      'Cross-references in context',
    ],
    image: f06,
    alt: 'ROR Bible+ Parallel Study on iPhone',
  },
  {
    id: 'f7',
    num: '07',
    label: 'Study Utilities',
    title: (
      <>
        Keep every insight <span className="text-brand-orange">close.</span>
      </>
    ),
    description: 'Highlight precisely. Add notes. Record your reflections.',
    bullets: [
      'Precise highlighting and colour search',
      'Notes and voice notes',
      'Bookmarks synced across devices',
    ],
    image: f07,
    alt: 'ROR Bible+ Study Utilities on iPhone',
  },
  {
    id: 'f8',
    num: '08',
    label: 'ROAR Study Bible',
    title: (
      <>
        Go deeper with <span className="text-brand-orange">ROAR.</span>
      </>
    ),
    description: 'Explore Scripture-linked annotations from Rev. Chris Oyakhilome.',
    bullets: [
      'Rev. Chris Oyakhilome’s Annotated Reference Study Bible',
      'Scripture-linked annotations',
      'Integrated study resources',
    ],
    image: f08,
    alt: 'ROR Bible+ ROAR on iPhone',
  },
  {
    id: 'f9',
    num: '09',
    label: 'Colour Search',
    title: (
      <>
        Find it. Return to it. <span className="text-brand-orange">Study it.</span>
      </>
    ),
    description: 'Search and organize your study using colour-coded highlights.',
    bullets: [
      'Colour search across your highlights',
      'Return to passages quickly',
      'Study layouts for deep work',
    ],
    image: f09,
    alt: 'ROR Bible+ Colour Search on iPhone',
  },
  {
    id: 'f10',
    num: '10',
    label: 'Study Workspace',
    title: (
      <>
        Make room for the way <span className="text-brand-orange">you study.</span>
      </>
    ),
    description: 'A flexible workspace for reading, research and ministry preparation.',
    bullets: [
      'Personal study workspace',
      'Organize resources and notes',
      'Designed for readers, students and ministers',
    ],
    image: f10,
    alt: 'ROR Bible+ Study Workspace on iPhone',
  },
];
