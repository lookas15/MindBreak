import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BarChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome5";
import Navbar from "./navbar";
import { useRouter } from "expo-router";
import { useRoute } from "@react-navigation/native";

// Colors stylesheet
const colors = {
  primaryBackground: "#000000",
  secondaryBackground: "#14213D",
  activeButtonColor: "#FCA311",
  chartBackground: "#14213D",
  chartGradientFrom: "#0c172e",
  chartGradientTo: "#14213D",
  positiveColor: "#80ffaa",
  negativeColor: "#f15a29",
};

export default function Analytics() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [interval, setInterval] = useState("Weekly");
  const [quizScores, setQuizScores] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // State for RefreshControl
  const [totalTimeSpent, setTotalTimeSpent] = useState(0); // New state for tracking time
  const [startTime, setStartTime] = useState(new Date().getTime()); // New state for tracking time
  const router = useRouter();
  const route = useRoute();

  useEffect(() => {
    const getEmail = async () => {
      const storedEmail = await AsyncStorage.getItem("email");
      if (storedEmail) {
        setEmail(storedEmail);
      }
    };

    getEmail();
    loadScores();

    // Start tracking time
    const timer = setInterval(() => {
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - startTime;
      setTotalTimeSpent((prevTime) => prevTime + elapsedTime);
      setStartTime(currentTime);
    }, 60000); // Update every minute (60000 milliseconds)

    return () => clearInterval(timer); // Clean up interval on component unmount
  }, []);

  const loadScores = async () => {
    setRefreshing(true); // Start refreshing animation
    try {
      const storedScores = await AsyncStorage.getItem("quizScores");
      if (storedScores) {
        setQuizScores(JSON.parse(storedScores));
      }
    } catch (error) {
      console.error("Error loading scores:", error);
    } finally {
      setRefreshing(false); // End refreshing animation
    }
  };

  function handleAvatarPress() {
    if (email === "") {
      router.push("/login");
    } else {
      router.push("/profile");
    }
  }

  useEffect(() => {
    generateRandomScores();
  }, [interval]);

  const generateRandomScores = () => {
    const scores = [];
    switch (interval) {
      case "Weekly":
        scores.push(generateRandomScore(), generateRandomScore());
        break;
      case "Monthly":
        scores.push(
          generateRandomScore(),
          generateRandomScore(),
          generateRandomScore()
        );
        break;
      case "Yearly":
        scores.push(
          generateRandomScore(),
          generateRandomScore(),
          generateRandomScore(),
          generateRandomScore()
        );
        break;
      default:
        scores.push(generateRandomScore(), generateRandomScore());
        break;
    }
    // setQuizScores(scores);
  };

  const generateRandomScore = () => {
    return Math.floor(Math.random() * 101); // Generate random score between 0 to 100
  };

  const getColorForScore = (score) => {
    return score >= 50 ? colors.positiveColor : colors.negativeColor; // Green if score >= 50, red otherwise
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const onRefresh = () => {
    loadScores();
  };

  const formattedTime = Math.floor(totalTimeSpent / 60000); // Convert to minutes
  const progressWidth = (formattedTime / 60) * 100; // Calculate percentage

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerText}>Welcome, {email}!</Text>
          <Text style={styles.subHeaderText}>
            Let's see your progress today
          </Text>
        </View>
        <Image
          source={require("../assets/images/profile.png")}
          style={styles.avatar}
        />
      </View>
      {!expanded && (
        <View style={styles.intervalContainer}>
          {["Weekly", "Monthly", "Yearly"].map((int) => (
            <TouchableOpacity
              key={int}
              style={[
                styles.intervalButton,
                interval === int && styles.activeIntervalButton,
              ]}
              onPress={() => setInterval(int)}
            >
              <Text
                style={[
                  styles.intervalButtonText,
                  interval === int && styles.activeIntervalButtonText,
                ]}
              >
                {int}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {!expanded ? (
          <View style={styles.statisticsContainer}>
            <Text style={styles.sectionTitle}>Quiz Statistics</Text>
            <BarChart
              data={{
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                datasets: [
                  {
                    data: quizScores.map((score) => score.score),
                  },
                ],
              }}
              width={Dimensions.get("window").width - 40}
              height={220}
              yAxisLabel=""
              chartConfig={{
                backgroundColor: colors.chartBackground,
                backgroundGradientFrom: colors.chartGradientFrom,
                backgroundGradientTo: colors.chartGradientTo,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              style={styles.chartStyle}
            />
            <Text style={styles.totalTimeText}>
              {formattedTime} min / 60 min
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: `${progressWidth}%` }]} />
            </View>
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={toggleExpanded}
            >
              <Text style={styles.detailsButtonText}>VIEW HISTORY</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.reportContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={toggleExpanded}
            >
              <Icon name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.sectionTitle}>History</Text>

            {quizScores.map((score, index) => (
              <View key={index} style={styles.reportCard}>
                <Text style={styles.quizTitle}>{score.subjectName}</Text>
                <Text
                  style={[
                    styles.quizScore,
                    { color: getColorForScore(score.score) },
                  ]}
                >
                  {(score.score / score.questionAmount) * 100}%
                </Text>
                <Text style={styles.quizDetails}>
                  Correct answers: {score.score}/{score.questionAmount}
                </Text>
                <Text style={styles.quizDetails}>
                  Incorrect/skipped: {score.questionAmount - score.score}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      <Navbar active="analytics" />
    </SafeAreaView>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  headerText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  subHeaderText: {
    color: "white",
    fontSize: 14,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  intervalContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: colors.secondaryBackground,
  },
  intervalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  intervalButtonText: {
    color: "white",
    fontSize: 14,
  },
  activeIntervalButton: {
    backgroundColor: colors.activeButtonColor,
  },
  activeIntervalButtonText: {
    color: "black",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  statisticsContainer: {
    alignItems: "center",
  },
  sectionTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
  totalTimeText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
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
  encouragementText: {
    color: "white",
    fontSize: 16,
    marginTop: 5,
  },
  detailsButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.activeButtonColor,
    borderRadius: 20,
  },
  detailsButtonText: {
    color: "black",
    fontSize: 14,
    fontWeight: "bold",
  },
  reportContainer: {
    alignItems: "center",
  },
  reportCard: {
    width: width - 40,
    backgroundColor: "#14213D",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  quizTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  quizScore: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center", // Center text horizontally
  },
  quizDetails: {
    color: "white",
    fontSize: 14,
    textAlign: "center", // Center text horizontally
  },
  moreText: {
    color: colors.activeButtonColor,
    fontSize: 14,
    marginTop: 10,
  },
  lessText: {
    color: colors.activeButtonColor,
    fontSize: 14,
    marginTop: 10,
  },
  backButton: {
    position: "absolute",
    left: 5,
    top: -5,
    padding: 10,
    backgroundColor: colors.secondaryBackground,
    borderRadius: 50,
  },
});
