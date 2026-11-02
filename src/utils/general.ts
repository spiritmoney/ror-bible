export const redactPayloadProp = (
  payload: { [key: string]: any },
  redact: string[] = [],
  shouldDelete = false
) => {
  if (Array.isArray(payload)) {
    for (const data of payload) {
      payload[data] = redactPayloadProp(payload[data], redact);
    }
  } else if (typeof payload === 'object') {
    for (const key in payload) {
      if (redact.includes(key)) {
        if (!shouldDelete) {
          payload[key] = '[REDACTED]';
        } else {
          Reflect.deleteProperty(payload, key);
        }
      } else {
        payload[key] = redactPayloadProp(payload[key], redact);
      }
    }
  }
  return payload;
};

export const isElectron = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.indexOf(' electron/') !== -1;
};

export function getEnv(variable: string, defaultValue: string = ''): string {
  if (variable in process.env && process.env[variable]) {
    return process.env[variable] as string;
  }
  return process.env[`REACT_APP_${variable}`] || defaultValue;
}

export const isArrayOfObjectsEqual = (
  arr1: any[],
  arr2: any[],
  keysToValidate: string[]
) => {
  const getDifference = (array1: any[], array2: any[]) => {
    return array1.filter(object1 => {
      return !array2.some(object2 => {
        return object1[keysToValidate[0]] === object2[keysToValidate[0]] &&
          keysToValidate[1]
          ? object1[keysToValidate[1]] === object2[keysToValidate[1]]
          : true;
      });
    });
  };

  return [...getDifference(arr1, arr2), ...getDifference(arr2, arr1)];
};

export const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateAlphabets = (length?: number) => {
  const alpha = Array.from(Array(length ?? 26)).map((e, i) => i + 65);
  return alpha.map(x => String.fromCharCode(x));
};

export const incrementVersion = (version: string) => {
  const ver = version.split('-')[0];
  const date = version.split('-')[1];
  const incre = (Number(ver.substring(0, 3) + ver.substring(4)) + 0.01).toFixed(
    2
  );
  return incre.substring(0, 3) + '.' + incre.substring(3) + '-' + date;
};



export function isJSON(text: any) {
  if (typeof text !== 'string') {
    return false;
  }
  try {
    const json = JSON.parse(text);
    return typeof json === 'object';
  } catch (error) {
    return false;
  }
}

export async function copyTextToClipboard(
  text?: string,
  inputId = 'text-clipboard-input'
) {
  const copyText = document.getElementById(inputId);
  if (copyText && !text) {
    // @ts-ignore
    copyText.select();
    // @ts-ignore
    copyText.setSelectionRange(0, 99999); /* For mobile devices */
    // @ts-ignore
    await navigator.clipboard.writeText(copyText.value);
    document.execCommand('copy');
    // @ts-ignore
  } else if (text) {
    await navigator.clipboard.writeText(text);
  }
}

export const bytesToMegaBytes = (bytes: number, digits: number) => {
  return (bytes / (1024 * 1024)).toFixed(digits);
};
