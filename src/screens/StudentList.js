import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  Platform,
  Animated,
  Alert,
  TextInput,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const StudentList = ({ navigation }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const scrollY = new Animated.Value(0);

  const fetchStudents = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const response = await axios.get(
        "https://mathmentor-qnyk.onrender.com/api/students/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response.data);
      setStudents(response.data);
      setFilteredStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      Alert.alert("Hata", "Öğrenci listesi yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDeleteStudent = async (id, studentName) => {
    Alert.alert(
      "Öğrenci Silme",
      `${studentName} isimli öğrenciyi silmek istediğinize emin misiniz?`,
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("accessToken");
              await axios.delete(
                `https://mathmentor-qnyk.onrender.com/api/students/${id}/`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              await fetchStudents();
              Alert.alert("Başarılı", "Öğrenci başarıyla silindi.");
            } catch (error) {
              console.error("Error deleting student:", error);
              Alert.alert("Hata", "Öğrenci silinirken bir hata oluştu.");
            }
          },
        },
      ]
    );
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(text.toLowerCase()) ||
        student.surname.toLowerCase().includes(text.toLowerCase()) ||
        student.parent_name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchStudents();
  }, []);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [Platform.OS === "ios" ? 140 : 120, 80],
    extrapolate: "clamp",
  });

  const renderStudentItem = ({ item }) => {
    return (
      <View style={styles.studentCard}>
        <TouchableOpacity
          style={styles.studentContent}
          onPress={() =>
            navigation.navigate("StudentDetail", { studentId: item.id })
          }
        >
          <View
            style={[styles.avatarContainer, { backgroundColor: "#6c63ff" }]}
          >
            <Text style={styles.avatarText}>
              {item.name[0]}
              {item.surname[0]}
            </Text>
          </View>
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>
              {item.name} {item.surname}
            </Text>
            <Text style={styles.parentInfo}>
              <Text style={styles.parentLabel}>Veli: </Text>
              {item.parent_name}
            </Text>
            <View
              style={[
                styles.debtBadge,
                {
                  backgroundColor: item.debt_status > 0 ? "#fff0f0" : "#f0fff4",
                },
              ]}
            >
              <Text
                style={[
                  styles.debtText,
                  { color: item.debt_status > 0 ? "#e74c3c" : "#2ecc71" },
                ]}
              >
                {item.debt_status > 0
                  ? `${item.debt_status} TL borç`
                  : "Borç yok"}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() =>
              handleDeleteStudent(item.id, `${item.name} ${item.surname}`)
            }
          >
            <Ionicons name="trash-outline" size={22} color="#ff6b6b" />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6c63ff" />
        <Text style={styles.loadingText}>Öğrenciler Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6c63ff" />
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Öğrenci Listesi</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("AddStudent")}
          >
            <Ionicons name="add" size={22} color="#fff" />
            <Text style={styles.addButtonText}>Yeni Öğrenci</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Öğrenci veya veli ara..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#666"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => handleSearch("")}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredStudents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderStudentItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#6c63ff"
            colors={["#6c63ff"]}
          />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      />
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    shadowColor: "#6c63ff",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  addButtonText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
  },
  listContainer: {
    padding: 16,
  },
  studentCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#6c63ff",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  studentContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2d3436",
    marginBottom: 4,
  },
  parentInfo: {
    fontSize: 14,
    color: "#636e72",
    marginBottom: 6,
  },
  parentLabel: {
    fontWeight: "500",
    color: "#2d3436",
  },
  debtBadge: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  debtText: {
    fontSize: 14,
    fontWeight: "500",
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 16,
    marginTop: 10,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    color: "#2d3436",
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 4,
  },
  clearButton: {
    padding: 4,
  },
});

export default StudentList;
