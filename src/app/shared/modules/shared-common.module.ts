import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { RouterLink, RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterLink
  ],
  exports: [
    CommonModule,
    RouterModule,
    //BrowserModule,
    //BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    
  ]
})
export class SharedCommonModule {}