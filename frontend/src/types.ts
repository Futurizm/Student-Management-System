export interface Group {
    id: number;
    name: string;
    startDate?: Date | string;
    endDate?: Date | string;
    specialty?: string;
    description?: string;
    students?: Student[];
    schedule?: any; // You might want to define a more specific type for schedule
    teacherId?: number;
    teacher?: Teacher;
    courseNumberId?: number;
  }
  
  export interface Teacher {
    id: number;
    userId: number;
    lastName?: string;
    firstName?: string;
    middleName?: string;
    user?: {
      name?: string;
    };
  }
  
  export interface Student {
    id: number;
    iin?: string;
    lastName?: string;
    firstName?: string;
    middleName?: string;
  }