export interface LogEntry {
    id: number;
    timestamp: string;
    logLevel: 'Error' | 'Information' | 'Critical' | 'Warning';
    message: string;
    exception?: string | null;
    stackTrace?: string | null;
    source: string;
  }
  
  export interface LoginProps {
    onLogin: (status: boolean) => void;
  }
  
  export interface LogLevelBadgeProps {
    level: LogEntry['logLevel'];
  }