import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // Make sure to install @expo/vector-icons
import {Comment, Product} from '@/constants/Classes'
import { useAppContext } from './AppContext';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
const RatingFeedbackModal = ({ visible, onClose, onSubmit,products }) => {

  const { state, dispatch } = useAppContext();
  var token = state.JWT_TOKEN;

  const [rating, setRating] = useState(0);
  const [content, setContent] = useState<string>('');

  const handleSubmit = async () => {
    onSubmit(rating, content);
    const Products = state.products.filter((product: Product) => products[product.id]?.quantity > 0);
 
    try {
      const comment: Comment = {
        id: '',
        content: content,
        first: true,
        rating: rating // Include the rating
      };
      Products.map(async (product: Product)=>{
        const response = await axios.post(`${state.API_BASE_URL}/Comments/${jwtDecode(token).userid}/${product.id}/0`, comment,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      })

    }catch (error) {
      console.error('Erreur lors de l\'envoi du commentaire:', error);
      Alert.alert('Erreur', 'Échec de l\'envoi du commentaire. Veuillez réessayer.');
    }
  
    setRating(0);
    setContent('');
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Rate Your Experience</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
              >
                <AntDesign
                  name={star <= rating ? 'star' : 'staro'}
                  size={30}
                  color="orange"
                />
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={styles.input}
            placeholder="Leave a comment (optional)"
            value={content}
            onChangeText={setContent}
            multiline
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.submitButton]} 
              onPress={handleSubmit}
              disabled={rating === 0}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  input: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    width: '100%',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    minWidth: 100,
  },
  submitButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default RatingFeedbackModal;