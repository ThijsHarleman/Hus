import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HusComponent } from './hus/hus.component';
import { GamePropertiesModalComponent } from './game-properties-modal/game-properties-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { GameSimulationModalComponent } from './game-simulation-modal/game-simulation-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HusComponent,
    GamePropertiesModalComponent,
    GameSimulationModalComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
