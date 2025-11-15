const verifySignature = async (str: string, signature: string) => {
  try {
    const prefix = signature.slice(0, 342);
    const suffix = signature.slice(342);
    const publicKey = await crypto.subtle.importKey(
      'jwk',
      {
        key_ops: ['verify'],
        ext: true,
        kty: 'RSA',
        n: prefix,
        e: 'AQAB',
        alg: 'RS256',
        hash: "SHA-256",
      },
      {
        name: "RSASSA-PKCS1-v1_5",
        hash: "SHA-256",
      },
      true,
      ['verify']
    );

    // Convert string to Uint8Array
    const encoder = new TextEncoder();
    const data = encoder.encode(str + getMinTime());

    // Convert base64 signature back to ArrayBuffer
    const signatureBuffer = Buffer.from(suffix, 'base64');

    // Verify the signature
    const isValid = await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      publicKey,
      signatureBuffer,
      data
    );

    return isValid;
  } catch (error) {
    console.error('Error verifying signature:', error);
    throw error;
  }
};

const signAndVerify = async () => {
  try {
    const json = {
      date: new Date().toISOString(),
      speed: 1,
      design: 2,
      feedback: "⚡️",
      email: null,
    };
    const hash = JSON.stringify(json, Object.keys(json).sort());
    const signature = await sign(hash);
    const isValid = await verifySignature(hash, signature);
    console.log('isValid :>> ', isValid);

    // const content = JSON.stringify(json, Object.keys(json).sort());
    // const url = 'https://zxzffkjcu0.execute-api.us-east-1.amazonaws.com/save-feedback';
    // const res = await fetch(url, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: content,
    // });

    // console.log('res.ok :>> ', res.ok);
    // console.log('res.statusText :>> ', res.statusText);
    // console.log(JSON.stringify(await res.json(), null, 2));
  } catch (error) {
    console.error(error);
  }
}

const getMinTime = () => {
  let minTIme = new Date();
  const seconds = minTIme.getSeconds();
  const roundedSeconds = Math.floor(seconds / 10) * 10;
  minTIme.setSeconds(roundedSeconds);
  minTIme.setMilliseconds(0);
  return minTIme.getTime();
};

signAndVerify();
