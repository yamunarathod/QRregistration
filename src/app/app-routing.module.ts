import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QrScannerComponent } from './qr-scanner/qr-scanner.component';
import { FormComponent } from './form/form.component';

const routes: Routes = [
  { path: '', component: FormComponent },
    { path: 'qr', component: QrScannerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
