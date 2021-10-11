import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Pressable,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Fontisto } from "@expo/vector-icons";
import { theme } from "./color";

const STORAGE_KEY = "@toDos";
const PREVIOUS = "@current";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});

  useEffect(() => {
    loadToDos();
    loadPrevious();
    console.log(toDos);
  }, []);

  const travel = async () => {
    setWorking(false);
    await AsyncStorage.setItem(PREVIOUS, "travel");
  };
  const work = async () => {
    setWorking(true);
    await AsyncStorage.setItem(PREVIOUS, "work");
  };

  const loadPrevious = async () => {
    const p = await AsyncStorage.getItem(PREVIOUS);
    if (p === "work") {
      await setWorking(true);
    } else {
      await setWorking(false);
    }
  };

  const onChangeText = (payload) => setText(payload);

  const saveToDos = async (toSave) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.log(e);
    }
  };
  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    setToDos(JSON.parse(s));
  };
  const addToDo = async () => {
    if (text === "") {
      return;
    }
    const newToDos = {
      ...toDos,
      [Date.now()]: { text, working, finished: false },
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };
  const deleteToDo = async (key) => {
    Alert.alert("Delete To Do?", "Are you sure?", [
      {
        text: "Cancel",
      },
      {
        text: "Yes",
        style: "destructive",
        onPress: async () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          await saveToDos(newToDos);
        },
      },
    ]);
  };
  const finishToDo = async (key) => {
    const newToDos = { ...toDos };
    newToDos[key].finished = !newToDos[key].finished;
    setToDos(newToDos);
    await saveToDos(newToDos);
  };
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.gray }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{ ...styles.btnText, color: working ? theme.gray : "white" }}
          >
            Travel
          </Text>
        </TouchableOpacity>
        {/* <TouchableHighlight
          underlayColor="#DDDDDD"
          activeOpacity={0}
          onPress={() => console.log("dsdfd")}
        >
          <Text style={styles.btnText}>Travel</Text>
        </TouchableHighlight> */}
        {/* <Pressable>
          <Text style={styles.btnText}>Travel</Text>
        </Pressable> */}
      </View>
      <TextInput
        onSubmitEditing={addToDo}
        returnKeyType="done"
        // secureTextEntry=flase
        // keyboardType="number-pad"
        // multiline
        // placeholderTextColor="red"
        // autoCorrect
        // autoCapitalize={"sentences"}
        onChangeText={onChangeText}
        value={text}
        placeholder={working ? "Add a To Do" : "Where do you want to go?"}
        style={styles.input}
      />
      <ScrollView>
        {Object.keys(toDos).map((key) =>
          toDos[key].working === working ? (
            <View style={styles.toDo} key={key}>
              <View style={styles.CheckTextView}>
                <TouchableOpacity
                  style={{ marginRight: 10 }}
                  onPress={() => finishToDo(key)}
                >
                  <Fontisto
                    name={
                      toDos[key].finished
                        ? "checkbox-active"
                        : "checkbox-passive"
                    }
                    size={18}
                    color="black"
                  />
                </TouchableOpacity>
                <Text
                  style={
                    toDos[key].finished
                      ? styles.toDoTextFinished
                      : styles.toDoText
                  }
                >
                  {toDos[key].text}
                </Text>
              </View>
              <TouchableOpacity
                style={{ marginLeft: 20 }}
                onPress={() => deleteToDo(key)}
              >
                <Fontisto
                  name="trash"
                  size={18}
                  color={theme.gray}
                  finished={toDos[key].finished}
                />
              </TouchableOpacity>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
    color: "white",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  CheckTextView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "white",
    fontSize: 20,
    fontWeight: "500",
  },
  toDoTextFinished: {
    textDecorationLine: "line-through",
    textDecorationColor: theme.gray,
    color: theme.gray,
    fontSize: 20,
    fontWeight: "500",
  },
});
