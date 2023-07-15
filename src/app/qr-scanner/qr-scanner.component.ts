import { Component, ViewChild } from '@angular/core';
import { NgxScannerQrcodeComponent, ScannerQRCodeResult } from 'ngx-scanner-qrcode';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { flyInOut } from './animations';


@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.css'],
  animations: [
    flyInOut, // Import the animation here
  ]
})
export class QrScannerComponent {
  @ViewChild('action', { static: true, read: NgxScannerQrcodeComponent }) action: NgxScannerQrcodeComponent | undefined;
  private scannedCount: number = 0;
  constructor(
    private firestore: AngularFirestore,
    private toastr: ToastrService
   
  ) {
    this.scannedCount = 0;
  }

  ngOnInit(): void {
    this.action?.start();
  }
  public scannedCounts: { [id: string]: number } = {}; // Track scanned counts for each ID

  public onEvent(e: ScannerQRCodeResult[], action?: any): void {
    const qrCodeValue = e[0]?.value;
    if (qrCodeValue) {
      this.checkQRCodeInFirestore(qrCodeValue);
    }
  }
  
  private checkQRCodeInFirestore(qrCodeValue: string): void {
    const documentPath = `data/${qrCodeValue}`;
    const currentCount = this.scannedCounts[qrCodeValue] || 0;
    if (currentCount < 4) {
      this.firestore.doc(documentPath).get().subscribe((doc) => {
        if (doc.exists) {
          this.toastr.success('QR Code ID exists in Firestore', 'QR Code Validation');
          this.scannedCounts[qrCodeValue] = currentCount + 1;
        } else {
          this.toastr.error('QR Code ID does not exist in Firestore', 'QR Code Validation');
        }
        this.scannedCounts[qrCodeValue] = currentCount + 1;
      });
    } else {
      this.toastr.error('QR Code scanning limit exceeded', 'Error');
    }
  }
  
}
