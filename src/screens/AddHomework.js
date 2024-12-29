import React, { useState } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddHomework = ({ route, navigation }) => {
  const { studentId, onHomeworkAdded } = route.params;
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState({
    book: "",
    topic: "",
    page: "",
  });

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData((prev) => ({ ...prev, due_date: selectedDate }));
    }
  };

const handleSubmit = async () => {
    if (!formData.book.trim() || !formData.topic.trim() || !formData.page.trim()) {
        Alert.alert("Uyarı", "Lütfen tüm alanları doldurunuz.");
        return;
    }

    setLoading(true);
    try {
        const token = await AsyncStorage.getItem("accessToken");
        const response = await axios.post(
            "https://mathmentor-qnyk.onrender.com/api/assignments/",
            {
                student: studentId,
                book: formData.book.trim(),
                topic: formData.topic.trim(),
                page: formData.page.trim(),
                is_completed: false,
            },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        if (response.status === 201) {
            Alert.alert("Başarılı", "Ödev başarıyla eklendi.");
            onHomeworkAdded();
            navigation.goBack();
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Ödev eklenirken bir hata oluştu.";
        Alert.alert("Hata", errorMessage);
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
        <Text style={styles.headerTitle}>Yeni Ödev</Text>
      </View>

      <ScrollView style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="book-outline"
              size={20}
              color="#6c63ff"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Ödev Kitabı"
              value={formData.book}
              onChangeText={(value) =>
                setFormData((prev) => ({ ...prev, book: value }))
              }
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons
              name="document-text-outline"
              size={20}
              color="#6c63ff"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Konu"
              value={formData.topic}
              onChangeText={(value) =>
                setFormData((prev) => ({ ...prev, topic: value }))
              }
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons
              name="document-outline"
              size={20}
              color="#6c63ff"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Sayfa (örn: 50-60)"
              value={formData.page}
              onChangeText={(value) =>
                setFormData((prev) => ({ ...prev, page: value }))
              }
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.submitButtonText}>Ödev Ekle</Text>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color="#fff"
                style={styles.submitIcon}
              />
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
    backgroundColor: "#f5f6fa",
  },
  header: {
    backgroundColor: "#6c63ff",
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputWrapper: {
    backgroundColor: "#fff",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
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
    color: "#2d3436",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: "#2d3436",
    paddingVertical: 15,
  },
  submitButton: {
    backgroundColor: "#6c63ff",
    borderRadius: 12,
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 40,
    shadowColor: "#6c63ff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 8,
  },
  submitIcon: {
    marginLeft: 4,
  },
});

export default AddHomework;
