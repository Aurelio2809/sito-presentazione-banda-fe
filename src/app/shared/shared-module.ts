import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UiButton } from './components/ui-button/ui-button';
import { UiInput } from './components/ui-input/ui-input';
import { UiSimplePageNavigator } from './components/ui-simple-page-navigator/ui-simple-page-navigator';

@NgModule({
  declarations: [UiButton, UiInput, UiSimplePageNavigator],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    UiButton,
    UiInput,
    UiSimplePageNavigator,
  ],
})
export class SharedModule {}
