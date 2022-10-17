import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataVisualisationComponent } from './data-visualisation.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { LineChartComponent } from './line-chart/line-chart.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';

@NgModule({
  declarations: [
    DataVisualisationComponent,
    BarChartComponent,
    LineChartComponent,
    PieChartComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    MatIconModule,
    RouterModule.forChild([
      {
        path: '',
        component: DataVisualisationComponent,
      },
    ]),
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'), // Import all modules from echarts:
    }),
  ],

  providers: [],
  bootstrap: [],
})
export class DataVisualisationModule {}
