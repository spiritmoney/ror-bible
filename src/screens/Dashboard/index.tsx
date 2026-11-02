import React, { useEffect } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Workspace from '../../components/Workspace';
import { useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  addAnnotationModalAtom,
  addCommentsModalAtom,
  addVoiceNoteModalAtom,
  collabPopupModalAtom,
  dashboardSizeAtom,
  newProjectModalAtom,
  notificationsModalAtom,
  projectAtom,
  settingsModalAtom,
  viewProjectInfoModalAtom,
} from 'store/atoms/workspace';
import NewProject from 'components/NewProject';
import Modal from 'components/Modal';
import { IProject } from 'interface/project';
import SettingsPopup from 'components/SettingsPopup';
import NotificationPopup from 'components/NotificationsPopup';
import UtilityTools from 'components/Utility-Tools';
import AddAnnotations from 'components/AddAnnotations';
import AddVoiceNote from 'components/AddVoicenote';
import AddComment from 'components/AddComments';
import LibraryPopup from 'components/LibraryPopup';
import { SetNavAtom, libraryAtom } from '../../store/atoms/general';
import { useParams } from 'react-router-dom';
import {
  voiceNoteObjAtom,
  annotationObjAtom,
  showUnderReviewAtom,
} from '../../store/atoms/workspace';
import clsx from 'clsx';
import useGetSize from 'hooks/useGetSize';
import CollabMode from 'components/CollabPopup';
import ViewProjectInfo from 'components/ViewProjectInfo';
import ModalContent from '../../components/ModalContent/index';
import AdminSideMenu from 'components/AdminSideMenu';
import AdminSideMenuShort from 'components/AdminSideMenuShort';

export interface IDashboard {
  // nav?: string 
}

const Dashboard: React.FunctionComponent<IDashboard> = (
  // nav
  ) => {
  const [quill, setQuill] = useState<any>(null);
  const [selected, setSelected] = useState('');
  const project = useRecoilValue<IProject>(projectAtom);
  const [showNewProjectModal, setShowNewProjectModal] =
    useRecoilState(newProjectModalAtom);
  const [showSettingsModal, setShowSettingsModal] =
    useRecoilState(settingsModalAtom);
  const [showcollabPopupModal, setShowcollabPopupModal] =
    useRecoilState(collabPopupModalAtom);
  const [showViewProjectInfoPopupModal, setShowViewProjectInfoPopupModal] =
    useRecoilState(viewProjectInfoModalAtom);
  const [showNotificationsModal, setShowNotificationsModal] = useRecoilState(
    notificationsModalAtom
  );
  const [showAddAnnotationModal, setShowAddAnnotationModal] = useRecoilState(
    addAnnotationModalAtom
  );
  const [showAddVoiceNoteModal, setShowAddVoiceNoteModal] = useRecoilState(
    addVoiceNoteModalAtom
  );
  const [showAddCommentsModal, setShowAddCommentsModal] =
    useRecoilState(addCommentsModalAtom);
  const [library, setLibrary] = useRecoilState(libraryAtom);
  const setVoiceNoteObject = useSetRecoilState(voiceNoteObjAtom);
  const setAnnotationObject = useSetRecoilState(annotationObjAtom);
  const [anchor, setAnchor] = useState({ x: 0, y: 0 });
  const [showContext, setShowContext] = useState(false);
  const { height, width, ref } = useGetSize();
  const setDashboardHeight = useSetRecoilState(dashboardSizeAtom);
  const [nav,  setNav] = useRecoilState(SetNavAtom);

  const [showUnderReview, setShowUnderReview] =
    useRecoilState(showUnderReviewAtom);

  useEffect(() => {
    setDashboardHeight({
      height,
      width,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, width]);


  // React.useEffect(() => {
  //   setNav(nav);
  //   console.log('Navi', nav);
  // }, [nav, setNav]);

  // useEffect(() => {
  //   if (!project) {
  //     setShowNewProjectModal(true);
  //     return;
  //   }
  // }, [project]);

  return (
    // <div className="flex w-full">
    //   <AdminSideMenuShort />
    //   <AdminSideMenu />
      <section ref={ref}>
        <Header />
        <Workspace
          quill={quill}
          setQuill={setQuill}
          selected={selected}
          setSelected={setSelected}
          setAnchor={setAnchor}
          setShowContext={setShowContext}
          // nav={nav}
        />
        <Footer />

        <Modal
          id={'new-project'}
          isShown={showNewProjectModal}
          setIsShown={setShowNewProjectModal}
          scrollable
          hasHeader={false}
          content={<NewProject />}
        />
        <Modal
          id={'settings'}
          isShown={showSettingsModal}
          setIsShown={setShowSettingsModal}
          scrollable
          hasHeader={false}
          content={<SettingsPopup />}
        />
        <Modal
          id={'notifications'}
          isShown={showNotificationsModal}
          setIsShown={setShowNotificationsModal}
          scrollable
          hasHeader={false}
          content={<NotificationPopup />}
        />

        <Modal
          id={'addAnnotations'}
          isShown={showAddAnnotationModal}
          setIsShown={setShowAddAnnotationModal}
          scrollable
          hasHeader={false}
          onClose={() => setAnnotationObject(null)}
          content={<AddAnnotations quill={quill} />}
        />
        <Modal
          id={'addVoiceNote'}
          isShown={showAddVoiceNoteModal}
          setIsShown={setShowAddVoiceNoteModal}
          scrollable
          hasHeader={false}
          onClose={() => setVoiceNoteObject(null)}
          content={<AddVoiceNote quill={quill} />}
        />
        <Modal
          id={'addComments'}
          isShown={showAddCommentsModal}
          setIsShown={setShowAddCommentsModal}
          scrollable
          hasHeader={false}
          content={<AddComment />}
        />

        <Modal
          id={'library'}
          hasHeader={false}
          isShown={library}
          setIsShown={setLibrary}
          content={<LibraryPopup />}
        />
        <Modal
          id={'collab'}
          isShown={showcollabPopupModal}
          setIsShown={setShowcollabPopupModal}
          scrollable
          hasHeader={false}
          content={<CollabMode />}
        />
        <Modal
          id={'showUnderReview'}
          isShown={showUnderReview}
          setIsShown={setShowUnderReview}
          scrollable
          hasHeader={false}
          content={<ModalContent underReview />}
        />
        <Modal
          id={'viewProjectInfo'}
          isShown={showViewProjectInfoPopupModal.show}
          setIsShown={(value: any) =>
            setShowViewProjectInfoPopupModal(prev => ({ ...prev, show: value }))
          }
          scrollable
          hasHeader={false}
          content={<ViewProjectInfo project={showViewProjectInfoPopupModal.project} />}
        />
        <div
          style={{ top: anchor.y, left: anchor.x }}
          className={clsx('absolute  bg-white z-50', {
            hidden: !showContext,
          })}
        >
          <UtilityTools />
        </div>
      </section>
    // </div>

  );
};

export default Dashboard;
