import util from 'node:util';

const debug = util.debuglog('save');

export const handler = async (event) => {
  if (
      !event.body
      || typeof event.body !== 'string'
      || event.body[0] !== '{'
      || event.headers['content-type'] !== 'application/json'
      || !event.headers['x-signature']
      || !event?.requestContext?.http?.sourceIp
  ) {
    debug('missing inputs', event);
    return {
      statusCode: 404,
    };
  }

  if (!await verifySignature(event.body, event.headers['x-signature'])) {
    debug('invalid signature', event.body, event.headers['x-signature']);
    return {
      statusCode: 404,
    };
  }

  const json = JSON.parse(event.body);
  const saving = {
    design: json?.design,
    speed: json?.speed,
    email: json?.email,
    feedback: json?.feedback,
    ip: event?.requestContext?.http?.sourceIp,
    date: new Date().toISOString(),
  };

  if (await isMatch(saving)) {
    return {
      statusCode: 304,
    };
  }

  if (event.headers['no-save'] !== 'true') {
    await insert(saving);
  } else {
    debug('no save...');
  }

  return {
    statusCode: 200,
  };
};

const getMinTime = () => {
  let minTIme = new Date();
  const seconds = minTIme.getSeconds();
  const roundedSeconds = Math.floor(seconds / 10) * 10;
  minTIme.setSeconds(roundedSeconds);
  minTIme.setMilliseconds(0);
  return minTIme.getTime();
};

export const verifySignature = async (str, signature) => {
  try {
    const prefix = signature.slice(0, 342);
    const suffix = signature.slice(342);
    const publicKey = await crypto.subtle.importKey(
      "jwk",
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
    debug('verifySignature for', {
      str: JSON.stringify(str),
      prefix,
      suffix
    });
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
    debug('Error verifying signature:', error);
    throw error;
  }
};

// export const verifyRecaptcha = async (token) => {
//   const res = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${token}`);
//   const json = await res.json();
//   debug('json', JSON.stringify(json, null, 2));
//   return json.success;
// };

const escapeString = (src) => {
  if (src === null || src === undefined) {
    return `''`;
  }

  return `'${src.toString()
      .replace(/\\/g, "\\\\")
      .replace(/'/g, "''")}'`;
};

const sanitizeNumber = (num) => {
  const parsed = parseInt(num, 10);
  if (isNaN(parsed)) {
    return '0';
  }
  return parsed;
};

const isMatch = async ({
  ip,
  speed,
  design,
  feedback,
  email,
}) => {
  try {
    const URL = process.env.DBURL;
    const AUTHTOKEN = process.env.DBAUTHTOKEN;

    if (!URL || !AUTHTOKEN) {
      throw new Error('DBURL or DBAUTHTOKEN is not set');
    }

    const sql = `
    SELECT *
    FROM feedback
    WHERE ip = ${escapeString(ip)}
    AND speed = ${sanitizeNumber(speed)}
    AND design = ${sanitizeNumber(design)}
    AND feedback = ${escapeString(feedback)}
    AND email = ${escapeString(email)};
    `;

    const res = await fetch(URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AUTHTOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: [
          { type: "execute", stmt: { sql } },
          { type: "close" },
        ],
      }),
    })
    const json = await res.json();
    debug('is-match', JSON.stringify({ sql, json }, null, 2));
    return res.ok && json?.results?.[0]?.response?.result?.rows?.length > 0;
  } catch (error) {
    debug(error);
  }
};

const insert = async ({
  ip,
  date,
  speed,
  design,
  feedback,
  email,
}) => {
  const sql = `
    insert into main.feedback
      (ip, "date", speed, design, feedback, email)
    values (
      ${escapeString(ip)},
      datetime(${escapeString(date)}),
      ${sanitizeNumber(speed)},
      ${sanitizeNumber(design)},
      ${escapeString(feedback)},
      ${escapeString(email)}
    );
    `;
    const URL = process.env.DBURL;
    const AUTHTOKEN = process.env.DBAUTHTOKEN;

    if (!URL || !AUTHTOKEN) {
      throw new Error('DBURL or DBAUTHTOKEN is not set');
    }

    const res = await fetch(URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AUTHTOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: [
          { type: "execute", stmt: { sql } },
          { type: "close" },
        ],
      }),
    })
    debug('res.ok :>> ', res.ok);
    debug('res.statusText :>> ', res.statusText);
    debug(JSON.stringify(await res.json(), null, 2));
};
