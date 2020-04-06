import { TestPageComponent } from './test-page/test-page.component';
import { MainPageComponent } from './main-page/main-page.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'main_page', component: MainPageComponent
  },
  {
    path: 'test_page', component: TestPageComponent
  },
  {
    path: '', component: MainPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
