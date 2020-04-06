// import { CDBsService } from './cdbs.service';
// import { BrowserModule } from '@angular/platform-browser';
// import { NgModule } from '@angular/core';
// import { AppComponent } from './app.component';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { AppRoutingModule } from './app-routing.module';
// import { CesiumComponent } from './cesium/cesium.component';
// import { HttpClientModule } from '@angular/common/http';
// import { PresagisCDBsComponent } from './presagis-cdbs/presagis-cdbs.component';

// //Material
// import {
//   MatCheckboxModule,
//   MatExpansionModule,
//   MatTreeModule,
//   MatButtonModule,
//   MatIconModule,
//   MatDividerModule
// } from '@angular/material';


// @NgModule({
//   declarations: [
//     AppComponent,
//     CesiumComponent,
//     PresagisCDBsComponent
//   ],

//   imports: [
//     BrowserAnimationsModule,
//     BrowserModule,
//     AppRoutingModule,
//     HttpClientModule,
//     MatExpansionModule,
//     MatCheckboxModule,
//     MatTreeModule,
//     MatIconModule,
//     MatButtonModule,
//     MatDividerModule
//   ],
//   providers: [CDBsService],
//   bootstrap: [AppComponent]
// })
// export class AppModule { }

import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FooterComponent } from './footer/footer.component';
import { SideBarComponent } from './side-bar/side-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    FooterComponent,
    SideBarComponent,
  ],

  imports: [
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

