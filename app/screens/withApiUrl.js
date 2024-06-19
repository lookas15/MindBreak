// withApiUrl.js
import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { fetchQuestions } from "../api"; // Make sure fetchQuestions takes an apiUrl as parameter

const withApiUrl = (WrappedComponent, apiUrl) => {
  return (props) => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      fetchQuestions(apiUrl)
        .then((fetchedQuestions) => {
          setQuestions(fetchedQuestions);
          setLoading(false);
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
        });
    }, [apiUrl]);

    if (loading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading questions.</Text>
        </View>
      );
    }

    return <WrappedComponent {...props} questions={questions} />;
  };
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
});

export default withApiUrl;
