import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';
import { DateTime } from 'luxon';
import { useFirebase } from './useFirebase';
import { db } from '../service/firebase';
import { useState } from 'react';
import { INotification } from '../interface/notification';
import addNotification from 'react-push-notification';
import useSettings from './useSettings';

const useNotification = () => {
  const { add, edit, getOnce } = useFirebase();
  const [allNotifications, setAllNotifications] = useState<INotification[]>([]);
  const [allReadNotifications, setAllReadNotifications] = useState<
    INotification[]
  >([]);
  const [allUnReadNotifications, setAllUnReadNotifications] = useState<
    INotification[]
  >([]);
  const [allUnNotifiedNotifications, setAllUnNotifiedNotifications] = useState<
    INotification[]
  >([]);
  const { settings } = useSettings();

  const sendNotification = (userId: string, data: any) => {
    return add({
      col: 'notifications',
      data: {
        ...data,
        userId,
        readAt: null,
        notifiedAt: null,
        createdAt: DateTime.now().toISO(),
        updatedAt: DateTime.now().toISO(),
      },
    });
  };

  const editNotification = (id: string, data: any) => {
    return edit({
      col: 'notifications',
      data: {
        ...data,
        updatedAt: DateTime.now().toISO(),
      },
      id,
    });
  };

  const notifiedNotification = (id: string) => {
    return editNotification(id, {
      notifiedAt: DateTime.now().toISO(),
    });
  };

  const readNotification = (id: string) => {
    return editNotification(id, {
      readAt: DateTime.now().toISO(),
    });
  };

  const unreadNotification = (id: string) => {
    return editNotification(id, {
      readAt: null,
    });
  };

  const readAllNotifications = (userId: string) => {
    return new Promise((resolve, reject) => {
      getOnce({
        col: 'notifications',
        queryRaw: query(
          collection(db, 'notifications'),
          where('userId', '==', userId),
          where('readAt', '==', null)
        ),
      }).then((res: any) => {
        res.forEach((item: any) => {
          readNotification(item.id);
        });
        resolve(res);
      }).catch((err: any) => {
        reject(err);
      });
    });
  };

  const unreadAllNotification = (userId: string) => {
    getOnce({
      col: 'notifications',
      queryRaw: query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        where('readAt', '!=', null)
      ),
    }).then((res: any) => {
      res.forEach((item: any) => {
        unreadNotification(item.id);
      });
    });
  };

  const getAllNotifications = (userId: string) => {
    onSnapshot(
      query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      ),
      snapshot => {
        const notifications: any[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllNotifications(notifications);
      },
      error => {
        console.log(error);
      }
    );
  };

  const getAllReadNotifications = (userId: string) => {
    onSnapshot(
      query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        where('readAt', '!=', null),
        orderBy('readAt', 'desc')
      ),
      snapshot => {
        const notifications: any[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllReadNotifications(notifications);
      },
      error => {
        console.log(error);
      }
    );
  };

  const getAllUnReadNotifications = (userId: string) => {
    onSnapshot(
      query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        where('readAt', '==', null),
        orderBy('createdAt', 'desc')
      ),
      snapshot => {
        const notifications: any[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllUnReadNotifications(notifications);
      },
      error => {
        console.log(error);
      }
    );
  };

  const getAllUnNotifiedNotifications = (userId: string) => {
    onSnapshot(
      query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        where('notifiedAt', '==', null),
        orderBy('createdAt', 'desc')
      ),
      snapshot => {
        const notifications: any[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllUnNotifiedNotifications(notifications);
      },
      error => {
        console.log(error);
      }
    );
  };

  const sendPushNotification = (
    data: any,
    type: 'edit' | 'review' | 'collab' | 'payment'
  ) => {
    if (settings?.pushNotification === false) return;
    if (settings?.getReviewPushNotification === false && type === 'review')
      return;
    if (settings?.getEditPushNotification === false && type === 'edit') return;

    addNotification({
      title: data.title,
      message: data.message,
      native: true, // when using native, your OS will handle theming.
      theme: 'darkblue',
      duration: 10000,
      vibrate: [100, 100, 100],
      silent: !settings?.soundForPushNotification ?? false,
      icon: 'https://res.cloudinary.com/dfbebf7x0/image/upload/v1664625974/logo192_ghvxw6.png',
      onClick: () => {
        console.log('Notification Clicked!');
      },
    });
  };

  return {
    sendNotification,
    editNotification,
    readNotification,
    unreadNotification,
    readAllNotifications,
    unreadAllNotification,
    getAllNotifications,
    getAllReadNotifications,
    getAllUnReadNotifications,
    sendPushNotification,
    notifiedNotification,
    getAllUnNotifiedNotifications,
    allNotifications,
    allReadNotifications,
    allUnReadNotifications,
    allUnNotifiedNotifications,
  };
};

export default useNotification;
