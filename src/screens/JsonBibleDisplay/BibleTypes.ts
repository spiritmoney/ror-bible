export interface BibleData {
  _declaration: {
    _attributes: {
      version: string;
      encoding: string;
    };
  };
  book: {
    will: {
      _text: string;
      name: Book[
      ];
    };
  };
}

interface Book {
  _attributes: {
    id: string;
  };
  _text: string;
  chapters?: {
    chapter: Chapter[];
  };
}

interface Chapter {
  _attributes: {
    id: string;
  };
  verse: Verse[];
}

interface Verse {
  _attributes?: {
    id?: string;
    cid?: string;
    bid?: string;
  };
  _text?: string | string[]; // Allow _text to be a string or an array of strings
  book?: {
    _text: string;
  };
  img?: Img | Img[]; // Allow img to be either an object or an array of Img objects
  chap?: {
    _text: string;
  };
  num?: {
    _attributes: {
      id: string;
    };
    _text: string;
  };
  ref?: Reference[]; 
  st?: { _text: string }[]; 
  woc?: {
    _text?: string | string[]; // Words of Christ
    st?: { _text: string }[]; // Strong's codes inside woc (if any)
    ref?: {
      _attributes?: { id?: string }; // Reference ID inside woc
      _text?: string;
    };
  };
}


interface Img {
  _attributes: {
    src: string;
    width?: string;
    height?: string;
  };
}
interface Reference {
  _attributes: {
    id: string;
  };
  _text: string;
}
