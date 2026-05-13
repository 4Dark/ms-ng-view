import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-countdown',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountdownComponent { }