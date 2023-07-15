import { Component, ViewChild, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxScannerQrcodeComponent, ScannerQRCodeResult } from 'ngx-scanner-qrcode';

interface DataItem {
  UNIQUECODE: string;
  NUMBER: string;
  COUNT: number;
}

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.css'],
})
export class QrScannerComponent implements OnInit {
  @ViewChild('action', { static: true, read: NgxScannerQrcodeComponent })
  action: NgxScannerQrcodeComponent | undefined;
  private dataDoc: AngularFirestoreDocument<DataItem>;
  data$: Observable<DataItem>;
  private isScanned = false;
  private scanCount = 0;

  constructor(
    private firestore: AngularFirestore,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.startScanning();
  }

  private startScanning(): void {
    this.action?.start();
  }

  public onEvent(e: ScannerQRCodeResult[], action?: any): void {
    if (this.isScanned || this.scanCount >= 4) {
      return;
    }

    if (e && e.length > 0) {
      const scannedValue = e[0].value;

      const documentPath = `data/${scannedValue}`;
      this.dataDoc = this.firestore.doc<DataItem>(documentPath);
      this.data$ = this.dataDoc.valueChanges();

      this.dataDoc.ref.get().then((doc) => {
        if (doc.exists) {
          const currentCount = doc.data()?.COUNT || 0;
          const updatedCount = currentCount + 1;

          if (updatedCount > 4) {
            this.toastr.error('Error: Count exceeds 4', 'Count Error');
            return;
          }

          this.dataDoc.update({ COUNT: updatedCount }).then(() => {
            this.toastr.success('Count updated successfully', 'Success');
            this.scanCount++;

            if (this.scanCount >= 4) {
              this.stopScanning();
              this.reloadPage();
            }
          }).catch((error) => {
            console.log('Error updating document:', error);
          });
        } else {
          this.toastr.error('Bad Unique Code', 'ID Error');
        }

        this.isScanned = true;
      });
    }
  }

  private stopScanning(): void {
    this.action?.stop();
  }

  private reloadPage(): void {
    setTimeout(() => {
      location.reload();
    }, 2000); // Delay before reloading the page (2 seconds)
  }
}
