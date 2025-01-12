import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  StatusBar,
  Platform,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const HomeworkList = ({ route, navigation }) => {
  const { studentId, studentName } = route.params;
  const [homeworks, setHomeworks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHomeworks = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const response = await axios.get(
        `https://mathmentor-qnyk.onrender.com/api/assignments/?student_id=${studentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      //   console.log(response.data);
      setHomeworks(response.data);
    } catch (error) {
      Alert.alert("Hata", "Ödevler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeworks();
  }, [studentId]);

  const toggleHomeworkStatus = async (homeworkId, currentStatus) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const response = await axios.patch(
        `https://mathmentor-qnyk.onrender.com/api/assignments/${homeworkId}/`,
        { is_completed: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        Alert.alert("Başarılı", "Ödev durumu güncellendi.");
        fetchHomeworks();
      } else {
        Alert.alert(
          "Hata",
          "Beklenmeyen bir yanıt alındı. Lütfen tekrar deneyin."
        );
      }
    } catch (error) {
      const errorMessage =
        error.response?.status === 401
          ? "Oturum süreniz dolmuş olabilir. Lütfen tekrar giriş yapın."
          : "Ödev durumu güncellenirken bir hata oluştu.";

      Alert.alert("Hata", errorMessage);
    }
  };

  const deleteHomework = async (homeworkId) => {
    Alert.alert("Onay", "Bu ödevi silmek istediğinize emin misiniz?", [
      { text: "İptal", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("accessToken");
            await axios.delete(
              `https://mathmentor-qnyk.onrender.com/api/assignments/${homeworkId}/`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchHomeworks();
          } catch (error) {
            Alert.alert("Hata", "Ödev silinirken bir hata oluştu.");
          }
        },
      },
    ]);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Image
        source={require("../../assets/no-homework.webp")}
        style={styles.emptyStateImage}
      />
      <Text style={styles.emptyStateTitle}>Henüz Ödev Yok</Text>
      <Text style={styles.emptyStateDescription}>
        Öğrenciye yeni ödev eklemek için sağ üst köşedeki + butonuna tıklayın
      </Text>
    </View>
  );

  const renderHomeworkItem = ({ item }) => (
    <View style={styles.homeworkCard}>
      <TouchableOpacity
        style={styles.statusButton}
        onPress={() => toggleHomeworkStatus(item.id, item.is_completed)}
      >
        <View
          style={[
            styles.checkboxContainer,
            item.is_completed && styles.checkboxCompleted,
          ]}
        >
          <Ionicons
            name={item.is_completed ? "checkmark" : ""}
            size={16}
            color="#fff"
          />
        </View>
      </TouchableOpacity>

      <View style={styles.homeworkInfo}>
        <Text style={styles.bookTitle}>{item.book}</Text>
        <View style={styles.detailsContainer}>
          <View style={styles.tagContainer}>
            <Text style={styles.tagText}>{item.topic}</Text>
          </View>
          <View style={styles.tagContainer}>
            <Text style={styles.tagText}>Sayfa: {item.page}</Text>
          </View>
        </View>
        <Text style={styles.dateAdded}>
          {new Date(item.date_added).toLocaleDateString("tr-TR")}
        </Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            navigation.navigate("EditHomework", { homework: item })
          }
        >
          <Ionicons name="create-outline" size={22} color="#6c63ff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => deleteHomework(item.id)}
        >
          <Ionicons name="trash-outline" size={22} color="#ff4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

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
        <Text style={styles.headerTitle}>{studentName} - Ödevler</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            navigation.navigate("AddHomework", {
              studentId,
              onHomeworkAdded: fetchHomeworks,
            })
          }
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#6c63ff" />
      ) : (
        <FlatList
          data={homeworks}
          renderItem={renderHomeworkItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
        />
      )}
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
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    marginLeft: 16,
  },
  listContainer: {
    padding: 16,
  },
  homeworkCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statusButton: {
    marginRight: 12,
  },
  homeworkInfo: {
    flex: 1,
  },
  homeworkTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2d3436",
  },
  homeworkDescription: {
    fontSize: 14,
    color: "#636e72",
    marginTop: 4,
  },
  homeworkDate: {
    fontSize: 12,
    color: "#6c63ff",
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dateAdded: {
    fontSize: 12,
    color: "#95a5a6",
    marginTop: 4,
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#6c63ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  checkboxCompleted: {
    backgroundColor: "#6c63ff",
  },

  bookTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2d3436",
    marginBottom: 8,
  },

  detailsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 4,
  },

  tagContainer: {
    backgroundColor: "#f0f1f7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  tagText: {
    fontSize: 12,
    color: "#666",
  },

  actionButton: {
    padding: 8,
  },

  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },

  emptyStateImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },

  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2d3436",
    marginBottom: 8,
  },

  emptyStateDescription: {
    fontSize: 14,
    color: "#636e72",
    textAlign: "center",
    lineHeight: 20,
  },
});

export default HomeworkList;
