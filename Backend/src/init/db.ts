import FirebaseAdmin from "../init/firebase-admin";
import {
  WithFieldValue,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase-admin/firestore";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const converter = <T>() => ({
  toFirestore: (data: WithFieldValue<T>): WithFieldValue<T> => {
    return data;
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot): T => {
    const data = snapshot.data()!;
    return data as T;
  },
});

export function collection<T extends DocumentData>(
  collectionName: string,
): FirebaseFirestore.CollectionReference<T> {
  return FirebaseAdmin()
    .firestore()
    .collection(collectionName)
    .withConverter(converter<T>());
}

export function collectionGroup<T extends DocumentData>(
  collectionGroupName: string,
): FirebaseFirestore.CollectionGroup<T> {
  return FirebaseAdmin()
    .firestore()
    .collectionGroup(collectionGroupName)
    .withConverter(converter<T>());
}
