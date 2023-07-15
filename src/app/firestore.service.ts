import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { Observable, throwError } from 'rxjs';
import firebase from 'firebase/compat/app';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  
  data:any
  constructor(private firestore: AngularFirestore) {}


    // Create a new document
    saveUserData( data: any): Promise<DocumentReference<firebase.firestore.DocumentData>> {
      return this.firestore.collection('data').add(data);
    }
 
    // Read a single document by ID
    getUserDataById(userId: string): Observable<any> {
      return this.firestore.collection('data').doc(userId).snapshotChanges()
        .pipe(
          map((snapshot) => {
            this.data = snapshot.payload.data();
            const id = snapshot.payload.id;
            return { id, ...this.data };
          })
        );
    }
    // Update a document
    updateUser(data:any): Promise<void> {
      return this.firestore.collection('data').doc(data.userId).update(data.name);
    }
    updateUserDataCount(userId: string): Promise<void> {
      return this.firestore.collection('data').doc(userId).update({
        count: firebase.firestore.FieldValue.increment(+1)
      });
    }
    
  
    // Delete a document
    deleteUser( userId: string): Promise<void> {
      return this.firestore.collection('d').doc(userId).delete();
    }
    updateDocument(collection: string, documentId: string, newData: any): Promise<any> {
      return this.firestore.collection(collection).doc(documentId).update(newData)
        .then(() => {
          return this.firestore.collection(collection).doc(documentId).get().toPromise();
        })
        .then((docSnapshot) => {
          if (docSnapshot.exists) {
            return docSnapshot.data();
          } else {
            throw new Error('Document not found');
          }
        });
    }

  // getUserData(userID: string): Observable<any> {
  //   return this.firestore
  //     .collection('users')
  //     .doc(userID)
  //     .get()
  //     .pipe(
  //       map((docSnapshot) => {
  //         if (docSnapshot.exists) {
  //           return console.log(docSnapshot.data());
  //           ;
  //         } else {
  //           throw new Error('User data not found.');
  //         }
  //       }),
  //       catchError((error) => {
  //         return throwError(error);
  //       })
  //     );
  // }


  // saveUserData(imageData: string, data: any): Promise<DocumentReference<firebase.firestore.DocumentData>> {
  //   const dataWithImage = { ...data, image: imageData }
  //   return this.firestore.collection('users').add(dataWithImage);
  // }
  
}
