export interface CircleRate {
  id: string;
  name: string;
  marketPrice: number;
  specialPrice: number;
  discount: number;
  change: string;
  isUp: boolean | null;
  lastUpdated: string;
}

export const REGIONAL_CIRCLES: CircleRate[] = [
  {
    id: 'gokavaram',
    name: 'Gokavaram Circle',
    marketPrice: 150,
    specialPrice: 145,
    discount: 5,
    change: 'Stable',
    isUp: null,
    lastUpdated: '10 min ago',
  },
  {
    id: 'rajahmundry',
    name: 'Rajahmundry Circle',
    marketPrice: 152,
    specialPrice: 147,
    discount: 5,
    change: '+₹2.00',
    isUp: true,
    lastUpdated: '5 min ago',
  },
  {
    id: 'kakinada',
    name: 'Kakinada Circle',
    marketPrice: 148,
    specialPrice: 143,
    discount: 5,
    change: '-₹2.00',
    isUp: false,
    lastUpdated: '15 min ago',
  },
  {
    id: 'amalapuram',
    name: 'Amalapuram Circle',
    marketPrice: 154,
    specialPrice: 149,
    discount: 5,
    change: '+₹4.00',
    isUp: true,
    lastUpdated: '8 min ago',
  },
  {
    id: 'tanuku',
    name: 'Tanuku Circle',
    marketPrice: 149,
    specialPrice: 144,
    discount: 5,
    change: '-₹1.00',
    isUp: false,
    lastUpdated: '12 min ago',
  },
  {
    id: 'ravulapalem',
    name: 'Ravulapalem Circle',
    marketPrice: 151,
    specialPrice: 146,
    discount: 5,
    change: '+₹1.00',
    isUp: true,
    lastUpdated: '3 min ago',
  },
  {
    id: 'eluru',
    name: 'Eluru Circle',
    marketPrice: 153,
    specialPrice: 148,
    discount: 5,
    change: '+₹3.00',
    isUp: true,
    lastUpdated: '20 min ago',
  },
  {
    id: 'vijayawada',
    name: 'Vijayawada Circle',
    marketPrice: 156,
    specialPrice: 151,
    discount: 5,
    change: '+₹6.00',
    isUp: true,
    lastUpdated: '2 min ago',
  },
];
