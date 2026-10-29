export interface AppTheme {
  background: string;
  surface: string;
  displayBg: string;
  textPrimary: string;
  textSecondary: string;
  textDim: string;
  accent: string;
  
  // Buttons
  btnNumber: string;
  btnNumberActive: string;
  btnNumberText: string;
  
  btnFunction: string;
  btnFunctionActive: string;
  btnFunctionText: string;
  
  btnOperator: string;
  btnOperatorActive: string;
  btnOperatorText: string;
  
  btnEqual: string;
  btnEqualActive: string;
  btnEqualText: string;

  border: string;
  card: string;
}

export const Colors: Record<'dark' | 'light', AppTheme> = {
  dark: {
    background: '#121214',
    surface: '#1A1B20',
    displayBg: '#16171C',
    textPrimary: '#FFFFFF',
    textSecondary: '#94A3B8',
    textDim: '#64748B',
    accent: '#F59E0B',
    
    // Buttons
    btnNumber: '#23252B',
    btnNumberActive: '#2E313A',
    btnNumberText: '#F8FAFC',
    
    btnFunction: '#323640',
    btnFunctionActive: '#3F4450',
    btnFunctionText: '#60A5FA',
    
    btnOperator: '#F59E0B',
    btnOperatorActive: '#D97706',
    btnOperatorText: '#FFFFFF',
    
    btnEqual: '#3B82F6',
    btnEqualActive: '#2563EB',
    btnEqualText: '#FFFFFF',

    border: '#272A33',
    card: '#1E2027',
  },
  light: {
    background: '#F1F5F9',
    surface: '#FFFFFF',
    displayBg: '#FFFFFF',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    textDim: '#94A3B8',
    accent: '#EA580C',
    
    // Buttons
    btnNumber: '#FFFFFF',
    btnNumberActive: '#E2E8F0',
    btnNumberText: '#0F172A',
    
    btnFunction: '#E2E8F0',
    btnFunctionActive: '#CBD5E1',
    btnFunctionText: '#2563EB',
    
    btnOperator: '#F59E0B',
    btnOperatorActive: '#D97706',
    btnOperatorText: '#FFFFFF',
    
    btnEqual: '#3B82F6',
    btnEqualActive: '#2563EB',
    btnEqualText: '#FFFFFF',

    border: '#E2E8F0',
    card: '#FFFFFF',
  },
};

export type ThemeMode = 'dark' | 'light';
