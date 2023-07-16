
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
  private hasShownCountErrorMessage = false;
  private hasShownBadCodeErrorMessage = false;

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
      try {
        this.dataDoc = this.firestore.doc<DataItem>(documentPath);
        this.data$ = this.dataDoc.valueChanges();

        this.dataDoc.ref.get().then((doc) => {
          if (doc.exists) {
            const currentCount = doc.data()?.COUNT || 0;
            const updatedCount = currentCount + 1;

            if (updatedCount > 4) {
              if (!this.hasShownCountErrorMessage) {
                this.toastr.error('Error: Count exceeds 4', 'Count Error');
                this.hasShownCountErrorMessage = true;
              }
              return;
            }

            this.dataDoc
              .update({ COUNT: updatedCount })
              .then(() => {
                if (!this.hasShownCountErrorMessage) {
                  this.toastr.success('Count updated successfully', 'Success');
                  this.hasShownCountErrorMessage = true;
                  this.reloadPage();
                }

                this.scanCount++;

                if (this.scanCount >= 4) {
                  this.stopScanning();
                  this.reloadPage();
                }
              })
              .catch((error) => {
                console.log('Error updating document:', error);
              });
          } else {
            if (!this.hasShownBadCodeErrorMessage) {
              this.toastr.error('Bad Unique Code', 'ID Error');
              this.hasShownBadCodeErrorMessage = true;
            }
          }

          this.isScanned = true;
          if (!doc.exists) {
            this.reloadPage();
          }
        });
      } catch (error) {
        if (!this.hasShownBadCodeErrorMessage) {
          this.toastr.error('Bad Unique Code', 'ID Error');
          this.hasShownBadCodeErrorMessage = true;
        }
      }
    }
  }

  private stopScanning(): void {
    this.action?.stop();
  }

  private reloadPage(): void {
    setTimeout(() => {
      location.reload();
    }, 1000); // Delay before reloading the page (2 seconds)
  }
}

















































// import { Component, ViewChild, OnInit } from '@angular/core';
// import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
// import { Observable } from 'rxjs';
// import { ToastrService } from 'ngx-toastr';
// import { NgxScannerQrcodeComponent, ScannerQRCodeResult } from 'ngx-scanner-qrcode';

// interface DataItem {
//   UNIQUECODE: string;
//   NUMBER: string;
//   COUNT: number;
// }

// @Component({
//   selector: 'app-qr-scanner',
//   templateUrl: './qr-scanner.component.html',
//   styleUrls: ['./qr-scanner.component.css'],
// })
// export class QrScannerComponent implements OnInit {
//   @ViewChild('action', { static: true, read: NgxScannerQrcodeComponent })
//   action: NgxScannerQrcodeComponent | undefined;
//   private dataDoc: AngularFirestoreDocument<DataItem>;
//   data$: Observable<DataItem>;
//   private isScanned = false;
//   private scanCount = 0;
//   private hasShownCountErrorMessage = false;
//   private hasShownBadCodeErrorMessage = false;

//   constructor(
//     private firestore: AngularFirestore,
//     private toastr: ToastrService
//   ) {}

//   ngOnInit(): void {
//     this.startScanning();
//   }

//   private startScanning(): void {
//     this.action?.start();
//   }

//   public onEvent(e: ScannerQRCodeResult[], action?: any): void {
//     if (this.isScanned || this.scanCount >= 4) {
//       return;
//     }

//     if (e && e.length > 0) {
//       const scannedValue = e[0].value;

//       const documentPath = `data/${scannedValue}`;
//       try {
//         this.dataDoc = this.firestore.doc<DataItem>(documentPath);
//         this.data$ = this.dataDoc.valueChanges();

//         this.dataDoc.ref.get().then((doc) => {
//           if (doc.exists) {
//             const currentCount = doc.data()?.COUNT || 0;
//             const updatedCount = currentCount + 1;

//             if (updatedCount > 4) {
//               if (!this.hasShownCountErrorMessage) {
//                 this.toastr.error('Error: Count exceeds 4', 'Count Error');
//                 this.hasShownCountErrorMessage = true;
//               }
//               return;
//             }

//             this.dataDoc
//               .update({ COUNT: updatedCount })
//               .then(() => {
//                 if (!this.hasShownCountErrorMessage) {
//                   this.toastr.success('Count updated successfully', 'Success');
//                   this.hasShownCountErrorMessage = true;
//                 }

//                 this.scanCount++;

//                 if (this.scanCount >= 4) {
//                   this.stopScanning();
//                   this.reloadPage();
//                 }
//               })
//               .catch((error) => {
//                 console.log('Error updating document:', error);
//               });
//           } else {
//             if (!this.hasShownBadCodeErrorMessage) {
//               this.toastr.error('Bad Unique Code', 'ID Error');
//               this.hasShownBadCodeErrorMessage = true;
//             }
//           }

//           this.isScanned = true;
//           if (!doc.exists) {
//             this.reloadPage();
//           }
//         });
//       } catch (error) {
//         this.toastr.error('Invalid QR Code', 'QR Code Error');
       
//       }
//     }
//   }

//   private stopScanning(): void {
//     this.action?.stop();
//   }

//   private reloadPage(): void {
//     setTimeout(() => {
//       location.reload();
//     }, 2000); // Delay before reloading the page (2 seconds)
//   }
// }

