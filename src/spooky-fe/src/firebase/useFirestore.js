import { collection, onSnapshot, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from './config';

const useFirestore = async (collectionName = 'gallery') => {
  const [documents, setDocuments] = useState([]);

  // const citiesRef = db.collection('gallery');
  // const snapshot2 = await citiesRef.get();
  // snapshot2.forEach((doc) => {
  //   console.log(doc.id, '=>', doc.data());
  // });

  useEffect(() => {
    const q = query(collection(db, collectionName));
    console.log(q);
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = [];
        console.log(snapshot);
        snapshot.forEach((doc) => {
          console.log(doc);
          docs.push({ id: doc.id, data: doc.data() });
        });
        console.log(docs);
        setDocuments(docs);
      },
      (error) => {
        alert(error.message);
        console.log(error);
      }
    );
    return () => unsubscribe();
  }, [collectionName]);

  return { documents };
};

export default useFirestore;
