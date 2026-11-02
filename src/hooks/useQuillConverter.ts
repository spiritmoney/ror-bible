import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import Quill from 'quill';
//@ts-ignore
// import { convertHtmlToDelta } from 'node-quill-converter'

const useQuillConverter = () => {
  const convertQuillToHtml = (quillData: any) => {
    const converter = new QuillDeltaToHtmlConverter(quillData, {
      inlineStyles: true,
    });

    return converter.convert();
    
  };

  const convertHtmlToQuill = (html: string) => {
    const div = document.createElement('div');
    div.setAttribute('id', 'htmlToDelta');
    div.innerHTML = `<div id="quillEditor" style="display:none">${html}</div>`;
    document.body.appendChild(div);
    const quill = new Quill('#quillEditor', {
      theme: 'snow',
    });
    const delta = quill.getContents();
    document.getElementById('htmlToDelta')?.remove();
    return delta;
  };

  return { convertQuillToHtml, convertHtmlToQuill };
};

export default useQuillConverter;
