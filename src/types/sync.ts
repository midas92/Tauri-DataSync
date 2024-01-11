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
  create_on: string;
}

interface SyncDataType {
  value: string;
  type: string;
}

interface TokenType {
  access_token: string;
  refresh_token: string;
  expiration: number;
}

interface SyncContextType {
  intervalID: NodeJS.Timeout | number;
  setIntervalID: (e: any) => void;
  sync: boolean;
  setSync: (e: boolean) => void;
  token: TokenType;
  setToken: (e: any) => void;
  refreshLog: boolean;
  setRefreshLog: (e: boolean) => void;
  showNotificationOfSuccess: boolean;
  setShowNotificationOfSuccess: (e: boolean) => void;
  showNotificationOfFailed: boolean;
  setShowNotificationOfFailed: (e: boolean) => void;
}

interface ModifiedTimeType {
  nanos_since_epoch: number;
  secs_since_epoch: number;
}
export type {
  SyncDetail,
  SyncType,
  Sync,
  SyncDataType,
  SyncContextType,
  TokenType,
  ModifiedTimeType,
};
