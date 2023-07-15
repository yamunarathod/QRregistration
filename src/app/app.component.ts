import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

interface DataItem {
  UNIQUECODE: string;
  NUMBER: string;
  COUNT: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private dataDoc: AngularFirestoreDocument<DataItem>;
  data$: Observable<DataItem>;
  NUMBER: string;

  constructor(
    private firestore: AngularFirestore,
    private toastr: ToastrService
  ) {}

  getDataById(): void {
    if (this.NUMBER) {
      const documentPath = `data/${this.NUMBER}`;
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

          this.dataDoc.update({ COUNT: updatedCount })
            .catch(error => {
              console.log('Error updating document:', error);
            });
        } else {
          this.toastr.error('Bad Unique Code', 'ID Error');
        }
      });
    }
  }
}
