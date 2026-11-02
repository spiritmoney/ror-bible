import { Blot } from 'parchment/dist/src/blot/abstract/blot';
import {
  Sources,
  StringMap,
  TextChangeHandler,
  SelectionChangeHandler,
  EditorChangeHandler,
  KeyboardStatic,
  ClipboardStatic,
  BoundsStatic,
  DeltaStatic,
  RangeStatic,
  EventEmitter,
  Quill,
} from '../../node_modules/@types/quill/index.js';
export interface IQuill {
  root: HTMLDivElement;
  clipboard: ClipboardStatic;
  scroll: Blot;
  keyboard: KeyboardStatic;
  deleteText(index: number, length: number, source?: Sources): DeltaStatic;
  disable(): void;
  enable(enabled?: boolean): void;
  getContents(index?: number, length?: number): DeltaStatic;
  getLength(): number;
  getText(index?: number, length?: number): string;
  insertEmbed(
    index: number,
    type: string,
    value: any,
    source?: Sources
  ): DeltaStatic;
  insertText(index: number, text: string, source?: Sources): DeltaStatic;
  insertText(
    index: number,
    text: string,
    format: string,
    value: any,
    source?: Sources
  ): DeltaStatic;
  insertText(
    index: number,
    text: string,
    formats: StringMap,
    source?: Sources
  ): DeltaStatic;
  /**
   * @deprecated Remove in 2.0. Use clipboard.dangerouslyPasteHTML(index: number, html: string, source: Sources)
   */
  pasteHTML(index: number, html: string, source?: Sources): string;
  /**
   * @deprecated Remove in 2.0. Use clipboard.dangerouslyPasteHTML(html: string, source: Sources): void;
   */
  pasteHTML(html: string, source?: Sources): string;
  setContents(delta: DeltaStatic, source?: Sources): DeltaStatic;
  setText(text: string, source?: Sources): DeltaStatic;
  update(source?: Sources): void;
  updateContents(delta: DeltaStatic, source?: Sources): DeltaStatic;

  format(name: string, value: any, source?: Sources): DeltaStatic;
  formatLine(index: number, length: number, source?: Sources): DeltaStatic;
  formatLine(
    index: number,
    length: number,
    format: string,
    value: any,
    source?: Sources
  ): DeltaStatic;
  formatLine(
    index: number,
    length: number,
    formats: StringMap,
    source?: Sources
  ): DeltaStatic;
  formatText(index: number, length: number, source?: Sources): DeltaStatic;
  formatText(
    index: number,
    length: number,
    format: string,
    value: any,
    source?: Sources
  ): DeltaStatic;
  formatText(
    index: number,
    length: number,
    formats: StringMap,
    source?: Sources
  ): DeltaStatic;
  formatText(
    range: RangeStatic,
    format: string,
    value: any,
    source?: Sources
  ): DeltaStatic;
  formatText(
    range: RangeStatic,
    formats: StringMap,
    source?: Sources
  ): DeltaStatic;
  getFormat(range?: RangeStatic): StringMap;
  getFormat(index: number, length?: number): StringMap;
  removeFormat(index: number, length: number, source?: Sources): DeltaStatic;

  blur(): void;
  focus(): void;
  getBounds(index: number, length?: number): BoundsStatic;
  getSelection(focus: true): RangeStatic;
  getSelection(focus?: false): RangeStatic | null;
  hasFocus(): boolean;
  setSelection(index: number, length: number, source?: Sources): void;
  setSelection(range: RangeStatic, source?: Sources): void;

  // static methods: debug, import, register, find

  addContainer(classNameOrDomNode: string | Node, refNode?: Node): any;
  getModule(name: string): any;

  // Blot interface is not exported on Parchment
  getIndex(blot: any): number;
  getLeaf(index: number): any;
  getLine(index: number): [any, number];
  getLines(index?: number, length?: number): any[];
  getLines(range: RangeStatic): any[];

  // EventEmitter methods
  on(eventName: 'text-change', handler: TextChangeHandler): EventEmitter;
  on(
    eventName: 'selection-change',
    handler: SelectionChangeHandler
  ): EventEmitter;
  on(eventName: 'editor-change', handler: EditorChangeHandler): EventEmitter;
  once(eventName: 'text-change', handler: TextChangeHandler): EventEmitter;
  once(
    eventName: 'selection-change',
    handler: SelectionChangeHandler
  ): EventEmitter;
  once(eventName: 'editor-change', handler: EditorChangeHandler): EventEmitter;
  off(eventName: 'text-change', handler: TextChangeHandler): EventEmitter;
  off(
    eventName: 'selection-change',
    handler: SelectionChangeHandler
  ): EventEmitter;
  off(eventName: 'editor-change', handler: EditorChangeHandler): EventEmitter;
}
