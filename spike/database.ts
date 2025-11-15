import 'dotenv/config';

const select = async (sql: string) => {
  const URL = process.env.DBURL as string;
  const AUTHTOKEN = process.env.DBAUTHTOKEN as string;

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

  if (!res.ok) {
    throw new Error('Failed to fetch last entry: ' + await res.text());
  }

  const {
    results
  } = await res.json();

  return results;
};

const parseResToRowsCols = (res:any[]) => {
  const {
    rows,
    cols,
  }: {
    rows: FeedbackRowCol[][],
    cols: { name: string }[],
  } = res?.[0]?.response?.result;

  return {
    rows,
    cols,
  };
}

const parseResponseToRows = (res:any[]) => {
  const {
    rows,
    cols,
  } = parseResToRowsCols(res);

  const colNames = (
    cols.reduce((lk: Map<number, string>, col: { name: string }, i: number) => {
      return lk.set(i, col.name);
    }, new Map<number, string>())
  );

  const toModel = (src: FeedbackRowCol[]) => {
    return (
      src.reduce((row, e: FeedbackRowCol, i: number) => {
        row[colNames.get(i) ?? i] = e.value;
        return row;
      }, {} as Record<string, string>)
    );
  };

  return rows.map((r: FeedbackRowCol[]) => {
    return toModel(r);
  });
};

// const fetchLastEntry = async () => {
//   const sql = `
//     SELECT * FROM feedback
//     ORDER BY date DESC
//     LIMIT 5;
//   `;

//   const models = await select(sql);
//   return models?.[0];
// };

const createTable = async () => {
  const sql = `
    create table feedback
    (
        id       integer primary key,
        ip       text not null,
        date     text not null,
        speed    integer,
        design   integer,
        feedback text,
        email    text
    );
  `;
  const res = await select(sql);
  console.log(JSON.stringify(res, null, 2));
};

(async () => {
  const sql = `
    SELECT * FROM feedback
    ORDER BY date DESC
    LIMIT 5;
  `;
  const res = await select(sql);
  const models = parseResponseToRows(res);
  console.log(JSON.stringify(models, null, 2));
})();

export type Feedback = {
  ip: string;
  date: string;
  speed: number;
  design: number;
  feedback: string;
  email: string;
}

export type FeedbackRowCol = {
  name: string;
  value: string;
  type: 'integer' | 'text' | 'null';
}
