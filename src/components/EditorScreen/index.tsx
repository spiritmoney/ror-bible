import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';
import {
  footerHeightAtom,
  headerHeightAtom,
  workspaceHeaderHeightAtom,
} from '../../store/atoms/size';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { documentNotFound, editorFormats, editorModules } from './config';
import './styles.scss';
import {
  projectAtom,
  editorSelectedAtom,
  editorUserCursorPositionAtom,
} from '../../store/atoms/workspace';
import { IProject } from 'interface/project';
import useContextMenu from '../../hooks/useContextMenu';
import clsx from 'clsx';
import { DarkThemeAtom } from 'store/atoms/general';
import { useUser } from 'hooks/useUser';

export interface IEditorScreen {
  setQuill: React.Dispatch<any>;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  quill: any;
  selected: string;
  setAnchor: React.Dispatch<
    React.SetStateAction<{
      x: number;
      y: number;
    }>
  >;
  setShowContext: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditorScreen: React.FunctionComponent<IEditorScreen> = ({
  quill,
  setQuill,
  selected,
  setSelected,
  setAnchor,
  setShowContext,
}) => {
  const footerHeight = useRecoilValue(footerHeightAtom);
  const headerHeight = useRecoilValue(headerHeightAtom);
  const workspaceHeaderHeight = useRecoilValue(workspaceHeaderHeightAtom);
  const [defaultHtml, setDefaultHtml] = useState('');
  const [project, setProject] = useRecoilState<IProject>(projectAtom);
  const setSelectedState = useSetRecoilState(editorSelectedAtom);
  const setCursorPosition = useSetRecoilState(editorUserCursorPositionAtom);
  const editorRef = useRef<any>();
  const DarkTheme = useRecoilValue(DarkThemeAtom);
  const { user } = useUser();

  const ref = useRef<any>();


  const {
    anchorPoint,
    show,
    isEditorDisabled,
    setIsEditorDisabled,
    setShowCopyModal,
  } = useContextMenu(ref);

  useEffect(() => {
    setShowContext(show);
    setAnchor(anchorPoint);
  }, [show, anchorPoint, setShowContext, setAnchor]);

  useEffect(() => {
    if (!project) {
      setDefaultHtml(documentNotFound);
      quill && quill.disable();
      setIsEditorDisabled(true);
      return;
    }
// This condition is to allow only owner of project or collaborator to write, else read-only. 
    if (project?.userId !== user?.id && quill?.disable && project.originalOwner !== user?.id ) {
      // quill.disable();
      setIsEditorDisabled(true);

      if (
        project.to.includes(user.id!) &&
        !project.hasMadeDuplicate?.includes(user.id!)
      ) {
        setShowCopyModal(true);
      } else {
        console.log('here')
        setShowCopyModal(false);
      }
      return;
    }

    quill && quill.enable && quill.enable();
    setIsEditorDisabled(false);
    setShowCopyModal(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, quill, user.id]);

  useEffect(() => {
    if (!editorRef.current) return;

    setQuill(editorRef.current.getEditor());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quill, project, editorRef.current]);

  const getQuillData = async (
    content: any,
    delta: any,
    source: any,
    editor: any
  ) => {
    if (!quill) return setQuill(editor);
    if (source !== 'user') return;
    if (!project.id) return;
    setProject(prev => {
      return {
        ...prev,
        html: content,
      };
    });

  };

  return (
    <article
      style={{
        minHeight: `calc(100vh - ${
          footerHeight + headerHeight + workspaceHeaderHeight
        }px)`,
        maxHeight: `calc(100vh - ${
          footerHeight + headerHeight + workspaceHeaderHeight
        }px)`,
      }}
      className="w-full scroll-auto relative"
      ref={isEditorDisabled ? undefined : ref}
    >
      <ReactQuill
        className={clsx('editor', {
          'darkTheme bg-[#071723] border-[#0F2230] text-[#EDF1F3]':
            DarkTheme === true,
        })}
        value={project?.html || defaultHtml}
        formats={editorFormats}
        modules={editorModules}
        onChange={getQuillData}
        ref={editorRef}
        style={{
          height: `calc(100vh - ${
            footerHeight + headerHeight + workspaceHeaderHeight
          }px)`,
        }}
        onChangeSelection={(selection, source) => {
          if (source === 'user') {
            quill &&
              setSelectedState({
                index: selection?.index,
                length: selection?.length,
                value: JSON.stringify(
                  quill.getContents(selection?.index, selection?.length).ops
                ),
              });
          }
        }}
        onBlur={(prevSelection, source) => {
          setSelectedState((prev: any) => ({
            ...prev,
            index: prevSelection?.index,
            length: prevSelection?.length,
          }));
          setCursorPosition(prevSelection?.index);
        }}
        onFocus={(prevSelection, source, editor) => {
          setCursorPosition(prevSelection?.index);
        }}
      />
    </article>
  );
};

export default EditorScreen;
