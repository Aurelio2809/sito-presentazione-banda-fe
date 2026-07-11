import { Component } from '@angular/core';
import { PageHeaderAction } from '../../components/page-header/page-header';

@Component({
  selector: 'app-about-school',
  templateUrl: './about-school.html',
  styleUrls: ['./about-school.css'],
  standalone: false,
})
export class AboutSchool {
  headerActions: PageHeaderAction[] = [
    { label: 'ABOUT_SCHOOL.ACT_BACK', routerLink: '/about', variant: 'ghost' },
    { label: 'ABOUT_SCHOOL.ACT_ENROLL', routerLink: '/contacts', variant: 'primary' },
  ];

  levels = [
    {
      title: 'ABOUT_SCHOOL.LEVEL_BASE_TITLE',
      subtitle: 'ABOUT_SCHOOL.LEVEL_BASE_SUBTITLE',
      items: [
        'ABOUT_SCHOOL.LEVEL_BASE_ITEM_1',
        'ABOUT_SCHOOL.LEVEL_BASE_ITEM_2',
        'ABOUT_SCHOOL.LEVEL_BASE_ITEM_3',
        'ABOUT_SCHOOL.LEVEL_BASE_ITEM_4',
      ],
    },
    {
      title: 'ABOUT_SCHOOL.LEVEL_INTER_TITLE',
      subtitle: 'ABOUT_SCHOOL.LEVEL_INTER_SUBTITLE',
      items: [
        'ABOUT_SCHOOL.LEVEL_INTER_ITEM_1',
        'ABOUT_SCHOOL.LEVEL_INTER_ITEM_2',
        'ABOUT_SCHOOL.LEVEL_INTER_ITEM_3',
        'ABOUT_SCHOOL.LEVEL_INTER_ITEM_4',
      ],
    },
    {
      title: 'ABOUT_SCHOOL.LEVEL_ADV_TITLE',
      subtitle: 'ABOUT_SCHOOL.LEVEL_ADV_SUBTITLE',
      items: [
        'ABOUT_SCHOOL.LEVEL_ADV_ITEM_1',
        'ABOUT_SCHOOL.LEVEL_ADV_ITEM_2',
        'ABOUT_SCHOOL.LEVEL_ADV_ITEM_3',
        'ABOUT_SCHOOL.LEVEL_ADV_ITEM_4',
      ],
    },
  ];

  instruments = [
    { category: 'ABOUT_SCHOOL.INSTR_LEGNI', items: ['ABOUT_SCHOOL.INSTR_LEGNI_1', 'ABOUT_SCHOOL.INSTR_LEGNI_2', 'ABOUT_SCHOOL.INSTR_LEGNI_3', 'ABOUT_SCHOOL.INSTR_LEGNI_4'] },
    { category: 'ABOUT_SCHOOL.INSTR_OTTONI', items: ['ABOUT_SCHOOL.INSTR_OTTONI_1', 'ABOUT_SCHOOL.INSTR_OTTONI_2', 'ABOUT_SCHOOL.INSTR_OTTONI_3', 'ABOUT_SCHOOL.INSTR_OTTONI_4', 'ABOUT_SCHOOL.INSTR_OTTONI_5', 'ABOUT_SCHOOL.INSTR_OTTONI_6'] },
    { category: 'ABOUT_SCHOOL.INSTR_PERCUSSIONI', items: ['ABOUT_SCHOOL.INSTR_PERCUSSIONI_1', 'ABOUT_SCHOOL.INSTR_PERCUSSIONI_2', 'ABOUT_SCHOOL.INSTR_PERCUSSIONI_3', 'ABOUT_SCHOOL.INSTR_PERCUSSIONI_4'] },
  ];

  infoItems = [
    { icon: 'calendar', label: 'ABOUT_SCHOOL.INFO_WHEN_LABEL', value: 'ABOUT_SCHOOL.INFO_WHEN_VALUE' },
    { icon: 'clock', label: 'ABOUT_SCHOOL.INFO_HOURS_LABEL', value: 'ABOUT_SCHOOL.INFO_HOURS_VALUE' },
    { icon: 'location', label: 'ABOUT_SCHOOL.INFO_WHERE_LABEL', value: 'ABOUT_SCHOOL.INFO_WHERE_VALUE' },
    { icon: 'users', label: 'ABOUT_SCHOOL.INFO_WHO_LABEL', value: 'ABOUT_SCHOOL.INFO_WHO_VALUE' },
    { icon: 'gift', label: 'ABOUT_SCHOOL.INFO_COST_LABEL', value: 'ABOUT_SCHOOL.INFO_COST_VALUE' },
  ];
}
