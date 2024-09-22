import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";

const Card = ({ title, summary, date }) => (
  <View style={styles.card}>
    <View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSummary}>{summary}</Text>
    </View>
    <Text style={styles.cardDate}>{date}</Text>
  </View>
);

const MobileCardView = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Feather
          name="menu"
          size={24}
          color="#666"
        />
        <Feather
          name="settings"
          size={24}
          color="#666"
        />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.cardGrid}>
          <Card
            title="Title"
            summary="Summary text that can be longer now due to increased vertical space"
            date="Apr 24"
          />
          <Card
            title="Title"
            summary="Summary text that can be longer now due to increased vertical space"
            date="Jan 24"
          />
          <Card
            title="Title"
            summary="Summary text that can be longer now due to increased vertical space"
            date="Aug 23"
          />
          <TouchableOpacity style={styles.addCard}>
            <Feather
              name="plus-circle"
              size={40}
              color="#3498db"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  scrollContent: {
    flexGrow: 1,
  },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    width: "48%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  cardSummary: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  cardDate: {
    fontSize: 12,
    color: "#999",
  },
  addCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    width: "48%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
});

export default MobileCardView;
