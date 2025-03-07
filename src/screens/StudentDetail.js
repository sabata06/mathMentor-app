import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StudentDetail = ({ route, navigation }) => {
  const { studentId } = route.params;
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const floatingButtonsContainer = {
    position: "absolute",
    right: 20,
    bottom: 20,
    flexDirection: "row",
    gap: 15,
  };

  useEffect(() => {
    const fetchStudentDetail = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        const response = await axios.get(
          `https://mathmentor-qnyk.onrender.com/api/students/${studentId}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // console.log(response.data);
        setStudent(response.data);
      } catch (error) {
        console.error("Error fetching student details:", error);
        alert("Öğrenci detayları yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetail();
  }, [studentId]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6c63ff" />
        <Text style={styles.loadingText}>Bilgiler Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6c63ff" />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Öğrenci Bilgileri</Text>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("EditStudent", { student })}
        >
          <Ionicons name="create-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.contentContainer}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {student.name[0]}
              {student.surname[0]}
            </Text>
          </View>
          <Text style={styles.studentName}>
            {student.name} {student.surname}
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Veli Bilgileri</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={20} color="#6c63ff" />
              <Text style={styles.infoLabel}>Veli Adı:</Text>
              <Text style={styles.infoValue}>{student.parent_name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={20} color="#6c63ff" />
              <Text style={styles.infoLabel}>İletişim:</Text>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "İletişim Seçenekleri",
                    "Nasıl iletişim kurmak istersiniz?",
                    [
                      {
                        text: "Ara",
                        onPress: () => {
                          Linking.openURL(`tel:${student.parent_contact}`);
                        },
                      },
                      {
                        text: "WhatsApp",
                        onPress: () => {
                          // WhatsApp numarayı uluslararası formatta bekler, bu yüzden +90 ekliyoruz
                          let phoneNumber = student.parent_contact;
                          if (phoneNumber.startsWith("0")) {
                            phoneNumber = phoneNumber.substring(1);
                          }
                          Linking.openURL(
                            `whatsapp://send?phone=90${phoneNumber}`
                          );
                        },
                      },
                      {
                        text: "İptal",
                        style: "cancel",
                      },
                    ]
                  );
                }}
              >
                <Text style={[styles.infoValue, styles.phoneLink]}>
                  {student.parent_contact}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Eğitim Durumu</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="clipboard-outline" size={20} color="#6c63ff" />
              <Text style={styles.infoLabel}>Ödev Durumu:</Text>
              <Text
                style={[
                  styles.infoValue,
                  {
                    color:
                      student.assignment_completion_percentage > 70
                        ? "#2ecc71"
                        : "#e74c3c",
                  },
                ]}
              >
                %{student.assignment_completion_percentage}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="book-outline" size={20} color="#6c63ff" />
              <Text style={styles.infoLabel}>Son Konu:</Text>
              <Text style={styles.infoValue}>{student.last_topic}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="documents-outline" size={20} color="#6c63ff" />
              <Text style={styles.infoLabel}>Kitap İlerlemesi:</Text>
              <Text style={styles.infoValue}>
                {student.book_progress}. sayfa
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color="#6c63ff" />
              <Text style={styles.infoLabel}>Son Ders:</Text>
              <Text style={styles.infoValue}>{student.last_lesson_date}</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Ödeme Durumu</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons
                name="cash-outline"
                size={20}
                color={student.debt_status > 0 ? "#e74c3c" : "#2ecc71"}
              />
              <Text style={styles.infoLabel}>Borç Durumu:</Text>
              <Text
                style={[
                  styles.infoValue,
                  { color: student.debt_status > 0 ? "#e74c3c" : "#2ecc71" },
                ]}
              >
                {student.debt_status > 0
                  ? `${student.debt_status} TL`
                  : "Borç Yok"}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={floatingButtonsContainer}>
        <TouchableOpacity
          style={[styles.floatingButton, { backgroundColor: "#4CAF50" }]}
          onPress={() =>
            navigation.navigate("HomeworkList", {
              studentId: student.id,
              studentName: `${student.name} ${student.surname}`,
            })
          }
        >
          <View style={styles.buttonContent}>
            <Ionicons name="book" size={22} color="#fff" />
            <Text style={styles.buttonText}>Ödevler</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.floatingButton, { backgroundColor: "#6c63ff" }]}
          onPress={() => navigation.navigate("EditStudent", { student })}
        >
          <View style={styles.buttonContent}>
            <Ionicons name="create" size={22} color="#fff" />
            <Text style={styles.buttonText}>Düzenle</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f6fa",
  },
  loadingText: {
    marginTop: 12,
    color: "#6c63ff",
    fontSize: 16,
    fontWeight: "500",
  },
  header: {
    backgroundColor: "#6c63ff",
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  editButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: "#6c63ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#6c63ff",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  studentName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2d3436",
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2d3436",
    marginBottom: 12,
    marginLeft: 4,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 15,
    color: "#636e72",
    marginLeft: 10,
    width: 120,
  },
  infoValue: {
    flex: 1,
    fontSize: 15,
    color: "#2d3436",
    fontWeight: "500",
  },
  floatingButton: {
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  phoneLink: {
    color: "#6c63ff",
    textDecorationLine: "underline",
  },
});

export default StudentDetail;
