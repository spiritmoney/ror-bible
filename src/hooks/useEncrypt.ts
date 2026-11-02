import jwt from 'jsonwebtoken';

export const useEncrypt = () => {
  const secret = 'scribbbler_jwt_secret_hgsgasjaksaskkksakksaksk';

  const encrypt = (data: any) => {
    return jwt.sign(data, secret, { expiresIn: '24h' });
  };

  const decrypt = (token: string) => {
    let res
    jwt.verify(token, secret, (err: any, decode: any) => {
      if (err) {
        res = null;
      } else {
        res = decode;
      }
    });

    return res
  };

  return { encrypt, decrypt };
};
