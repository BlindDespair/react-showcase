export interface Campaign {
  readonly id: number;
  readonly name: string;
  readonly budget: number;
  readonly startDate: Date;
  readonly endDate: Date;
  readonly isActive: boolean;
}
