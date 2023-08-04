import { useEffect, useState } from 'react';
import Post from './Post';

import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/firebase';

function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, 'posts'), orderBy('timestamp', 'desc')),
        (snapshot) => {
          const postData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // console.log(postData);
          setPosts(postData);
        }
      ),

    [db]
  );

  return (
    <div>
      {posts.map((post) => (
        <Post
          key={post.uuid}
          id={post.id}
          username={post.username}
          userImg={post.profileImg}
          img={post.image}
          caption={post.caption}
        />
      ))}
    </div>
  );
}

export default Posts;
