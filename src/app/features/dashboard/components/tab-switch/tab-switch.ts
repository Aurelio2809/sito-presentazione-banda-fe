import { Component, Input, Output, EventEmitter } from '@angular/core';

export type TabItem = {
  id: string;
  label: string;
  count?: number;
};

@Component({
  selector: 'app-tab-switch',
  templateUrl: './tab-switch.html',
  styleUrls: ['./tab-switch.css'],
  standalone: false,
})
export class TabSwitch {
  @Input() tabs: TabItem[] = [];
  @Input() activeTab = '';
  @Output() tabChange = new EventEmitter<string>();

  selectTab(tabId: string): void {
    if (tabId !== this.activeTab) {
      this.tabChange.emit(tabId);
    }
  }
}
