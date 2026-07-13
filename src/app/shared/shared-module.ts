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
import { LoadingSpinner } from './components/loading-spinner/loading-spinner';
import { EmptyState } from './components/empty-state/empty-state';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [UiButton, UiInput, UiSimplePageNavigator, PageToc, HistoryChapter, SourcesBox, TransparentCard, LoadingSpinner, EmptyState],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, TranslateModule],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    UiButton,
    UiInput,
    UiSimplePageNavigator,
    PageToc,
    HistoryChapter,
    SourcesBox,
    TransparentCard,
    LoadingSpinner,
    EmptyState
  ],
})
export class SharedModule {}
