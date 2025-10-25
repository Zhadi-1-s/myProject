// slot.interface.ts
export interface Slot {
  _id?: string;
  product: string;              
  pawnshopId: string;          
  userId: string;               
  loanAmount: number;           // сумма займа
  startDate: Date;              
  endDate: Date;               
  interestRate: number;         // процент, например 0.5 (0.5% в день)
  status: 'active' | 'closed' | 'expired'; // состояние слота
  createdAt?: Date;
  updatedAt?: Date;
}
