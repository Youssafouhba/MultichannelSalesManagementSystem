import React, { useState, useEffect, useRef } from 'react';
import { View, Image, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAppContext } from './AppContext';
import axios from 'axios';
import { Comment, CommentItem } from '@/constants/Classes';
import tw from 'tailwind-react-native-classnames';
import { Ionicons } from '@expo/vector-icons';
import GivStarRating from './GivStarRating';
import { jwtDecode } from 'jwt-decode';
import { router } from 'expo-router';
import LoginRequiredAlert from "@/components/LoginRequiredAlert"
import StarRating from './StarRating';
import { useAppData } from './AppDataProvider';
import { Color } from '@/GlobalStyles';
import config from './config';

const CommentSystem: React.FC<{ Id: string }> = ({ Id }) => {
  const { state, dispatch } = useAppContext();
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loginAlertVisible, setLoginAlertVisible] = useState<boolean>(false);
  const [newComment, setNewComment] = useState('');
  const [newCommentRating, setNewCommentRating] = useState(0);
  const { data,fetchdt } = useAppData();
  const ws = useRef<WebSocket | null>(null);
  const isLoggedIn = state.JWT_TOKEN !== '';
  const token = state.JWT_TOKEN;

  useEffect(() => {
    fetchComments(Id);
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [Id]);

  const fetchComments = async (productId: string) => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/Comments/${productId}`);
      const fetchedComments: CommentItem[] = response.data;
      const filteredComments = fetchedComments.filter(comment => comment.first === true);
      const sortedComments = filteredComments.sort((a, b) => 
        new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      );
      setComments(sortedComments.slice(0, 4)); // Only keep the 4 most recent comments
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires:', error);
      Alert.alert('Erreur', 'Impossible de charger les commentaires. Veuillez réessayer.');
    }
  };

  const handleAddComment = async () => {
    if (!isLoggedIn) {
      setLoginAlertVisible(true);
    } else {
      if (newComment.trim() === '') {
        Alert.alert("Erreur", "Le commentaire ne peut pas être vide.");
        return;
      }
      const comment: Comment = {
        id: '',
        content: newComment,
        first: true,
        rating: newCommentRating
      };
      try {
        const endpoint = `${config.API_BASE_URL}/Comments/${jwtDecode(token).userid}/${Id}/0`;
        const response = await axios.post(endpoint, comment, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const newCommentItem: CommentItem = {
          ...response.data,
          replies: [],
        };

        setComments(prevComments => {
          const updatedComments = [newCommentItem, ...prevComments];
          return updatedComments.slice(0, 4); // Keep only the 4 most recent comments
        });

        setNewComment('');
        setNewCommentRating(0);
        fetchdt()
      } catch (error) {
        console.error('Erreur lors de l\'envoi du commentaire:', error);
        Alert.alert('Erreur', 'Échec de l\'envoi du commentaire. Veuillez réessayer.');
      }
    }
  };

  const renderCommentItem = ({ item }: { item: CommentItem }) => (
    <View style={styles.commentContainer}>
      <View style={styles.commentHeader}>
        
        <View style={styles.authorInfo}>
          <Text style={styles.commentAuthor}>{item.author}</Text>
        </View>
      </View>
      <View style={[tw`mt-2`]}>
        {item.content!==''?(
          <Text style={styles.commentContent}>{item.content}</Text>
        ):(``)}
        <View style={[tw`flex-row justify-between`]}>
          {item.rating !== undefined && (
            <StarRating rating={item.rating} maxRating={5} starSize={14} starColor="orange" />
          )}
          <Text style={styles.commentDate}>{new Date(item.createdDate).toLocaleDateString()}</Text>
        </View>
      </View>
    
    </View>
  );

  return (
    <View style={styles.container}>
      <LoginRequiredAlert
        visible={loginAlertVisible}
        onLogin={() => router.push(`/LoginPage?returnTo=ProductDetails&productId=${Id}`)}
        onCancel={() => setLoginAlertVisible(false)}
      />
      <Text style={styles.sectionTitle}>Customer Reviews</Text>
      <FlatList
        data={comments}
        renderItem={renderCommentItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyListText}>Be the first to review this product!</Text>}
      />
      <View style={[tw`flex-col`, styles.inputContainer]}>
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
            placeholder="Write a review..."
            multiline
          />
          <TouchableOpacity style={styles.button} onPress={handleAddComment}>
            <Ionicons name='send-sharp' size={24} color={'white'} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: Color.mainbackgroundcolor,
    marginVertical: 16,

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
    borderRadius: 2,
    borderWidth: 0.2,
    borderColor: '#0066cc',
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
    fontSize: 14,
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