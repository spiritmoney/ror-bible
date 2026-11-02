import { useEffect, useState } from 'react';
import { useFirebase } from './useFirebase';
import { collection, query, where } from 'firebase/firestore';
import { db } from 'service/firebase';

const useVersioning = () => {
  const [version, setVersion] = useState('');
  const [projectName, setProjectName] = useState('');
  const { getOnce } = useFirebase();
  const [actualVersion, setActualVersion] = useState('');

  const incrementVersion = (version: string, projectName?: string) => {
    setVersion('');
    const ver = version.split('-')[0];
    const date = version.split('-')[1];
    const incre = (
      Number(ver.substring(0, 3) + ver.substring(4)) + 0.01
    ).toFixed(2);
    projectName && setProjectName(projectName);
    setVersion(incre.substring(0, 3) + '.' + incre.substring(3) + '-' + date);
  };

  useEffect(() => {
    if (version && projectName) {
      (async () => {
        const lastVersion = version;  
        try {
          const exists: any = await getOnce({
            col: 'projects',
            queryRaw: query(
              collection(db, 'projects'),
              where('title', '==', projectName),
              where('version', '==', version)
            ),
          });


          if (exists.length > 0) {
            setVersion('');
            incrementVersion(lastVersion);
          } else {
            setVersion('');
            setProjectName('');
            setActualVersion(lastVersion);
          }
        } catch (error) {
          console.log(error);
        }
      })();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectName, version]);

  return { incrementVersion, actualVersion };
};

export default useVersioning;
