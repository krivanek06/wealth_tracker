import { DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';

export const assignTypesClient = <T extends object>() => {
	return {
		toFirestore(doc: T): DocumentData {
			return doc;
		},
		fromFirestore(snapshot: QueryDocumentSnapshot): T {
			return snapshot.data() as T;
		},
	};
};
