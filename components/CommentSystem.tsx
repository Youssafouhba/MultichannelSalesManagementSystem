import React, { useState, useEffect, useRef } from 'react';
import { View,Image, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAppContext } from './AppContext';
import axios from 'axios';
import { Comment } from '@/constants/Classes';
import tw from 'tailwind-react-native-classnames';
import { Ionicons } from '@expo/vector-icons';
import GivStarRating from './GivStarRating';
import { jwtDecode } from 'jwt-decode';
import { router } from 'expo-router';
import LoginRequiredAlert from "@/components/LoginRequiredAlert"
import { format } from 'date-fns';
import StarRating from './StarRating';
interface CommentItem {
  id: string;
  content: string;
  author: string;
  createdDate: Date;
  replies: CommentItem[];
  first: boolean;
  parentId?: string;
  rating: number
}

const CommentSystem: React.FC<{ Id: string }> = ({ Id }) => {
  const { state, dispatch } = useAppContext();
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loginAlertVisible,setloginAlertVisible] = useState<boolean>(false)
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [newCommentRating, setNewCommentRating] = useState(0);
  const ws = useRef<WebSocket | null>(null);
  var cartItems = state.cartItems || {};
  var isLoggedIn = state.JWT_TOKEN !=='';
  var token = state.JWT_TOKEN;

  useEffect(() => {
    fetchComments(Id);
    //setupWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [Id]);

  const handleLogin = () => {
    console.log(Id)
    router.push(`/LoginPage?returnTo=ProductDetails&productId=${Id}`);
  };

 const handleCancel = () => {
  setloginAlertVisible(false)
 }

 {/**  const setupWebSocket = () => {
    ws.current = new WebSocket(`ws://192.168.42.7:8080/comment`);

    ws.current.onopen = () => {
      console.log('WebSocket connection established');
      // Subscribe to updates for this specific product/thread
      ws.current.send(JSON.stringify({ type: 'SUBSCRIBE', productId: Id }));
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received WebSocket message:', data);
      if (data.type === 'NEW_COMMENT') {
        console.log(data.comment)
        //handleNewComment(data.comment);
      }
    };

    ws.current.onerror = (error) => {
      console.error('Erreur WebSocket:', error);
    };

    ws.current.onclose = () => {
      console.log('Connexion WebSocket fermée');
      setTimeout(setupWebSocket, 5000);
    };
  }; */}

  const fetchComments = async (productId: string) => {
    try {
      const response = await axios.get(`${state.API_BASE_URL}/Comments/${productId}`);
      const fetchedComments: CommentItem[] = response.data;
      const filtredComments = fetchedComments.filter(comment => comment.first === true)
      const sortedComments = filtredComments.sort((a, b) => 
        new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      );
      console.log(sortedComments)
      setComments(sortedComments);
      } catch (error) {
      console.error('Erreur lors de la récupération des commentaires:', error);
      Alert.alert('Erreur', 'Impossible de charger les commentaires. Veuillez réessayer.');
    }
  };

  const handleNewComment = (newComment: CommentItem) => {
    setComments(prevComments => {
      if (newComment.first) {
        return [...prevComments, newComment];
      } else {
        return addReply(prevComments, newComment.parentId!, newComment);
      }
    });
  };

  const addReply = (commentsList: CommentItem[], parentId: string, newReply: CommentItem): CommentItem[] => {
    return commentsList.map(comment => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply]
        };
      } else if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: addReply(comment.replies, parentId, newReply)
        };
      }
      return comment;
    });
  };

  const handleAddComment = async () => {
    if(!isLoggedIn)
      setloginAlertVisible(true)
    else{
      if (newComment.trim() === '') {
        Alert.alert("Erreur", "Le commentaire ne peut pas être vide.");
        return;
      }
      const comment: Comment = {
        id: '',
        content: newComment,
        first: !replyingTo,
        rating: newCommentRating // Include the rating
      };
      try {
        const endpoint = replyingTo
          ? `${state.API_BASE_URL}/Comments/${jwtDecode(token).userid}/${Id}/${replyingTo}`
          : `${state.API_BASE_URL}/Comments/${jwtDecode(token).userid}/${Id}/0`;
  
        const response = await axios.post(endpoint, comment,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
  
        // Mise à jour locale immédiate
        const newCommentItem: CommentItem = {
          ...response.data,
          replies: [],
          parentId: replyingTo || undefined
        };
  
        handleNewComment(newCommentItem);
  
        setNewComment('');
        if (replyingTo) {
          setReplyingTo(null);
          setExpandedComments(prev => new Set(prev).add(replyingTo));
        }
      } catch (error) {
        console.error('Erreur lors de l\'envoi du commentaire:', error);
        Alert.alert('Erreur', 'Échec de l\'envoi du commentaire. Veuillez réessayer.');
      }
    }
  };
  const toggleReplies = (commentId: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };


  const renderCommentItem = ({ item, depth = 0 }: { item: CommentItem, depth?: number }) => (
    <View style={[styles.commentContainer, { marginLeft: depth * 20 }]}>
      <View style={styles.commentHeader}>
        <Image source={require('@/assets/002.png')} style={styles.avatar} />
        <View style={styles.authorInfo}>
          <Text style={styles.commentAuthor}>{item.author}</Text>
          <Text style={styles.commentDate}>{new Date(item.createdDate).toLocaleDateString()}</Text>
        </View>
        {item.rating !== undefined && (
          <StarRating rating={item.rating} maxRating={5} starSize={16} starColor="orange" />
        )}
      </View>
      <Text style={styles.commentContent}>{item.content}</Text>
      <View style={styles.actionContainer}>
        <TouchableOpacity onPress={() => {
          setReplyingTo(item.id);
          Alert.alert("Reply", `Replying to ${item.author}'s comment`);
        }}>
          <Text style={styles.actionButton}>Reply</Text>
        </TouchableOpacity>
        {item.replies && item.replies.length > 0 && (
          <TouchableOpacity onPress={() => toggleReplies(item.id)}>
            <Text style={styles.actionButton}>
              {expandedComments.has(item.id) ? 'Hide Replies' : `Show Replies (${item.replies.length})`}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {expandedComments.has(item.id) && item.replies && (
        <FlatList
          data={item.replies}
          renderItem={({ item: reply }) => renderCommentItem({ item: reply, depth: depth + 1 })}
          keyExtractor={(reply) => reply.id}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <LoginRequiredAlert
        visible={loginAlertVisible}
        onLogin={() => router.push(`/LoginPage?returnTo=ProductDetails&productId=${Id}`)}
        onCancel={() => setloginAlertVisible(false)}
      />
      <Text style={styles.sectionTitle}>Customer Reviews</Text>
      <FlatList
        data={comments}
        renderItem={renderCommentItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyListText}>Be the first to review this product!</Text>}
      />
      <View style={[tw`flex-col`,styles.inputContainer]}>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>Your Rating:</Text>
          <GivStarRating
            rating={newCommentRating}
            onRatingChange={setNewCommentRating}
            size={24}
          />
        </View>
        <View style={[tw`flex-row`]}>
          <TextInput
              style={styles.input}
              value={newComment}
              onChangeText={setNewComment}
              placeholder={replyingTo ? "Write a reply..." : "Write a review..."}
              multiline
            />
            <TouchableOpacity style={styles.button} onPress={handleAddComment}>
              <Ionicons name='send-sharp' size={24} color={'white'} />
            </TouchableOpacity>
          </View>
      </View>
      {replyingTo && (
        <TouchableOpacity style={styles.cancelButton} onPress={() => setReplyingTo(null)}>
          <Text style={styles.cancelButtonText}>Cancel Reply</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f8f8f8',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  commentContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  authorInfo: {
    flex: 1,
  },
  commentAuthor: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  commentDate: {
    fontSize: 12,
    color: '#888',
  },
  commentContent: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginBottom: 8,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    color: '#0066cc',
    fontSize: 14,
    fontWeight: '600',
  },
  inputContainer: {
    marginTop: 16,
    alignItems: 'flex-start',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    minHeight: 60,
    maxHeight: 120,
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 12,
    borderRadius: 8,
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ff3b30',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyListText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 24,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 8,
  },
  ratingText: {
    marginRight: 8,
    fontSize: 14,
    color: '#333',
  },
});

export default CommentSystem;