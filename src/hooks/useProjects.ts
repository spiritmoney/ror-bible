import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  limit,
  doc,
} from 'firebase/firestore';
import { IProject } from 'interface/project';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { db } from 'service/firebase';
import { ISO_TIME_FORMAT } from 'store/constant';
import { localForage } from 'store/persist/persist';
import { useEffectOnce } from 'usehooks-ts';
import { isArrayOfObjectsEqual } from 'utils/general';
import { IAnnotation, IComment, IVoiceNote } from '../interface/project';
import { allProjectAtom, projectAtom } from '../store/atoms/workspace';
import { useFirebase } from './useFirebase';
import { useUser } from './useUser';
import addNotification from 'react-push-notification';
import { sortArrayObjectsBaseOnDate } from '../utils/format';

const useProjects = () => {
  const [cloudProjectVersion, setCloudProjectVersion] =
    useState<IProject | null>(null);
  // const [cloudProjectVersion, setCloudProjectVersion] =
  //   useRecoilState<IProject>(cloudProjectVersionAtom);
  //   const [project, setProject] = useState<IProject | null>(null);
  //   const [projectStore, setProjectStore] = useRecoilState<IProject>(projectAtom);
  const [project, setProject] = useRecoilState<IProject | null>(projectAtom);

  const [allCloudProjects, setAllCloudProjects] =
    useRecoilState<IProject[]>(allProjectAtom);

  const [allLocalProjects, setAllLocalProjects] = useState<IProject[]>([]);

  const [isProjectInSync, setIsProjectInSync] = useState(true);

  const [isAllProjectsInSync, setIsAllProjectsInSync] = useState(true);

  const { edit, deleteData, add } = useFirebase();
  const { user } = useUser();

  const [allReviewedProjects, setAllReviewedProjects] = useState<IProject[]>([]);
  const [allLatestProjects, setAllLatestProjects] = useState<IProject[]>([]);
  const [allToProjects, setAllToProjects] = useState<IProject[]>([]);
  const [allCcProjects, setAllCcProjects] = useState<IProject[]>([]);
  const [allRecievedProjects, setAllRecievedProjects] = useState<IProject[]>([]);
  const [allAnnotations, setAllAnnotations] = useState<IAnnotation[]>([]);
  const [currentVersionAnnotations, setCurrentVersionAnnotations] = useState<IAnnotation[]>([]);
  const [currentVersionVoiceNotes, setCurrentVersionVoiceNotes] = useState<IVoiceNote[]>([]);
  const [currentVersionComments, setCurrentVersionComments] = useState<
    IComment[]
  >([]);
  const [nextVersionAnnotations, setNextVersionAnnotations] = useState<
    IAnnotation[]
  >([]);
  const [nextVersionVoiceNotes, setNextVersionVoiceNotes] = useState<
    IVoiceNote[]
  >([]);
  const [nextVersionComments, setNextVersionComments] = useState<IComment[]>(
    []
  );
  const [allVoiceNotes, setAllVoiceNotes] = useState<IVoiceNote[]>([]);
  const [allComments, setAllComments] = useState<IComment[]>([]);
  const [checkCc, setCheckCc] = useState(false);
  const [allEditProjects, setAllEditProjects] = useState<IProject[]>([]);
  const [allCollabProjects, setAllCollabProjects] = useState<IProject[]>([]);
  const getAllEditedProjects = async () => {
    onSnapshot(
      query(
        collection(db, 'projects'),
        where('originalOwner', '==', user.id),
        where('isEdit', '==', true),
        orderBy('createdAt', 'desc')
      ),
      snapshot => {
        const editProjects: any[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllEditProjects(editProjects);
      },
      error => {
        console.log(error);
      }
    );
  };

  const getAllCollabProjects = async () => {
    onSnapshot(
      query(
        collection(db, 'projects'),
        where('collaborators', 'array-contains', user.id),
        // where('isEdit', '==', true),
        orderBy('createdAt', 'desc')
      ),
      snapshot => {
        const editProjects: any[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllCollabProjects(editProjects);
      },
      error => {
        console.log(error);
      }
    );
  };

  const getAnnotationsCommentsVoiceNotes = async (project: IProject) => {
    // Get Annotations
    onSnapshot(
      query(
        collection(db, 'annotations'),
        where('projectName', '==', project.title),
        where('projectVersion', '==', project.version),
        orderBy('createdAt', 'desc')
      ),
      snapshot => {
        const annotations: any[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCurrentVersionAnnotations(annotations);
      },
      error => {
        console.log(error);
      }
    );
    onSnapshot(
      query(
        collection(db, 'annotations'),
        where('projectName', '==', project.title),
        where('nextVersion', '==', project.version),
        orderBy('createdAt', 'desc')
      ),
      snapshot => {
        const annotations: any[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNextVersionAnnotations(annotations);
      },
      error => {
        console.log(error);
      }
    );
    // Get VoiceNotes
    onSnapshot(
      query(
        collection(db, 'voice-notes'),
        where('projectName', '==', project.title),
        where('projectVersion', '==', project.version),
        orderBy('createdAt', 'desc')
      ),
      snapshot => {
        const voiceNotes: any[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCurrentVersionVoiceNotes(voiceNotes);
      },
      error => {
        console.log(error);
      }
    );
    onSnapshot(
      query(
        collection(db, 'voice-notes'),
        where('projectName', '==', project.title),
        where('nextVersion', '==', project.version),
        orderBy('createdAt', 'desc')
      ),
      snapshot => {
        const voiceNotes: any[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNextVersionVoiceNotes(voiceNotes);
      },
      error => {
        console.log(error);
      }
    );
    // Get Comments
    onSnapshot(
      query(
        collection(db, 'comments'),
        where('projectName', '==', project.title),
        where('projectVersion', '==', project.version),
        orderBy('createdAt', 'asc')
      ),
      snapshot => {
        const comments: any[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCurrentVersionComments(comments);
      },
      error => {
        console.log(error);
      }
    );
    onSnapshot(
      query(
        collection(db, 'comments'),
        where('projectName', '==', project.title),
        where('nextVersion', '==', project.version),
        orderBy('createdAt', 'asc')
      ),
      snapshot => {
        const comments: any[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNextVersionComments(comments);
      },
      error => {
        console.log(error);
      }
    );
  };

  const getAllCloudProjects = () => {
    onSnapshot(
      query(
        collection(db, 'projects'),
        where('userId', '==', user.id),
        orderBy('createdAt', 'desc')
      ),
      snapshot => {
        const allp: any = snapshot.docs
          .map(doc => {
            return {
              ...doc.data(),
              id: doc.id,
            };
          })
          .sort((a: any, b: any) => {
            return DateTime.fromISO(a.createdAt).diff(
              DateTime.fromISO(b.createdAt)
            ).milliseconds;
          })
          .reverse();
        setAllCloudProjects(allp);
      },
      error => {
        console.log(error);
      }
    );
  };

  const getAllRecievedProjects = async () => {
    onSnapshot(
      query(
        collection(db, 'projects'),
        where('to', 'array-contains', user.id),
        orderBy('createdAt', 'desc')
      ),
      snapshot => {
        const to: any = snapshot.docs.map(doc => {
          return {
            ...doc.data(),
            id: doc.id,
          };
        });
        setAllToProjects(to);
      },
      error => {
        console.log(error);
      }
    );

    onSnapshot(
      query(
        collection(db, 'projects'),
        where('cc', 'array-contains', user.id),
        orderBy('createdAt', 'desc')
      ),
      snapshot => {
        const cc: any = snapshot.docs.map(doc => {
          return {
            ...doc.data(),
            id: doc.id,
          };
        });
        setAllCcProjects(cc);
      },
      error => {
        console.log(error);
      }
    );
  };

  const getMostOpenedProject = async (max?: number) => {
    return new Promise((resolve, reject) => {
      onSnapshot(
        query(
          collection(db, 'projects'),
          where('userId', '==', user.id),
          orderBy('lastOpened', 'desc'),
          limit(max ?? 4)
        ),
        snapshot => {
          const allp: any = snapshot.docs.map(doc => {
            return {
              ...doc.data(),
              id: doc.id,
            };
          });
          resolve(allp);
        },
        error => {
          console.log(error);
          reject(error);
        }
      );
    });
  };

  useEffect(() => {
    setAllAnnotations(
      sortArrayObjectsBaseOnDate([
        ...currentVersionAnnotations,
        ...nextVersionAnnotations,
      ])
    );
  }, [currentVersionAnnotations, nextVersionAnnotations]);

  useEffect(() => {
    setAllVoiceNotes(
      sortArrayObjectsBaseOnDate([
        ...currentVersionVoiceNotes,
        ...nextVersionVoiceNotes,
      ])
    );
  }, [currentVersionVoiceNotes, nextVersionVoiceNotes]);

  useEffect(() => {
    setAllComments(
      sortArrayObjectsBaseOnDate([
        ...currentVersionComments,
        ...nextVersionComments,
      ])
    );
  }, [currentVersionComments, nextVersionComments]);

  useEffect(() => {
    setAllRecievedProjects(
      sortArrayObjectsBaseOnDate([...allToProjects, ...allCcProjects])
    );
    setAllCloudProjects(prev => {
      return [...prev, ...allToProjects, ...allCcProjects];
    });
  }, [allCcProjects, allToProjects, setAllCloudProjects]);

//   useEffect(() => {
//     if (!user) return;
//     let prevIndex = 0;
//     allToProjects.forEach((project, i) => {
//       if (!project.seen?.includes(user.id!)) {
//         setTimeout(() => {
//           prevIndex = i;

//           addNotification({
//             title: `${project.author} has sent you a new project to review`,
//             message: `
// Project: ${project?.title}
// Version: ${project.version}
// Subject: ${project.subject}`,
//             theme: 'darkblue',
//             native: true,
//             duration: 9000,
//             colorTop: 'green',
//             vibrate: [100, 100, 100],
//             onClick: e => {
//               setProjectFunc({ ...project });
//             },
//           });

//           (async () => {
//             await edit({
//               col: 'projects',
//               data: {
//                 seen: [...project.seen, user.id!],
//               },
//               id: project.id,
//             });
//           })();

//           if (i === allToProjects.length - 1) {
//             setCheckCc(true);
//           }
//         }, i * 10000);
//       } else {
//         if (i === allToProjects.length - 1) {
//           setTimeout(() => {
//             setCheckCc(true);
//           }, prevIndex * 10000);
//         }
//       }
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [allToProjects, user]);

//   useEffect(() => {
//     if (!user) return;
//     if (!checkCc) return;
//     allCcProjects.forEach((project, i) => {
//       if (!project.seen?.includes(user.id!)) {
//         setTimeout(() => {
//           addNotification({
//             title: `${project.author} wishes to CC you on this project`,
//             message: `
//             Project: ${project?.title}
// Version: ${project.version}
// Subject: ${project.subject}`,
//             theme: 'darkblue',
//             native: true,
//             duration: 9000,
//             colorTop: 'green',
//             vibrate: [100, 100, 100],
//             onClick: e => {
//               setProjectFunc({ ...project });
//             },
//           });

//           (async () => {
//             await edit({
//               col: 'projects',
//               data: {
//                 seen: [...project.seen, user.id!],
//               },
//               id: project.id,
//             });
//           })();
//         }, i * 10000);
//       }
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [allCcProjects, user]);

//   useEffect(() => {
//     if (!user) return;
//     allCollabProjects.forEach((project, i) => {
//       if (!project.seenCollab?.includes(user.id!)) {
//         setTimeout(() => {
//           const arr = [...allCollabProjects];
//           const index = allCollabProjects.findIndex(p => p.id === project.id);

//           arr[index].seenCollab = [...(project?.seenCollab ?? []), user.id!];

//           setAllCollabProjects(arr);

//           addNotification({
//             title: `${project.author} wishes to collaborate with you on this project`,
//             message: `
//             Project: ${project?.title}
// Version: ${project.version}
// Subject: ${project.subject}`,
//             theme: 'darkblue',
//             native: true,
//             duration: 9000,
//             colorTop: 'green',
//             vibrate: [100, 100, 100],
//             onClick: e => {
//               setProjectFunc({ ...project });
//             },
//           });

//           edit({
//             col: 'projects',
//             data: {
//               seenCollab: [...(project?.seenCollab ?? []), user.id!],
//             },
//             id: project.id,
//           });

//         }, i * 10000);
//       }
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [allCollabProjects, user]);

  useEffect(() => {
    if (!project) return;
    getAnnotationsCommentsVoiceNotes(project);
  }, [project]);

  useEffect(() => {
    if (allCloudProjects.length < 1) return;
    const rp = allCloudProjects.filter(
      el => (el.to && el.to.length > 0) || (el.cc && el.cc.length > 0)
    );
    // const lp = allCloudProjects.filter(el => el.isLatest);
    if (
      rp.length !== allReviewedProjects.length &&
      rp.length !== allCloudProjects.length
    ) {
      setAllReviewedProjects(rp);
    }

    // setAllLatestProjects(lp);
  }, [allCloudProjects, allReviewedProjects.length]);

  useEffectOnce(() => {
    getAllCloudProjects();
    getAllRecievedProjects();
    getAllEditedProjects();
    getAllCollabProjects();
  });

  useEffect(() => {
    const compareArray = isArrayOfObjectsEqual(
      allCloudProjects,
      allLocalProjects,
      ['id', 'html']
    );

    if (compareArray.length < 1) {
      setIsAllProjectsInSync(true);
    } else {
      setIsAllProjectsInSync(false);
    }
  }, [allCloudProjects, allLocalProjects]);

  useEffect(() => {
    if (!project) return;
    if (!cloudProjectVersion || !project.id) return;
    const compare = cloudProjectVersion.html === project.html;
    setIsProjectInSync(compare);
  }, [cloudProjectVersion, project?.html, project?.id]);

  useEffect(() => {
    if (!project) return;
    (async () => {
      onSnapshot(
        doc(db, 'projects', project.id),
        snapshot => {
          if (snapshot.exists()) {
            const data: any = { ...snapshot.data(), id: snapshot.id };
            if (data) {
              setCloudProjectVersion(data);
              const compareDates =
                DateTime.fromISO(data.updatedAt).toMillis() >
                DateTime.fromISO(project.updatedAt).toMillis();
              if (compareDates) {
                setProject(data);
              }
            }
          }
        },
        error => {
          console.log(error);
        }
      );
    })();
  }, [project?.id, setCloudProjectVersion]);

  useEffect(() => {
    localForage.getItem('localProjects').then((value: any) => {
      setAllLocalProjects(value ?? []);
    });
  }, []);

  const alsoAddToLocal = (newProject: IProject) => {
    localForage.setItem('localProjects', [...allLocalProjects, newProject]);
    setAllLocalProjects([...allLocalProjects, newProject]);
  };

  const saveDoc = async ({
    setShowSaveModal,
    setLoading,
  }: {
    setShowSaveModal?: React.Dispatch<React.SetStateAction<boolean>>;
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    if (!project) return;
    if (isProjectInSync) return;
    setLoading && setLoading(true);
    try {
      await edit({
        col: 'projects',
        data: {
          html: project.html,
          updatedAt: DateTime.now().toISO(),
        },
        id: project.id,
      });
      setCloudProjectVersion({ ...project, loading: false });
      setShowSaveModal && setShowSaveModal(true);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading && setLoading(false);
    }
  };

  const setProjectFunc = async (data: IProject) => {
    setProject(data);
    try {
      await edit({
        col: 'projects',
        data: {
          count: data.count + 1,
          lastOpened: DateTime.now().toISO(),
        },
        id: data.id,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return {
    allProjects: allCloudProjects,
    allLatestProjects,
    allReviewedProjects,
    project,
    cloudProjectVersion,
    isAllProjectsInSync,
    isProjectInSync,
    allCcProjects,
    allToProjects,
    allRecievedProjects,
    allAnnotations,
    allVoiceNotes,
    allComments,
    allEditProjects,
    allCollabProjects,
    setAllCloudProjects,
    addToAllLocalProjects: alsoAddToLocal,
    setProject: setProjectFunc,
    setCloudProjectVersion,
    saveDoc,
    getMostOpenedProject,
  };
};

export default useProjects;
