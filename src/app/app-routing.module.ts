import { NotFoundComponent } from './not-found/not-found.component';
import { TestPageComponent } from './test-page/test-page.component';
import { MainPageComponent } from './main-page/main-page.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExtentComponent } from './extent/extent.component';


const routes: Routes = [
  {
    path: 'main_page', component: MainPageComponent
  },
  {
    path: 'test_page', component: TestPageComponent
  },
  // For page not found
  {
    path: '404', component: NotFoundComponent
  },
  {
    path: '', component: MainPageComponent
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
