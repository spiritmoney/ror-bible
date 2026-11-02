import React from 'react';
import { IKingsChatTokens, IUser } from '../../interface/user';
// import { IProject } from '../../interface/project';
import { DateTime } from 'luxon';

export type ISelectedSubmitUser = {
  id: string;
  name: string;
  kingsChatTokens?: IKingsChatTokens;
  kingsChatid?: string;
};

export const removeSubmitUser = (
  id: string,
  setState: React.Dispatch<
    React.SetStateAction<{
      [key: string]: ISelectedSubmitUser;
    }>
  >,
  state: {
    [key: string]: ISelectedSubmitUser;
  }
) => {
  const newState = { ...state };
  delete newState[id];
  setState(newState);
};

export const sendKCUserSubmitMessage = async (
  selectedToUsers: {
    [key: string]: ISelectedSubmitUser;
  },
  selectedCcUsers: {
    [key: string]: ISelectedSubmitUser;
  },
  // authUser: IUser,
  sendMessage: ({
    message,
    kingsChatid,
  }: {
    message: string;
    kingsChatid: string;
  }) => Promise<void>,
  payload: any
) => {
  Object.values(selectedToUsers).forEach(async user => {
    console.log(user);
    if (!user.kingsChatTokens || !user.kingsChatid) return;
    await sendMessage({
      message: `You Have Received a New Message  

         *Subject:* ${payload.subject}
         *Comment:* ${payload.comment}
          Date: ${DateTime.now().toLocaleString(DateTime.DATETIME_MED)}
          `,
      kingsChatid: user.kingsChatid,
    });
  });

  Object.values(selectedCcUsers).forEach(async user => {
    if (!user.kingsChatTokens || !user.kingsChatid) return;
    await sendMessage({
      message: `$wishes to CC you on this project
          
      
      Date: ${DateTime.now().toLocaleString(DateTime.DATETIME_MED)}
          `,
      kingsChatid: user.kingsChatid,
    });
  });
};

export const sendKCUserCollabMessage = async (
  selectedCollabUsers: {
    [key: string]: ISelectedSubmitUser;
  },
  authUser: IUser,
  sendMessage: ({
    message,
    kingsChatid,
  }: {
    message: string;
    kingsChatid: string;
  }) => Promise<void>,
) => {
  Object.values(selectedCollabUsers).forEach(async user => {
    console.log(user);
    if (!user.kingsChatTokens || !user.kingsChatid) return;
    await sendMessage({
      message: `${authUser?.fullName} wishes to collaborate with you on this project
          
      You Have Received a New Message fro ROR BIBLE

          Date: ${DateTime.now().toLocaleString(DateTime.DATETIME_MED)}
          `,
      kingsChatid: user.kingsChatid,
    });
  });
};
