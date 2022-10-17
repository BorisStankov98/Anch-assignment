import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
		path: 'table',
		loadChildren: () => import('./table/table.module').then((value) => value.TableModule),
	},
  {
		path: 'data-visualisation',
		loadChildren: () => import('./data-visualisation/data-visualisation.module').then((value) => value.DataVisualisationModule),
	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
