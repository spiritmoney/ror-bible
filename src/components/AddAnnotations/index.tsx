/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
import { ReactComponent as Cancel } from 'assets/cancel.svg';
import { ReactComponent as GreenComment } from 'assets/green-comment.svg';
import { ReactComponent as RedComment } from 'assets/red-comment.svg';
import clsx from 'clsx';
import Button from 'components/Button';
import Dropdown from 'components/Dropdown';
import Input from 'components/Input';
import ModalFooterTime from 'components/ModalFooterTime';
import { DateTime } from 'luxon';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil';
import {
  addAnnotationModalAtom,
  editorSelectedAtom,
} from 'store/atoms/workspace';
import { useFirebase } from '../../hooks/useFirebase';
import useProjects from '../../hooks/useProjects';
import { useUser } from '../../hooks/useUser';
import {
  annotationObjAtom,
  editorUserCursorPositionAtom,
  projectAtom,
} from '../../store/atoms/workspace';

import { greenCommentImageUrl, redCommentImageUrl } from './config';
import './styles.scss';
import useVersioning from '../../hooks/useVersioning';
import { IAnnotation } from 'interface/project';
import { IProject } from '../../interface/project';

export interface IAddAnnotate {
  quill: any;
}

const AddAnnotate: React.FunctionComponent<IAddAnnotate> = ({ quill }) => {
  const ref = useRef<any>();
  const [annotate, setAnnotate] = useState('');
  const selectedText = useRecoilValue(editorSelectedAtom);
  const cursorPosition = useRecoilValue(editorUserCursorPositionAtom);
  const setShowAddAnnotationModal = useSetRecoilState(addAnnotationModalAtom);
  const { user } = useUser();
  const [annotateImage, setAnnotateImage] = useState(redCommentImageUrl);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [project, setProject] = useRecoilState<IProject>(projectAtom);
  const { saveDoc } = useProjects();
  const { add, edit } = useFirebase();
  const { actualVersion, incrementVersion } = useVersioning();

  const anObj = useRecoilValue<IAnnotation>(annotationObjAtom);
  const [isSave, setIsSave] = useState(false);
  const [isReview, setIsReview] = useState(false);

  useEffect(() => {
    if (project) {
      incrementVersion(project.version, project.title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  useEffect(() => {
    if (anObj) {
      setAnnotate(anObj.text);
      setAnnotateImage(anObj.annotateImage);
     

      if (anObj.userId === user.id) {
        setIsEdit(true);
      } else {
        
        if (anObj?.isSaved) {
          setIsReview(true);
        }
        if (!anObj?.isSaved) {
          console.log('here')
          setIsSave(true);
        }
      }
    }
  }, [anObj, user.id]);

  console.log('here', isSave, isEdit, isReview);

  const handleSave = async (e: any) => {
    e.preventDefault();
    if (!annotate || !project) return;
    setLoading(true);
    console.log('handleSave');

    try {
      await add({
        col: 'annotations',
        data: {
          text: annotate,
          createdAt: DateTime.now().toISO(),
          updatedAt: DateTime.now().toISO(),
          userId: user.id,
          name: user.fullName ?? user.name,
          projectId: project.id,
          index: cursorPosition,
          nextVersion: actualVersion,
          selectedText,
          resolved: false,
          annotateImage,
          isSaved: false,
          savedBy: '',
          projectName: project.title,
          projectVersion: project.version,
          completed: false,
        },
      });

      quill.insertEmbed(cursorPosition, 'image', annotateImage, 'user');
      quill.setSelection(selectedText.index, selectedText.length);
      quill.theme.tooltip.save();
      quill.setSelection(cursorPosition, 1);
      quill.theme.tooltip.save();
      setShowAddAnnotationModal(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (e: any) => {
    e.preventDefault();
    if (!anObj) return;
    const hh = quill.getText(
      anObj.selectedText.index + 1,
      anObj.selectedText.length
    );
    const imgtag = `<img src="${anObj.annotateImage}">`;
    const newHtml = project?.html?.replace(imgtag + hh, hh);
    console.log(imgtag + hh);
    setProject(prev => ({
      ...prev,
      html: newHtml,
    }));
  
    setLoading(true);
    try {
      await edit({
        col: 'annotations',
        data: {
          completed: true,
          resolved: true,
          updatedAt: DateTime.now().toISO(),
        },
        id: anObj.id,
      });
      setShowAddAnnotationModal(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e: any) => {
    e.preventDefault();
    if (!anObj) return;
    const hh = quill.getText(
      anObj.selectedText.index + 1,
      anObj.selectedText.length
    );
    const imgtag = `<img src="${anObj.annotateImage}">`;
    const newtag = `<img src="${annotateImage}">`;
    const newHtml = project?.html?.replace(imgtag + hh, newtag + hh);
    console.log('handleEdit');

    setProject(prev => ({
      ...prev,
      html: newHtml,
    }));
    setLoading(true);

    try {
      await edit({
        col: 'annotations',
        data: {
          text: annotate,
          annotateImage,
          isSaved: anObj.userId === user.id ? false : true,
          savedBy: anObj.userId === user.id ? '' : user.id,
          resolved: annotateImage === greenCommentImageUrl ? true : false,
          updatedAt: DateTime.now().toISO(),
        },
        id: anObj.id,
      });
      saveDoc({})
      setShowAddAnnotationModal(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const flex = 'flex justify-between items-center';

  return (
    <div className="annotate-popup pb-[20px]">
      <div
        className={clsx(
          flex,
          'modal-header bg-primary flex flex-shrink-0 items-center justify-between p-3 border-b border-gray-200 rounded-t-md'
        )}
      >
        <div className={clsx(flex)}>
          <svg
            width="16"
            height="18"
            viewBox="0 0 16 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.5327 4.32412L12.3457 0.955073C12.7596 0.186048 13.7185 -0.101933 14.4875 0.311935C14.4964 0.316704 14.5052 0.321474 14.5141 0.326243C15.2832 0.740078 15.5711 1.69901 15.1573 2.46807L13.9849 4.64667C14.201 4.7651 14.4012 4.91439 14.5785 5.09177C15.0701 5.58329 15.3462 6.24994 15.3462 6.94504C15.3462 8.22645 15.3462 10.0383 15.3462 11.3158C15.3462 12.0071 15.0715 12.6702 14.5827 13.1591C14.0938 13.6479 13.4307 13.9226 12.7394 13.9226H11.886L8.78868 17.0067C8.4491 17.3448 7.92665 17.4173 7.50784 17.1843C7.08904 16.9513 6.87505 16.4692 6.98327 16.0023L7.46525 13.9226H2.80237C2.111 13.9226 1.44794 13.6479 0.959073 13.1591C0.470204 12.6702 0.195557 12.0071 0.195557 11.3158V6.93097C0.195557 6.2396 0.470204 5.57654 0.959073 5.08764C1.44794 4.59877 2.111 4.32412 2.80237 4.32412H10.5327ZM9.95437 5.39893H2.80237C2.39606 5.39893 2.00641 5.56035 1.7191 5.84766C1.43179 6.13497 1.27036 6.52466 1.27036 6.93097V11.3158C1.27036 11.7221 1.43179 12.1118 1.7191 12.3991C2.00641 12.6864 2.39606 12.8478 2.80237 12.8478H8.81766L8.03033 16.245L11.4421 12.8478H12.7394C13.1457 12.8478 13.5354 12.6864 13.8227 12.3991C14.11 12.1118 14.2714 11.7221 14.2714 11.3158C14.2714 10.0383 14.2714 8.22645 14.2714 6.94504C14.2714 6.535 14.1085 6.14172 13.8185 5.85179C13.7159 5.74915 13.6003 5.66243 13.4755 5.5932L12.3938 7.6034C12.2956 7.78584 12.1468 7.93601 11.9653 8.03584L11.124 8.49854C10.8045 8.67424 10.4178 8.67599 10.0967 8.50321C9.77568 8.33047 9.56411 8.00672 9.53473 7.64333L9.45741 6.68632C9.44071 6.47978 9.48408 6.27285 9.58225 6.09044L9.95437 5.39893ZM3.18443 10.003H8.99511C9.29172 10.003 9.53251 9.76218 9.53251 9.46557C9.53251 9.16899 9.29172 8.92816 8.99511 8.92816H3.18443C2.88781 8.92816 2.64702 9.16899 2.64702 9.46557C2.64702 9.76218 2.88781 10.003 3.18443 10.003ZM3.18443 7.98771H7.6516C7.94821 7.98771 8.189 7.74692 8.189 7.4503C8.189 7.15372 7.94821 6.9129 7.6516 6.9129H3.18443C2.88781 6.9129 2.64702 7.15372 2.64702 7.4503C2.64702 7.74692 2.88781 7.98771 3.18443 7.98771ZM11.4473 7.09407L14.2108 1.95874C14.3433 1.71241 14.2511 1.40525 14.0048 1.27271C13.9959 1.26794 13.987 1.26317 13.9782 1.2584C13.7319 1.12583 13.4247 1.21806 13.2922 1.4644L10.5287 6.59973L10.606 7.55674L11.4473 7.09407Z"
              fill="#ffffff"
            />
          </svg>
          <h5 className="title text-l font-small leading-normal text-white">
            Add Annotations
          </h5>
        </div>
        <button
          type="button"
          className="close-modal text-white border-none rounded-none focus:shadow-none focus:outline-none focus:opacity-100 hover:text-white hover:opacity-75 hover:no-underline"
          data-bs-dismiss="modal"
          aria-label="Close"
          ref={ref}
        >
          <Cancel />
        </button>
      </div>
      <form
        noValidate
        className=" form px-5 h-[25rem] mt-6 mx-0.5 flex flex-col pb-8 gap-y-6 overflow-auto"
        onSubmit={isReview ? handleResolve : isEdit || isSave ? handleEdit : handleSave}
      >
        <Input
          type={'textarea'}
          label="Annotate"
          className="annotate text-[12px] px-[2rem]"
          placeholder="Type annotation here..."
          setValue={setAnnotate}
          value={annotate}
          readonly={isReview || isSave}
        />

        <div className="submit-rol text-[12px] flex items-center ">
        
          <div className="submit-buttons flex items-center justify-between">
            <div className="w-full mr-[4rem]">Current Status</div>
            <Dropdown
              disabled={isReview}
              dropdownClassName="border border-dropdown-border py-[0.375rem] font-raleway bg-white w-[3.625rem]"
              content={
                <ul className="flex flex-col gap-y-[10px]">
                  <li
                    className="font-semibold text-[12px] text-faded-black cursor-pointer hover:bg-slate-50 px-[1.25rem] "
                    onClick={() => setAnnotateImage(redCommentImageUrl)}
                  >
                    <RedComment />
                  </li>
                  <li
                    className="font-semibold text-[12px] text-faded-black cursor-pointer hover:bg-slate-50 px-[1.25rem] "
                    onClick={() => setAnnotateImage(greenCommentImageUrl)}
                  >
                    <GreenComment />
                  </li>
                  <li
                    className="font-normal text-[12px] text-faded-black cursor-pointer hover:bg-slate-50 px-[1.25rem] "
                    onClick={() => setAnnotateImage('')}
                  >
                    None
                  </li>
                </ul>
              }
            >
              <div className="status w-16 border rounded-sm flex items-center justify-center h-10">
                {annotateImage === redCommentImageUrl ? (
                  <RedComment />
                ) : annotateImage === greenCommentImageUrl ? (
                  <GreenComment />
                ) : (
                  'None'
                )}
              </div>
            </Dropdown>
            <Button
              type="submit"
              secondary
              small
              loading={loading}
              disabled={anObj?.completed  ?? loading}
              className={clsx(
                'subClick  p-4 text-white bg-dark-blue font-small mb-3 w-14 shrink-0'
              )}
            >
              {isReview ? 'Clear Off' : isEdit ? 'Update' : 'Save' }
            </Button>
          </div>
        </div>
      </form>

      <ModalFooterTime />
    </div>
  );
};

export default AddAnnotate;
