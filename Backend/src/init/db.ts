import FirebaseAdmin from "../init/firebase-admin";
import {
  WithFieldValue,
  QueryDocumentSnapshot,
  FirestoreDataConverter,
} from "firebase-admin/firestore";

export const converter = <T>(): FirestoreDataConverter<T> => ({
  toFirestore: (data: WithFieldValue<T>): FirebaseFirestore.DocumentData => {
    return { data };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot): T => {
    const data = snapshot.data();
    return data as T;
  },
});

export function collection<T>(
  collectionName: string,
): FirebaseFirestore.CollectionReference<T> {
  return FirebaseAdmin()
    .firestore()
    .collection(collectionName)
    .withConverter(converter<T>());
}

export function collectionGroup<T>(
  collectionGroupName: string,
): FirebaseFirestore.CollectionGroup<T> {
  return FirebaseAdmin()
    .firestore()
    .collectionGroup(collectionGroupName)
    .withConverter(converter<T>());
}
