import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import DatePicker from "@dietime/react-native-date-picker";

const CustomDatePicker = ({
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
  const [tempDate, setTempDate] = useState(value || new Date());

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

  const handleWebDateChange = (selectedDate) => {
    setTempDate(selectedDate);
  };

  const handleWebConfirm = () => {
    setShowPicker(false);
    onChange(tempDate);
  };

  const handleWebCancel = () => {
    setShowPicker(false);
    setTempDate(value || new Date());
  };

  const showDatePicker = () => {
    if (!disabled) {
      setTempDate(value || new Date());
      setShowPicker(true);
    }
  };

  // Reset temp date when value changes
  useEffect(() => {
    if (value) {
      setTempDate(value);
    }
  }, [value]);

  return (
    <View style={[styles.container]}>
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
        Platform.OS === 'web' ? (
          <Modal
            visible={showPicker}
            transparent={true}
            animationType="fade"
            onRequestClose={handleWebCancel}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Selecionar Data</Text>
                </View>
                <View style={styles.datePickerContainer}>
                  <DatePicker
                    value={tempDate}
                    onChange={handleWebDateChange}
                    minimumDate={minimumDate}
                    maximumDate={maximumDate}
                    locale="pt-BR"
                    format="dd/MM/yyyy"
                    style={styles.webDatePicker}
                  />
                </View>
                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={handleWebCancel}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={handleWebConfirm}
                  >
                    <Text style={styles.confirmButtonText}>Confirmar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        ) : (
          <DateTimePicker
            value={value || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            locale="pt-BR"
          />
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2e7d32",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  input: {
    height: 52,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 17,
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
    transitionProperty: "border-color, box-shadow",
    transitionDuration: "0.2s",
  },
  inputText: {
    fontSize: 17,
    color: "#222",
    flex: 1,
  },
  placeholderText: {
    color: "#bdbdbd",
  },
  disabledInput: {
    backgroundColor: "#f3f3f3",
    borderColor: "#e0e0e0",
    opacity: 0.7,
  },
  disabledText: {
    color: "#bdbdbd",
  },
  hasValue: {
    borderColor: "#388e3c",
    shadowColor: "#388e3c",
    shadowOpacity: 0.1,
    elevation: 3,
  },
  calendarIcon: {
    fontSize: 22,
    marginLeft: 14,
    color: "#388e3c",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: Platform.OS === 'web' ? 400 : '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  datePickerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  webDatePicker: {
    width: '100%',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  confirmButton: {
    backgroundColor: '#2e7d32',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default CustomDatePicker;
