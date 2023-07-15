import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FirestoreService } from '../firestore.service';
import * as QRCode from 'qrcode';
import { log } from 'console';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  title = 'Register Process';
  myForm!: FormGroup;
  data: any
  base64Image!: string;
  documentData$: any;
  i=0
  constructor(private formBuilder: FormBuilder, private firestoreService: FirestoreService) { }


  ngOnInit() {
    this.myForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      company: ['', Validators.required],
      phone: ['', [Validators.required]]
    });
    const qrCodeValue = 'https://web.whatsapp.com/'; // Replace with your unique value

    QRCode.toDataURL(qrCodeValue, (error, dataURL) => {
      if (error) {
        console.error(error);
      } else {
        this.base64Image = dataURL;
        // console.log('QR', dataURL);

      }
    });
  }


  // }

  get formControls() {
    return this.myForm.controls;
  }

  onSubmit() {
    if (this.myForm.invalid) {
      return;
    }
    // Form is valid, perform desired action here
    console.log(this.myForm.value.name);
    this.data = {
      name: this.myForm.value.name,
      company: this.myForm.value.company,
      phone: this.myForm.value.phone,
      email: this.myForm.value.email,
      count: 0
    }
    this.saveUser()
  }

  getUser() {
    const userId = 'hvoPAdfJd85O5WTol7wV';
    this.firestoreService.getUserDataById(userId)
      .subscribe((userData) => {
        const count = userData.count + 1;
        this.firestoreService.updateUserDataCount(userId)
          .then(() => {
            console.log('User data count updated successfully',count);
          })
          .catch((error) => {
            console.error('Error updating user data count:', error);
          });
      });
  }

    // this.updateDocument(count)
        // if (count < 65) {
        //   const updatedCount = count + 1;
        //   this.updateDocument(updatedCount);
        //   console.log('Updated count:', updatedCount);
        // } else {
        //   console.log('Count is already 35 or more');
        // }
  
  updateDocument(updatedCount: number) {
    if(updatedCount > 100){
      console.log('yess');
    }
    else{
      console.log('noo');
       const collection = 'users';
    const documentId = 'Su3v49OSQDzmyixfJLSw';
    const newData = {
      count: updatedCount + 1,
    };
  
    this.firestoreService.updateDocument(collection, documentId, newData)
      .then((updatedData) => {
        // Document updated successfully
        console.log('Document updated', updatedData);
       return
      })
      .catch((error) => {
        // Error occurred while updating the document
        console.error('Error updating document:', error);
        return
      });
      
    }
   
  }
  
  saveUser() {
    this.firestoreService.saveUserData(this.data)
      .then((docRef) => {
        console.log('User data saved with ID:', docRef.id);

      })
      .catch((error) => {
        console.error('Error saving user data:', error);
      });
  }

}

// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import * as QRCode from 'qrcode';
// import { FirestoreService } from '../firestore.service';
// import { AngularFirestore } from '@angular/fire/compat/firestore';

// @Component({
//   selector: 'app-form',
//   templateUrl: './form.component.html',
//   styleUrls: ['./form.component.css']
// })
// export class FormComponent {
//   title = 'Register Process';
//   myForm!: FormGroup;
//   data: any;
//   base64Image!: string;
//   clickCount = 0;
//   userData: any;
//   isClicked = false;

//   constructor(
//     private formBuilder: FormBuilder,
//     private firestoreService: FirestoreService,
//     private firestore: AngularFirestore
//   ) {}

//   ngOnInit() {
//     this.myForm = this.formBuilder.group({
//       name: ['', Validators.required],
//       email: ['', [Validators.required, Validators.email]],
//       company: ['', Validators.required],
//       phone: ['', [Validators.required]]
//     });

//     const qrCodeValue = 'https://web.whatsapp.com/'; // Replace with your unique value

//     QRCode.toDataURL(qrCodeValue, (error, dataURL) => {
//       if (error) {
//         console.error(error);
//       } else {
//         this.base64Image = dataURL;
//       }
//     });
//   }

//   get formControls() {
//     return this.myForm.controls;
//   }

//   onSubmit() {
//     if (this.myForm.invalid) {
//       return;
//     }

//     // Form is valid, perform desired action here
//     this.data = {
//       name: this.myForm.value.name,
//       company: this.myForm.value.company,
//       phone: this.myForm.value.phone,
//       email: this.myForm.value.email,
//       count: 0
//     };

//     this.saveUser();
//   }

//   saveUser() {
//     this.firestoreService.saveUserData(this.data)
//       .then((docRef) => {
//         console.log('User data saved with ID:', docRef.id);
//       })
//       .catch((error) => {
//         console.error('Error saving user data:', error);
//       });
//   }

//   incrementClickCount() {
//     if (this.isClicked) {
//       return;
//     }

//     this.isClicked = true;
//     this.clickCount+1;
//     console.log('Click count:', this.clickCount);
//     this.updateClickCount(this.clickCount);
//   }

//   updateClickCount(count: number) {
//     const collection = 'users';
//     const documentId = '7DqciarVfDoyFNqqyA3f'; // Replace with the actual document ID
//     const newData = { count: count };

//     this.firestore.collection(collection).doc(documentId).update(newData)
//       .then(() => {
//         console.log('Click count updated successfully.');
//         this.getUser();
//       })
//       .catch((error) => {
//         console.error('Error updating click count:', error);
//       });
//   }

//   getUser() {
//     const userId = '7DqciarVfDoyFNqqyA3f';
//     this.firestoreService.getUserDataById(userId)
//       .subscribe((userData) => {
//         console.log('User data:', userData.count);
//         this.userData = userData+1;
//       });
//   }
// }

