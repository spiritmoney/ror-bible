import axios from 'axios';
import { getEnv } from 'utils/general';

export interface ISendGridMsg {
  to: string;
  subject: string;
  text?: string;
  html: string;
}


export const useSendGrid = () => {
 

  // console.log(getEnv('SENDGRID_API_KEY'))

  const sendEmail = async (msg: ISendGridMsg) => {
    const emailMsg = {
      from: 'rdgn.sendgrid@gmail.com',
      ...msg,
    };

    try {
      const res = await axios.post(`${getEnv('EMAIL_API_URL')}send-email`, emailMsg, {
        headers: {
          Authorization: `Bearer ${getEnv('EMAIL_API_KEY')}`
        }
      })
      console.log(res.data);
    } catch (error: any) {
      console.error(error.response);

      if (error.response) {
        console.error(error.response.body);
      }
    }
  };

  return {
    sendEmail,
  };
};
