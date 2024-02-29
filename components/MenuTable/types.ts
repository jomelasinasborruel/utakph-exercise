interface Data {
  id: string;
  name: string;
  category: string;
  options: string;
  price: number;
  cost: number;
  numberOfStocks: number;
  dateCreated: string;
  deletedAt: string | 0;
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  alignRight: boolean;
}


