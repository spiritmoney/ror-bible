/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
import { ReactComponent as Cancel } from 'assets/cancel.svg';
import { ReactComponent as GreenMic } from 'assets/green-mic.svg';
import { ReactComponent as RedMic } from 'assets/red-microphone.svg';
import clsx from 'clsx';
import Button from 'components/Button';
import Input from 'components/Input';
import ModalFooterTime from 'components/ModalFooterTime';
import { DateTime } from 'luxon';
import React, { useEffect, useRef, useState } from 'react';
import './styles.scss';
//@ts-ignore
import { Recorder } from 'react-voice-recorder';
import 'react-voice-recorder/dist/index.css';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { editorSelectedAtom, projectAtom, vNImageAtom } from 'store/atoms/workspace';
import { useFirebase } from '../../hooks/useFirebase';
import useProjects from '../../hooks/useProjects';
import { useUser } from '../../hooks/useUser';
import { IProject, IVoiceNote } from '../../interface/project';
import {
  addVoiceNoteModalAtom,
  editorUserCursorPositionAtom,
  voiceNoteObjAtom,
} from '../../store/atoms/workspace';
import { redMicrophoneImageUrl, greenMicrophoneImageUrl } from '../AddAnnotations/config';
import { DarkThemeAtom } from 'store/atoms/general';
import useVersioning from '../../hooks/useVersioning';
import Dropdown from 'components/Dropdown';

export interface IAddVoiceNote {
  quill: any;
}

