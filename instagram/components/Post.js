import { db } from '@/firebase';
import {
  HeartIcon,
  PaperAirplaneIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  EllipsisHorizontalIcon,
  BookmarkIcon,
  FaceSmileIcon,
} from '@heroicons/react/24/outline';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { HeartIcon as HeartIconFilled } from '@heroicons/react/24/solid';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Moment from 'react-moment';

import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import useComponentVisible from '@/hooks/useComponentVisible';

function Post({ id, username, userImg, img, caption }) {
  const { data: session } = useSession();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [commentLikes, setCommentLikes] = useState([]);
  const [hasLikedComment, setHasLikedComment] = useState(false);

  const [currentEmoji, setCurrentEmoji] = useState(null);
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false); // Initialize with false or true, depending on your use case
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);

  const handleEllipsisClick = () => {
    setIsDeleteVisible(!isDeleteVisible);
  };

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, 'posts', id, 'comments'),
          orderBy('timestamp', 'desc')
        ),
        (snapshot) => setComments(snapshot.docs)
      ),
    [db, id]
  );

  useEffect(
    () =>
      onSnapshot(query(collection(db, 'posts', id, 'likes')), (snapshot) =>
        setLikes(snapshot.docs)
      ),
    [db, id]
  );

  useEffect(() => {
    setHasLiked(
      likes.findIndex((like) => like.id === session?.user?.uid) !== -1
    );
  }, [likes]);

  const likePost = async () => {
    if (hasLiked) {
      await deleteDoc(doc(db, 'posts', id, 'likes', session.user.uid));
    } else {
      await setDoc(doc(db, 'posts', id, 'likes', session.user.uid), {
        username: session.user.username,
      });
    }
  };

  const deletePost = async () => {
    try {
      // Delete the post document
      await deleteDoc(doc(db, 'posts', id));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, 'posts', id, 'commentlikes')),
        (snapshot) => setCommentLikes(snapshot.docs)
      ),
    [db, id]
  );

  useEffect(() => {
    setHasLikedComment(
      commentLikes.findIndex((like) => like.id === session?.user?.uid) !== -1
    );
  }, [commentLikes]);

  const likeComment = async () => {
    if (hasLikedComment) {
      await deleteDoc(doc(db, 'posts', id, 'commentlikes', session.user.uid));
    } else {
      await setDoc(doc(db, 'posts', id, 'commentlikes', session.user.uid), {
        username: session.user.username,
      });
    }
  };

  const sendComment = async (e) => {
    e.preventDefault();

    const commentToSend = comment;
    setComment('');

    await addDoc(collection(db, 'posts', id, 'comments'), {
      comment: commentToSend,
      username: session?.user?.username,
      userImage: session?.user?.image,
      timestamp: serverTimestamp(),
    });
  };

  return (
    <div className='bg-white my-7 border rounded-sm'>
      <div className='flex items-center p-2 p'>
        <img
          src={userImg}
          className='rounded-full h-12 w-12 object-contain border p-1 mr-3'
          alt=''
        />
        <p className='flex-1 font-bold'>{username}</p>
        <EllipsisHorizontalIcon
          className='h-5 cursor-pointer'
          onClick={handleEllipsisClick}
        />
      </div>

      {isDeleteVisible && (
        <div className='flex justify-end'>
          <button
            className='mr-5 mb-1 p-1 pl-3 pr-3 
          bg-blue-500 rounded-lg text-white'
            onClick={deletePost}
          >
            Delete
          </button>
        </div>
      )}

      <img src={img} className='object-cover w-full' alt='' />

      {session && (
        <div className='flex justify-between px-4 pt-4'>
          <div className='flex space-x-4'>
            {hasLiked ? (
              <HeartIconFilled
                onClick={likePost}
                className='btn text-red-500'
              />
            ) : (
              <HeartIcon onClick={likePost} className='btn' />
            )}
            <ChatBubbleOvalLeftEllipsisIcon className='btn' />
            <PaperAirplaneIcon className='btn -rotate-90' />
          </div>

          <BookmarkIcon className='btn' />
        </div>
      )}

      <div className='p-5 truncate'>
        {likes.length > 0 && (
          <p className='font-bold mb-1'>{likes.length} likes</p>
        )}

        <span className='font-bold mr-1'>{username}</span>
        {caption}
      </div>

      {comments.length > 0 && (
        <div className='ml-10 h-20 overflow-y-scroll scrollbar-thumb-black scrollbar-thin'>
          {comments.map((comment) => (
            <div key={comment.id} className='flex items-center space-x-2 mb-3'>
              <img
                className='h-7 rounded-full'
                src={comment.data().userImage}
                alt=''
              />
              <div className='text-sm flex-1'>
                <span className='font-bold'>{comment.data().username}</span>{' '}
                {comment.data().comment}
                <p className='flex items-center space-x-2'>
                  <small>{commentLikes.length} likes</small>{' '}
                  <Moment fromNow className='pr-5 text-[0.65rem]'>
                    {comment.data().timestamp?.toDate()}
                  </Moment>
                </p>
              </div>
              <div>
                {hasLikedComment ? (
                  <HeartIconFilled
                    onClick={likeComment}
                    className='btn text-red-500 mr-4'
                  />
                ) : (
                  <HeartIcon onClick={likeComment} className='btn mr-4' />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {session && (
        <form className='flex items-center p-4'>
          <FaceSmileIcon
            className='h-7 navBtn'
            onClick={() => {
              setIsComponentVisible(!isComponentVisible);
            }}
          />

          {isComponentVisible && (
            <div className='picker-overlay'>
              <div ref={ref}>
                <Picker
                  className='top-2'
                  data={data}
                  previewPosition='none'
                  onEmojiSelect={(e) => {
                    setCurrentEmoji(e.native);
                    setComment(comment + e.native);
                    setIsComponentVisible(false);
                  }}
                />
              </div>
            </div>
          )}
          <input
            type='text'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder='Add a comment...'
            className='border-none flex-1 focus:ring-0 outline-none'
          />
          <button
            type='submit'
            disabled={!comment.trim()}
            onClick={sendComment}
            className='font-semibold text-blue-400'
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
