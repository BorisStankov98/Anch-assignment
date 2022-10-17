import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataVisualisationComponent } from './data-visualisation.component';
@NgModule({

  declarations: [
    DataVisualisationComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    MatIconModule,
    RouterModule.forChild([
      {
        path: '',
        component:DataVisualisationComponent ,
    },
    ]),
  ],
  providers: [],
  bootstrap: []
})
export class DataVisualisationModule { }