const AddVoiceNote: React.FunctionComponent<IAddVoiceNote> = ({ quill }) => {
  const ref = useRef<any>();
  const [audio, setAudio] = useState<any>({
    url: null,
    blob: null,
    chunks: null,
    duration: {
      h: null,
      m: null,
      s: null,
    },
  });
  const [isRecording, setIsRecording] = useState(true);
  const [note, setNote] = useState('');
  const selectedText = useRecoilValue(editorSelectedAtom);
  const cursorPosition = useRecoilValue(editorUserCursorPositionAtom);
  const setShowAddVoiceNoteModal = useSetRecoilState(addVoiceNoteModalAtom);
  const { user } = useUser();
  const [project, setProject] = useRecoilState<IProject>(projectAtom);
  const { add, makeUpload, getUrl, edit } = useFirebase();
  const [loading, setLoading] = useState(false);
  const [isReview, setIsReview] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [vnObj, setVnObj] = useState<IVoiceNote | null>(null);
  const vnObjRecoil = useRecoilValue<IVoiceNote | null>(voiceNoteObjAtom);
  const DarkTheme = useRecoilValue(DarkThemeAtom);
  const [noteError, setNoteError] = useState('');
  const { actualVersion, incrementVersion } = useVersioning();
  // const [vNImage, setVNImage] = useRecoilState(vNImageAtom);
  const [vNImage, setVNImage] = useState(redMicrophoneImageUrl);


  useEffect(() => {
    if (project) {
      incrementVersion(project.version, project.title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  useEffect(() => {
    let obj: IVoiceNote | null = null;

    if (vnObjRecoil) {
      obj = vnObjRecoil;
    }

    if (!obj) return;
    setVnObj(obj);
    setIsRecording(false);
    setNote(obj.note);
    setAudio((prev: any) => ({
      ...prev,
      url: obj?.audioUrl,
    }));

    if (vnObjRecoil?.userId === user?.id) {
      setIsEdit(true);
    } else {
      setIsReview(true);
    }
  }, [user?.id, vnObjRecoil]);

  const handleAudioStop = (data: any) => {
    setAudio(data);
    setIsRecording(false);
  };

  const handleAudioUpload = (file: any) => {
    // console.log('upload', file);
  };

  const handleCountDown = (data: any) => {
    // console.log('count down', audio);
    // setIsRecording(true)
  };

  const handleOnChange = (value: any) => {
    // console.log('change', value);
  };

  const handleResolve = async () => {
    if (!vnObj) return;
    const nh = quill.getText(
      vnObj.selectedText.index + 1,
      vnObj.selectedText.length
    );
    const vImgtag = `<img src="${vnObj.vNImage}">`;
    const newtag = `<img src="${vNImage}">`;
    const newHtml = project?.html?.replace(vImgtag + nh, newtag + nh);
    setProject(prev => ({
      ...prev,
      html: newHtml,
    }));

    setLoading(true);
    try {
      await edit({
        col: 'voice-notes',
        data: {
          vNImage,
          resolved: true,
          updatedAt: DateTime.now().toISO(),
        },
        id: vnObj.id,
      });
      // quill.deleteText(vnObj.index, 1, 'user');
      // quill.setSelection(vnObj.selectedText.index, vnObj.selectedText.length);
      // quill.theme.tooltip.edit('link', undefined);
      // quill.theme.tooltip.save();
      setShowAddVoiceNoteModal(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    const reset = {
      url: null,
      blob: null,
      chunks: null,
      duration: {
        h: null,
        m: null,
        s: null,
      },
    };
    setAudio(reset);
    setIsRecording(true);
  };

  const handleSave = async () => {
    setNoteError('');
    if (!note) return setNoteError('A short note is required');
    if (!project) return;
    setLoading(true);
    try {
      const upload: any = await makeUpload({
        file: audio.blob,
        fileName: `${user?.email}-${project?.id}-${DateTime.now().toISO()}`,
        folder: 'voiceNotes',
      });

      const audioUrl: any = await getUrl({
        filename: upload.filename,
        folder: upload.folder,
      });

      await add({
        col: 'voice-notes',
        data: {
          note,
          createdAt: DateTime.now().toISO(),
          updatedAt: DateTime.now().toISO(),
          userId: user.id,
          name: user.fullName ?? user.name,
          projectId: project.id,
          index: cursorPosition,
          selectedText,
          storedAudioFolder: upload.folder,
          storedAudioName: upload.filename,
          audioUrl,
          resolved: false,
          vNImage,
          nextVersion: actualVersion,
          projectName: project.title,
          projectVersion: project.version,
        },
      });

      quill.insertEmbed(cursorPosition, 'image', vNImage, 'user');
      quill.setSelection(selectedText.index, selectedText.length);
      quill.theme.tooltip.save();
      quill.setSelection(cursorPosition, 1);
      quill.theme.tooltip.save();
      setShowAddVoiceNoteModal(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!vnObj) return;
    setLoading(true);

    const payload: any = {
      note,
      updatedAt: DateTime.now().toISO(),
    }

    try {
      if (audio.blob) {
        const upload: any = await makeUpload({
          file: audio.blob,
          fileName: vnObj.storedAudioName,
          folder: vnObj.storedAudioFolder as any,
        });

        const audioUrl: any = await getUrl({
          filename: upload.filename,
          folder: upload.folder,
        });
        payload.audioUrl = audioUrl;
      }

      await edit({
        col: 'voice-notes',
        data: payload,
        id: vnObj.id,
      });
      setShowAddVoiceNoteModal(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const flex = 'flex justify-between items-center';

  return (
    <div className="voice-popup pb-[20px]">
      <div
        className={clsx(
          flex,
          'modal-header bg-primary flex flex-shrink-0 items-center justify-between p-3 border-b border-gray-200 rounded-t-md'
        )}
      >
        <div className={clsx(flex)}>
          <svg
            width="12"
            height="17"
            viewBox="0 0 12 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.49256 4.44391C9.49256 2.44865 7.87228 0.828369 5.87702 0.828369C3.88175 0.828369 2.26147 2.44865 2.26147 4.44391V8.57596C2.26147 10.5712 3.88175 12.1915 5.87702 12.1915C7.87228 12.1915 9.49256 10.5712 9.49256 8.57596V4.44391ZM8.45954 4.44391V8.57596C8.45954 10.0015 7.30257 11.1585 5.87702 11.1585C4.45146 11.1585 3.29449 10.0015 3.29449 8.57596V4.44391C3.29449 3.01835 4.45146 1.86138 5.87702 1.86138C7.30257 1.86138 8.45954 3.01835 8.45954 4.44391ZM3.81099 16.3235H7.94304C8.08002 16.3235 8.2114 16.2691 8.30826 16.1723C8.40513 16.0754 8.45954 15.944 8.45954 15.807C8.45954 15.6701 8.40513 15.5387 8.30826 15.4418C8.2114 15.3449 8.08002 15.2905 7.94304 15.2905H3.81099C3.67401 15.2905 3.54263 15.3449 3.44577 15.4418C3.3489 15.5387 3.29449 15.6701 3.29449 15.807C3.29449 15.944 3.3489 16.0754 3.44577 16.1723C3.54263 16.2691 3.67401 16.3235 3.81099 16.3235Z"
              fill="#FFFFFF"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.195557 8.57608C0.195557 11.7118 2.74141 14.2576 5.87712 14.2576C9.01283 14.2576 11.5587 11.7118 11.5587 8.57608C11.5587 8.43909 11.5043 8.30772 11.4074 8.21085C11.3105 8.11399 11.1792 8.05957 11.0422 8.05957C10.9052 8.05957 10.7738 8.11399 10.677 8.21085C10.5801 8.30772 10.5257 8.43909 10.5257 8.57608C10.5257 11.1416 8.44261 13.2246 5.87712 13.2246C3.31164 13.2246 1.22857 11.1416 1.22857 8.57608C1.22857 8.43909 1.17415 8.30772 1.07729 8.21085C0.980424 8.11399 0.849048 8.05957 0.712062 8.05957C0.575077 8.05957 0.443701 8.11399 0.346838 8.21085C0.249974 8.30772 0.195557 8.43909 0.195557 8.57608Z"
              fill="#FFFFFF"
            />
          </svg>
          <h5 className="title text-l font-small leading-normal text-white">
            Add Voice Note
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
      <div
        className=" form px-5 h-max mt-6 mx-0.5 flex flex-col pb-5 gap-y-6 overflow-auto"
      // onSubmit={}
      >
        <div
          className={clsx('recorder', {
            'DD !bg-[#071723] !border-[#5a606d] !text-[#EDF1F3] placeholder:!text-[#5a606d]':
              DarkTheme === true,
          })}
        >
          <Input
            placeholder="Type note here..."
            inputClassName="note"
            className="contai text-[13px]"
            value={note}
            setValue={setNote}
            disabled={isReview}
            type="textarea"
            error={noteError}
          />
          {isRecording && (
            <Recorder
              record={true}
              audioURL={audio.url}
              showUIAudio
              handleAudioStop={(data: any) => handleAudioStop(data)}
              handleOnChange={(value: any) => handleOnChange(value)}
              handleCountDown={(data: any) => handleCountDown(data)}
              handleAudioUpload={(data: any) => handleAudioUpload(data)}
              handleRest={() => handleReset()}
            />
          )}

          {!isRecording && (
            <div className="min-h-[220px] flex items-center justify-center">
              <audio src={audio.url} controls />
            </div>
          )}
        </div>

        <div className="submit-buttons flex gap-x-4 ">
          <div className='flex items-center'>
            <div className="w-full mr-[4rem]">Current Status</div>
            <Dropdown
              // disabled={isReview}
              dropdownClassName="border border-dropdown-border py-[0.375rem] font-raleway bg-white w-[3.625rem]"
              content={
                <ul className="flex flex-col gap-y-[10px]">
                  <li
                    className="font-semibold text-[12px] text-faded-black cursor-pointer hover:bg-slate-50 px-[1.25rem] "
                    onClick={() => setVNImage(redMicrophoneImageUrl)}
                  >
                    <RedMic />
                  </li>
                  <li
                    className="font-semibold text-[12px] text-faded-black cursor-pointer hover:bg-slate-50 px-[1.25rem] "
                    onClick={() => setVNImage(greenMicrophoneImageUrl)}
                  >
                    <GreenMic />
                  </li>
                  <li
                    className="font-normal text-[12px] text-faded-black cursor-pointer hover:bg-slate-50 px-[1.25rem] "
                  // onClick={() => setVNImage('')}
                  >
                    None
                  </li>
                </ul>
              }
            >
              <div className="status w-16 border rounded-sm flex items-center justify-center h-10">
                {vNImage === redMicrophoneImageUrl ? (
                  <RedMic />
                ) : vNImage === greenMicrophoneImageUrl ? (
                  <GreenMic />
                ) : (
                  'None'
                )}
              </div>
            </Dropdown>
          </div>


          {!isReview && (
            <>
              <Button
                type="submit"
                light
                small
                className={clsx('subClick p-4 font-small mb-3 w-14', {
                  'text-black shadow-[inset_0_0_0_1px_black]': !isRecording,
                })}
                onClick={handleReset}
              >
                Clear
              </Button>
              <Button
                type="submit"
                secondary
                small
                disabled={isRecording ?? loading ?? isRecording}
                className={clsx(
                  'subClick  p-4 text-white bg-dark-blue font-small mb-3 w-14'
                )}
                loading={loading}
                onClick={isEdit ? handleEdit : handleSave}
              >
                {isEdit ? 'Update' : 'Save'}
              </Button>
            </>
          )}

          {isReview && (
            <Button
              type="submit"
              secondary
              small
              disabled={vnObj?.resolved ?? loading}
              className={clsx(
                'subClick  p-4 text-white bg-dark-blue font-small mb-3 w-14'
              )}
              loading={loading}
              onClick={handleResolve}
            >
              Resolve
            </Button>
          )}
        </div>
      </div>

      <ModalFooterTime />
    </div>
  );
};

export default AddVoiceNote;
