export const signString = async (str: string) => {
  const getMinTime = () => {
    let minTIme = new Date();
    const seconds = minTIme.getSeconds();
    const roundedSeconds = Math.floor(seconds / 10) * 10;
    minTIme.setSeconds(roundedSeconds);
    minTIme.setMilliseconds(0);
    return minTIme.getTime();
  };

  // Convert string to Uint8Array
  const encoder = new TextEncoder();
  const data = encoder.encode(str + getMinTime());

  const keyPair = await crypto.subtle.generateKey(
    {
      name: "RSASSA-PKCS1-v1_5",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["sign", "verify"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    keyPair.privateKey,
    data
  );

  const prefix = (await crypto.subtle.exportKey("jwk", keyPair.publicKey)).n;

  // Buffer.from, not supported in browser
  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    const bytes = new Uint8Array(buffer);
    const binaryString = bytes.reduce((str, byte) => str + String.fromCharCode(byte), '');
    const base64 = btoa(binaryString);
    // if (typeof Buffer !== 'undefined') {
    //   console.log('Buffer.from :>> ', Buffer.from(buffer).toString('base64') === base64);
    // }
    return base64;
  };

  return prefix + arrayBufferToBase64(signature);
};

export default signString;
