import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UiButton } from './components/ui-button/ui-button';
import { UiInput } from './components/ui-input/ui-input';

@NgModule({
  declarations: [UiButton, UiInput],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    UiButton,
    UiInput,
  ],
})
export class SharedModule {}
