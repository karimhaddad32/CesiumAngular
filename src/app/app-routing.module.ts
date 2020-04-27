import { NotFoundComponent } from './not-found/not-found.component';
import { MainPageComponent } from './main-page/main-page.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExtentComponent } from './extent/extent.component';


const routes: Routes = [
  {
    path: '', component: MainPageComponent
  },
  {
    path: 'main_page', component: MainPageComponent
  },
  // For page not found
  {
    path: '404', component: NotFoundComponent
  },
  {
    path: ':name', component: ExtentComponent
  },
  // If any link does not exists.
  {
    path: '**', component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
