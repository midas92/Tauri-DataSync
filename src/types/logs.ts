interface Datas {
  datas: Array<Log>;
  currentPage : number
}

interface Log {
  id: number;
  create_on: string;
  prev_on: string;
  drive: string;
  type: string;
  path: string;
  upload: string;
}

export type { Datas , Log};
