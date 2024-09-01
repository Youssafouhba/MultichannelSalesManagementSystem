import React, { useState, useEffect, useRef } from 'react';
import { View, Image, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAppContext } from './AppContext';
import axios from 'axios';
import { Comment, CommentItem, Product, ProductInfos } from '@/constants/Classes';
import tw from 'tailwind-react-native-classnames';
import { Ionicons } from '@expo/vector-icons';
import GivStarRating from './GivStarRating';
import { jwtDecode } from 'jwt-decode';
import { router, useNavigation } from 'expo-router';
import LoginRequiredAlert from "@/components/LoginRequiredAlert"
import StarRating from './StarRating';
import { useAppData } from './AppDataProvider';
import { Color } from '@/GlobalStyles';
import config from './config';
import { useUser } from '@/contex/UserContext';

const CommentSystem: React.FC<{commentsItens : CommentItem[] ,product: ProductInfos}> = ({ commentsItens,product }) => {
  const { setPreviouspage } = useAppContext();
  const { state } = useUser();
  const [comments, setComments] = useState<CommentItem[]>(commentsItens);
  const [loginAlertVisible, setLoginAlertVisible] = useState<boolean>(false);
  const [newComment, setNewComment] = useState('');
  const [newCommentRating, setNewCommentRating] = useState(0);
  const isLoggedIn = state.isLoggedIn;
  const token = state.JWT_TOKEN;
  const navigation = useNavigation<any>()



  const handleConfirm = () => {
    setLoginAlertVisible(false);
    const payload = {
        ...product,
      };
      
      setPreviouspage("ProductDetails")
      navigation.navigate(`LoginPage`,{payload})
};

const handleAddComment = async () => {
  if (!isLoggedIn) {
    setLoginAlertVisible(true);
  } else {
    if (newComment.trim() === '') {
      Alert.alert("Error", "The comment must not be empty.");
      return;
    }
    
    // Optimistically add the new comment to the comments list
    const temporaryCommentId = `temp-${Date.now()}`; // Temporary ID for the new comment
    const optimisticComment: CommentItem = {
      id: temporaryCommentId,
      author: state.userInfos.user?.fullName || 'You', // Replace with actual user data
      content: newComment,
      rating: newCommentRating,
      createdDate: new Date().toISOString(),
      replies: []
    };

    setComments(prevComments => [optimisticComment, ...prevComments]);

    // Clear the input fields
    setNewComment('');
    setNewCommentRating(0);

    try {
      const comment: Comment = {
        id: '',
        content: newComment,
        first: true,
        rating: newCommentRating
      };

      const endpoint = `${config.API_BASE_URL}/Comments/${jwtDecode(token).userid}/${product.product.id}/0`;
      const response = await axios.post(endpoint, comment, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

    } catch (error) {
      console.error('Error while sending the comment:', error);
      Alert.alert('Error', 'Failed to send the comment. Please try again.');
      setComments(prevComments => prevComments.filter(comment => comment.id !== temporaryCommentId));
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
        onLogin={() => { handleConfirm(); } }
        onCancel={() => setLoginAlertVisible(false)} message={undefined}      />
      <Text style={styles.sectionTitle}>Customer Reviews</Text>
      <FlatList
        data={comments.slice(0,4)}
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