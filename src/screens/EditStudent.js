import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
  NativeModules,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
const EditStudent = ({ route, navigation }) => {
  const { student } = route.params;
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState({
    name: student.name,
    surname: student.surname,
    parentName: student.parent_name,
    parentContact: student.parent_contact,
    debtStatus: student.debt_status.toString(),
    lastTopic: student.last_topic,
    bookProgress: student.book_progress.toString(),
    lastLessonDate: new Date(student.last_lesson_date),
  });
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData((prev) => ({ ...prev, lastLessonDate: selectedDate }));
    }
  };

  const validateForm = () => {
    const requiredFields = ["name", "surname", "parentName", "parentContact"];
    const missingFields = requiredFields.filter(
      (field) => !formData[field].trim()
    );

    if (missingFields.length > 0) {
      Alert.alert("Uyarı", "Lütfen zorunlu alanları doldurunuz.");
      return false;
    }

    if (formData.debtStatus && isNaN(Number(formData.debtStatus))) {
      Alert.alert("Uyarı", "Borç miktarı sayısal bir değer olmalıdır.");
      return false;
    }

    return true;
  };

  const handleUpdateStudent = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("accessToken");
      await axios.put(
        `https://mathmentor-qnyk.onrender.com/api/students/${student.id}/`,
        {
          name: formData.name.trim(),
          surname: formData.surname.trim(),
          parent_name: formData.parentName.trim(),
          parent_contact: formData.parentContact.trim(),
          debt_status: formData.debtStatus ? Number(formData.debtStatus) : 0,
          last_topic: formData.lastTopic.trim(),
          book_progress: formData.bookProgress,
          last_lesson_date: formData.lastLessonDate.toISOString().split("T")[0],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert("Başarılı", "Öğrenci bilgileri güncellendi.", [
        { text: "Tamam", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("Hata", "Güncelleme sırasında bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#6c63ff" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Öğrenci Düzenle</Text>
      </View>

      <ScrollView
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Öğrenci Bilgileri</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="person-outline"
              size={20}
              color="#6c63ff"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Öğrencinin Adı"
              value={formData.name}
              onChangeText={(value) => updateField("name", value)}
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="person-outline"
              size={20}
              color="#6c63ff"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Öğrencinin Soyadı"
              value={formData.surname}
              onChangeText={(value) => updateField("surname", value)}
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Veli İletişim Bilgileri</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="people-outline"
              size={20}
              color="#6c63ff"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Velinin Adı"
              value={formData.parentName}
              onChangeText={(value) => updateField("parentName", value)}
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="call-outline"
              size={20}
              color="#6c63ff"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Velinin Telefonu"
              value={formData.parentContact}
              onChangeText={(value) => updateField("parentContact", value)}
              keyboardType="phone-pad"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Eğitim Takibi</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="book-outline"
              size={20}
              color="#6c63ff"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Son İşlenen Konu"
              value={formData.lastTopic}
              onChangeText={(value) => updateField("lastTopic", value)}
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="documents-outline"
              size={20}
              color="#6c63ff"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Kitap İlerlemesi"
              value={formData.bookProgress}
              onChangeText={(value) => updateField("bookProgress", value)}
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="calendar-outline"
              size={20}
              color="#6c63ff"
              style={styles.inputIcon}
            />
            <TouchableOpacity
              style={[styles.input, styles.dateInput]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {formData.lastLessonDate.toLocaleDateString("tr-TR")}
              </Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={formData.lastLessonDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              locale="tr-TR"
            />
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Ödeme Bilgileri</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="cash-outline"
              size={20}
              color="#6c63ff"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Borç Miktarı (TL)"
              value={formData.debtStatus}
              onChangeText={(value) => updateField("debtStatus", value)}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleUpdateStudent}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.submitButtonText}>Değişiklikleri Kaydet</Text>
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
    </KeyboardAvoidingView>
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#6c63ff",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
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
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2d3436",
    marginBottom: 12,
    marginLeft: 4,
  },
  inputWrapper: {
    backgroundColor: "#fff",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
    shadowOffset: {
      width: 0,
      height: 4,
    },
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
  dateInput: {
    justifyContent: "center",
  },
  dateText: {
    fontSize: 16,
    color: "#2d3436",
  },
});

export default EditStudent;
