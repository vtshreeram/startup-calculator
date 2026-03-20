import { Persona } from '../types';

export const PERSONAS: Persona[] = [
  {
    id: 'ceo-saas',
    role: 'CEO',
    industryId: 'saas',
    description: 'Visionary leader focusing on strategy, fundraising, and overall growth.',
    typicalResponsibilities: ['Strategy', 'Fundraising', 'Hiring', 'Partnerships']
  },
  {
    id: 'cto-saas',
    role: 'CTO',
    industryId: 'saas',
    description: 'Technical lead responsible for architecture, development, and tech stack.',
    typicalResponsibilities: ['Architecture', 'Development', 'DevOps', 'Security']
  },
  {
    id: 'coo-fintech',
    role: 'COO',
    industryId: 'fintech',
    description: 'Operations leader focusing on compliance, processes, and daily management.',
    typicalResponsibilities: ['Compliance', 'Internal Processes', 'Customer Ops', 'Reporting']
  },
  {
    id: 'product-healthtech',
    role: 'Product Lead',
    industryId: 'healthtech',
    description: 'Focused on patient outcomes, regulatory compliance, and product market fit.',
    typicalResponsibilities: ['Regulatory Compliance', 'User Research', 'Roadmap', 'QA']
  }
];
