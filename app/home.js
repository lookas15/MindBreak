import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

import Navbar from "./navbar";

export default function Home() {
  const [email, setEmail] = useState("");
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState(new Date().getTime());
  const [upcomingUpdates, setUpcomingUpdates] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const getEmail = async () => {
      const storedEmail = await AsyncStorage.getItem("email");
      if (storedEmail) {
        setEmail(storedEmail);
      }
    };

    getEmail();

    const loadTotalTimeSpent = async () => {
      const storedTime = await AsyncStorage.getItem("totalTimeSpent");
      if (storedTime) {
        setTotalTimeSpent(parseInt(storedTime, 10));
      }
    };

    loadTotalTimeSpent();

    loadUpcomingUpdates(); // Load upcoming updates on component mount
  }, []);

  useEffect(() => {
    const saveTotalTimeSpent = async () => {
      await AsyncStorage.setItem("totalTimeSpent", totalTimeSpent.toString());
    };

    saveTotalTimeSpent();
  }, [totalTimeSpent]);

  useEffect(() => {
    const timer = setInterval(() => {
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - startTime;
      setTotalTimeSpent((prevTime) => prevTime + elapsedTime);
      setStartTime(currentTime);
    }, 60000); // Update every minute (60000 milliseconds)

    return () => clearInterval(timer);
  }, [startTime]);

  async function loadUpcomingUpdates() {
    try {
      // Example: Fetching upcoming updates from AsyncStorage
      const storedUpdates = await AsyncStorage.getItem("upcomingUpdates");
      if (storedUpdates) {
        setUpcomingUpdates(JSON.parse(storedUpdates));
      }
    } catch (error) {
      console.error("Error loading upcoming updates:", error);
    }
  }

  function handleAvatarPress() {
    if (email === "") {
      router.push("/login");
    } else {
      router.push("/profile");
    }
  }

  function handleGetStartedPress() {
    router.push("/courses");
  }

  const formattedTime = Math.floor(totalTimeSpent / 60000); // Convert to minutes
  const progressWidth = (formattedTime / 60) * 100; // Calculate percentage

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>
                Hello, {email ? email : "Name"}
              </Text>
              <Text style={styles.subtitle}>Let's start learning</Text>
            </View>
            <TouchableOpacity onPress={handleAvatarPress}>
              <Image
                source={require("../assets/images/profile.png")}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.timeSpentCard}>
            <Text style={styles.timeSpentText}>Time Spent</Text>
            <Text style={styles.timeSpentValue}>
              {formattedTime} min / 60 min
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: `${progressWidth}%` }]} />
            </View>
            <TouchableOpacity>
              <Text style={styles.myCoursesText}>My courses</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.getStartedCard}>
            <TouchableOpacity onPress={handleGetStartedPress}>
              <Image
                source={require("../assets/images/learning.png")}
                style={styles.getStartedImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.learningPlanCard}>
            <Text style={styles.cardTitle}>Learning Plan</Text>
            <Text style={styles.cardContent}>There is nothing here</Text>
          </View>
          <View style={styles.upcomingQuizCard}>
            <Text style={styles.cardTitle}>Upcoming Updates</Text>
            {upcomingUpdates.map((update, index) => (
              <Text key={index} style={styles.cardContent}>
                {update.title}: {update.date}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>

      <Navbar active="home" />
    </SafeAreaView>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
  },
  container: {
    flex: 1,
    backgroundColor: "#000000",
    paddingHorizontal: 16,
    paddingBottom: 60,
    marginTop: 32,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 16,
  },
  greeting: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#bbb",
    fontSize: 16,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  timeSpentCard: {
    backgroundColor: "#14213D",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  timeSpentText: {
    color: "white",
    fontSize: 16,
    marginBottom: 8,
  },
  timeSpentValue: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#FCA311",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progress: {
    height: "100%",
    backgroundColor: "#f15a29",
  },
  myCoursesText: {
    color: "#FCA311",
    textAlign: "right",
  },
  getStartedCard: {
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 20,
  },
  getStartedImage: {
    width: width * 0.9,
    height: width * 0.5,
    borderRadius: 20,
  },
  learningPlanCard: {
    backgroundColor: "#14213D",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    color: "white",
    fontSize: 16,
    marginBottom: 8,
  },
  cardContent: {
    color: "#bbb",
    fontSize: 14,
  },
  upcomingQuizCard: {
    backgroundColor: "#14213D",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  navbar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});
