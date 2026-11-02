import React, { useEffect, useState } from 'react';
import useNotification from '../../hooks/useNotification';
import { useUser } from '../../hooks/useUser';

interface INotification {}

const Notification: React.FunctionComponent<INotification> = () => {
  const {
    allUnNotifiedNotifications,
    getAllUnNotifiedNotifications,
    sendPushNotification,
    notifiedNotification,
    
  } = useNotification();
  const { user } = useUser();
  const [notifiedNotifications, setNotifiedNotifications] = useState<string[]>(
    []
  );

  useEffect(() => {
    if (!user.id) return;
    getAllUnNotifiedNotifications(user.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);


  useEffect(() => {

    if (!allUnNotifiedNotifications.length) return;
    const notNotifiedNotifications = allUnNotifiedNotifications.filter(
      el => !notifiedNotifications.some(id => el.id === id)
    );
    if (!notNotifiedNotifications.length) return;

    const arr: string[] = [];

    notNotifiedNotifications.forEach(el => {
      sendPushNotification(el, el.type);
      arr.push(el.id);
    });

    setNotifiedNotifications(prev => [...prev, ...arr]);

    arr.forEach(el => {
      notifiedNotification(el);
    });
  }, [
    allUnNotifiedNotifications,
    notifiedNotification,
    notifiedNotifications,
    sendPushNotification,
  ]);

  return <div></div>;
};

export default Notification;
