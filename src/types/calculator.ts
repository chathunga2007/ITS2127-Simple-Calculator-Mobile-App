export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export type ButtonType = 'digit' | 'operator' | 'function' | 'equal';

export interface CalcButtonConfig {
  label: string;
  value: string;
  type: ButtonType;
  flex?: number;
}

