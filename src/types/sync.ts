interface SyncDetail {
  status: boolean;
  type: string;
  detail: number;
  setDetail: (e: number) => void;
}

interface SyncType {
  status: boolean;
  type: string;
  settype: (e: any) => void;
}

interface Sync {
  id: number;
  detail: number;
  file_id: string;
  file_path: string;
  status: boolean;
  type: string;
  create_on:string,
}

interface SyncDataType {
    value : string,
    type : string
}

interface SyncContextType {
    intervalID : NodeJS.Timeout | number,
    setIntervalID:(e : any)=>void
    sync : boolean;
    setSync : (e : boolean)=>void
}
export type { SyncDetail, SyncType, Sync,SyncDataType,SyncContextType };
