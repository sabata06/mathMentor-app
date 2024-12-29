import React, { useState } from 'react';
import {
 View,
 Text,
 TextInput,
 TouchableOpacity,
 StyleSheet,
 Alert,
 ScrollView,
 Platform,
 ActivityIndicator,
 StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditHomework = ({ route, navigation }) => {
 const { homework } = route.params;
 const [loading, setLoading] = useState(false);
 const [formData, setFormData] = useState({
   book: homework.book,
   topic: homework.topic,
   page: homework.page,
   is_completed: homework.is_completed
 });

 const handleUpdate = async () => {
   if (!formData.book.trim() || !formData.topic.trim() || !formData.page.trim()) {
     Alert.alert('Uyarı', 'Lütfen tüm alanları doldurunuz.');
     return;
   }

   setLoading(true);
   try {
     const token = await AsyncStorage.getItem('accessToken');
     await axios.put(
       `https://mathmentor-qnyk.onrender.com/api/assignments/${homework.id}/`,
       {
         student: homework.student,
         book: formData.book.trim(),
         topic: formData.topic.trim(),
         page: formData.page.trim(),
         is_completed: formData.is_completed,
       },
       { headers: { Authorization: `Bearer ${token}` } }
     );
     navigation.goBack();
   } catch (error) {
     Alert.alert('Hata', 'Ödev güncellenirken bir hata oluştu.');
   } finally {
     setLoading(false);
   }
 };

 return (
   <View style={styles.container}>
     <StatusBar barStyle="light-content" backgroundColor="#6c63ff" />
     <View style={styles.header}>
       <TouchableOpacity
         style={styles.backButton}
         onPress={() => navigation.goBack()}
       >
         <Ionicons name="arrow-back" size={24} color="#fff" />
       </TouchableOpacity>
       <Text style={styles.headerTitle}>Ödev Düzenle</Text>
     </View>

     <ScrollView style={styles.formContainer}>
       <View style={styles.inputGroup}>
         <View style={styles.inputWrapper}>
           <Ionicons name="book-outline" size={20} color="#6c63ff" style={styles.inputIcon} />
           <TextInput
             style={styles.input}
             placeholder="Ödev Kitabı"
             value={formData.book}
             onChangeText={(value) => setFormData(prev => ({ ...prev, book: value }))}
             placeholderTextColor="#999"
           />
         </View>

         <View style={styles.inputWrapper}>
           <Ionicons name="document-text-outline" size={20} color="#6c63ff" style={styles.inputIcon} />
           <TextInput
             style={styles.input}
             placeholder="Konu"
             value={formData.topic}
             onChangeText={(value) => setFormData(prev => ({ ...prev, topic: value }))}
             placeholderTextColor="#999"
           />
         </View>

         <View style={styles.inputWrapper}>
           <Ionicons name="document-outline" size={20} color="#6c63ff" style={styles.inputIcon} />
           <TextInput
             style={styles.input}
             placeholder="Sayfa (örn: 50-60)"
             value={formData.page}
             onChangeText={(value) => setFormData(prev => ({ ...prev, page: value }))}
             placeholderTextColor="#999"
           />
         </View>

         <TouchableOpacity
           style={styles.statusToggle}
           onPress={() => setFormData(prev => ({ ...prev, is_completed: !prev.is_completed }))}
         >
           <Ionicons 
             name={formData.is_completed ? "checkbox" : "square-outline"}
             size={24}
             color={formData.is_completed ? "#4CAF50" : "#666"}
           />
           <Text style={styles.statusText}>
             {formData.is_completed ? "Tamamlandı" : "Tamamlanmadı"}
           </Text>
         </TouchableOpacity>
       </View>

       <TouchableOpacity
         style={styles.submitButton}
         onPress={handleUpdate}
         disabled={loading}
       >
         {loading ? (
           <ActivityIndicator color="#fff" />
         ) : (
           <>
             <Text style={styles.submitButtonText}>Güncelle</Text>
             <Ionicons name="checkmark-circle" size={20} color="#fff" style={styles.submitIcon} />
           </>
         )}
       </TouchableOpacity>
     </ScrollView>
   </View>
 );
};

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#f5f6fa',
 },
 header: {
   backgroundColor: '#6c63ff',
   padding: 20,
   paddingTop: Platform.OS === 'ios' ? 50 : 20,
   flexDirection: 'row',
   alignItems: 'center',
 },
 backButton: {
   padding: 8,
   marginRight: 16,
 },
 headerTitle: {
   fontSize: 24,
   fontWeight: 'bold',
   color: '#fff',
 },
 formContainer: {
   flex: 1,
   padding: 20,
 },
 inputGroup: {
   marginBottom: 24,
 },
 inputWrapper: {
   backgroundColor: '#fff',
   borderRadius: 12,
   flexDirection: 'row',
   alignItems: 'center',
   marginBottom: 12,
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.1,
   shadowRadius: 3.84,
   elevation: 3,
 },
 inputIcon: {
   padding: 12,
 },
 input: {
   flex: 1,
   height: 50,
   fontSize: 16,
   color: '#2d3436',
 },
 statusToggle: {
   flexDirection: 'row',
   alignItems: 'center',
   padding: 12,
   backgroundColor: '#fff',
   borderRadius: 12,
   marginTop: 12,
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.1,
   shadowRadius: 3.84,
   elevation: 3,
 },
 statusText: {
   marginLeft: 12,
   fontSize: 16,
   color: '#2d3436',
 },
 submitButton: {
   backgroundColor: '#6c63ff',
   borderRadius: 12,
   height: 55,
   flexDirection: 'row',
   alignItems: 'center',
   justifyContent: 'center',
   marginTop: 20,
   marginBottom: 40,
   shadowColor: '#6c63ff',
   shadowOffset: { width: 0, height: 4 },
   shadowOpacity: 0.3,
   shadowRadius: 5,
   elevation: 8,
 },
 submitButtonText: {
   color: '#fff',
   fontSize: 18,
   fontWeight: '600',
   marginRight: 8,
 },
 submitIcon: {
   marginLeft: 4,
 },
});

export default EditHomework;