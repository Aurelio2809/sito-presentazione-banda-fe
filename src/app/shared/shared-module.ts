import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UiButton } from './components/ui-button/ui-button';
import { UiInput } from './components/ui-input/ui-input';
import { UiSimplePageNavigator } from './components/ui-simple-page-navigator/ui-simple-page-navigator';
import { PageToc } from './components/page-toc/page-toc';
import { HistoryChapter } from './components/history-chapter/history-chapter';
import { SourcesBox } from './components/sources-box/sources-box';
import { TransparentCard } from './components/transparent-card/transparent-card';

@NgModule({
  declarations: [UiButton, UiInput, UiSimplePageNavigator, PageToc, HistoryChapter, SourcesBox, TransparentCard],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    UiButton,
    UiInput,
    UiSimplePageNavigator,
    PageToc,
    HistoryChapter,
    SourcesBox,
    TransparentCard
  ],
})
export class SharedModule {}
