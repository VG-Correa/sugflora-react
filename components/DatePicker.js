import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const DatePicker = ({
  value,
  onChange,
  placeholder = "Selecione uma data",
  label,
  style,
  disabled = false,
  minimumDate,
  maximumDate,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("pt-BR");
  };

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(false);

    if (event.type === "set" && selectedDate) {
      onChange(selectedDate);
    }
  };

  const showDatePicker = () => {
    if (!disabled) {
      setShowPicker(true);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={[
          styles.input,
          disabled && styles.disabledInput,
          value && styles.hasValue,
        ]}
        onPress={showDatePicker}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.inputText,
            !value && styles.placeholderText,
            disabled && styles.disabledText,
          ]}
        >
          {value ? formatDate(value) : placeholder}
        </Text>
        <Text style={styles.calendarIcon}>📅</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          locale="pt-BR"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    height: 48,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  placeholderText: {
    color: "#999",
  },
  disabledInput: {
    backgroundColor: "#f5f5f5",
    borderColor: "#ccc",
  },
  disabledText: {
    color: "#999",
  },
  hasValue: {
    borderColor: "#2e7d32",
  },
  calendarIcon: {
    fontSize: 18,
    marginLeft: 10,
  },
});

export default DatePicker;
