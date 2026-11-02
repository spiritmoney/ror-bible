import { ReactComponent as Cancel } from 'assets/cancel.svg';
import { ReactComponent as File } from 'assets/file.svg';
import Button from 'components/Button';
import Input from 'components/Input';
import ModalFooterTime from 'components/ModalFooterTime';
import { collection, orderBy, query, where } from 'firebase/firestore';
import { useFirebase } from 'hooks/useFirebase';
import { useUser } from 'hooks/useUser';
import { DateTime } from 'luxon';
import { useEffect, useRef, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { db } from 'service/firebase';
import { projectAtom } from 'store/atoms/workspace';
import { PROJECTS_IMAGE_FOLDER_NAME } from 'store/constant';
import { validate } from './config';

interface INewProject {}

const NewProject: React.FunctionComponent<INewProject> = () => {
  const [title, setTitle] = useState('');
  const [version, setVersion] = useState(
    `1.0.0-${DateTime.now().toFormat('ddMM')}`
  );
  const [cover, setCover] = useState<any>(null);
  const [errors, setErrors] = useState({
    title: '',
    fileNameVersion: '',
    cover: '',
  });
  const [loading, setLoading] = useState(false);
  const ref = useRef<any>();
  const { user } = useUser();
  const { add, makeUpload, getUrl, getOnce } = useFirebase();

  const setProject = useSetRecoilState(projectAtom);

  const submit = async (e: any) => {
    e.preventDefault();

    const hasError = Object.values(errors).some(el => el);

    if (hasError) {
      return;
    }

    setLoading(true);

    const payload: any = {
      title: title.trim(),
      version: version.trim(),
      createdAt: DateTime.now().toISO(),
      updatedAt: DateTime.now().toISO(),
      lastOpened: DateTime.now().toISO(),
      html: ' ',
      delta: {},
      originalOwner: user.id,
      userId: user.id,
      count: 0,
      to: [],
      cc: [],
      isLatest: true,
      author: user.fullName,
      collaborators: [],
      seenCollab: [],
      hasMadeDuplicate: [],
      isDuplicate: false,
      makeDuplicate: false,
      editorInCharge: '',
    };

    try {
      const exists: any = await getOnce({
        col: 'projects',
        queryRaw: query(
          collection(db, 'projects'),
          where('title', '==', title),
          where('userId', '==', user.id),
          orderBy('createdAt', 'asc')
        ),
      });

      if (exists.length > 0) {
        return setErrors(prev => ({
          ...prev,
          title: 'Title already exists',
        }));
      }

      const res: any = await makeUpload({
        file: cover,
        fileName: title,
        folder: PROJECTS_IMAGE_FOLDER_NAME,
      });
      payload.storedImageFolder = res.folder;
      payload.storedImageName = res.filename;

      const imageUrl: any = await getUrl({
        filename: res.filename,
        folder: res.folder,
      });
      payload.cover = imageUrl;

      const data: any = await add({
        col: 'projects',
        data: payload,
      });

      const newProject = {
        ...payload,
        id: data.id,
      };

      setProject(newProject);

      ref.current.click();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    validate(title, version, cover, setErrors);
  }, [title, version, cover]);

  return (
    <div className="w-[calc(100vw-1rem)] max-w-[862px] pb-[20px]">
      <div className="bg-primary  px-[30px] pt-[1.25rem] pb-[1.1875rem] text-white flex justify-between items-center">
        <div className="flex gap-x-[.875rem] ">
          <File />
          <span>New Project</span>
        </div>

        <button
          type="button"
          className="text-white border-none rounded-none focus:shadow-none focus:outline-none focus:opacity-100 hover:text-white hover:opacity-75 hover:no-underline"
          data-bs-dismiss="modal"
          aria-label="Close"
          ref={ref}
        >
          <Cancel />
        </button>
      </div>

      <form className="px-10 pt-[30px] gap-y-3 flex flex-col" onSubmit={submit}>
        <Input
          label="Project Title"
          type="text"
          value={title}
          setValue={setTitle}
          error={errors.title}
        />
        <Input
          label="Version"
          type="text"
          placeholder="Seven Spirit of God  V: 1.0.2-07_23"
          value={version}
          disabled={true}
          setValue={setVersion}
          error={errors.fileNameVersion}
        />
        <Input
          label="Upload Cover Art"
          type="file-uploader"
          setFiles={setCover}
          error={errors.cover}
        />

        <Button
          secondary
          className="ml-auto mt-5"
          loading={loading}
          disabled={loading}
        >
          Create Project
        </Button>
      </form>

      <ModalFooterTime />
    </div>
  );
};

export default NewProject;
