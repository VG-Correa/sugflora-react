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
  const [currentMonth, setCurrentMonth] = useState(value ? new Date(value.getFullYear(), value.getMonth(), 1) : new Date());

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
      setCurrentMonth(value ? new Date(value.getFullYear(), value.getMonth(), 1) : new Date());
      setShowPicker(true);
    }
  };

  // Funções para o calendário web
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isSameDay = (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const isDateDisabled = (date) => {
    if (minimumDate && date < minimumDate) return true;
    if (maximumDate && date > maximumDate) return true;
    return false;
  };

  const selectDate = (day) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setTempDate(selectedDate);
  };

  const changeMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const changeYear = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setFullYear(newMonth.getFullYear() + direction);
    setCurrentMonth(newMonth);
  };

  const getMonthName = (date) => {
    const months = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    return months[date.getMonth()];
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Adicionar dias vazios no início
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }

    // Adicionar dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isSelected = isSameDay(date, tempDate);
      const isDisabled = isDateDisabled(date);
      const isToday = isSameDay(date, new Date());

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.calendarDay,
            isSelected && styles.selectedDay,
            isToday && !isSelected && styles.todayDay,
            isDisabled && styles.disabledDay
          ]}
          onPress={() => !isDisabled && selectDate(day)}
          disabled={isDisabled}
        >
          <Text style={[
            styles.dayText,
            isSelected && styles.selectedDayText,
            isToday && !isSelected && styles.todayDayText,
            isDisabled && styles.disabledDayText
          ]}>
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    return days;
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
                
                {/* Navegação do mês/ano */}
                <View style={styles.calendarHeader}>
                  <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => changeYear(-1)}
                  >
                    <Text style={styles.navButtonText}>{"<<"}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => changeMonth(-1)}
                  >
                    <Text style={styles.navButtonText}>{"<"}</Text>
                  </TouchableOpacity>
                  
                  <View style={styles.monthYearContainer}>
                    <Text style={styles.monthYearText}>
                      {getMonthName(currentMonth)} {currentMonth.getFullYear()}
                    </Text>
                  </View>
                  
                  <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => changeMonth(1)}
                  >
                    <Text style={styles.navButtonText}>{">"}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => changeYear(1)}
                  >
                    <Text style={styles.navButtonText}>{">>"}</Text>
                  </TouchableOpacity>
                </View>

                {/* Dias da semana */}
                <View style={styles.weekDaysContainer}>
                  {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day, index) => (
                    <View key={index} style={styles.weekDay}>
                      <Text style={styles.weekDayText}>{day}</Text>
                    </View>
                  ))}
                </View>

                {/* Calendário */}
                <View style={styles.calendarContainer}>
                  {renderCalendar()}
                </View>

                {/* Data selecionada */}
                <View style={styles.selectedDateContainer}>
                  <Text style={styles.selectedDateText}>
                    Data selecionada: {formatDate(tempDate)}
                  </Text>
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
    width: Platform.OS === 'web' ? 350 : '90%',
    maxWidth: 350,
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
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  navButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  monthYearContainer: {
    flex: 1,
    alignItems: 'center',
  },
  monthYearText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  weekDaysContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekDay: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  calendarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  calendarDay: {
    width: '14.28%',
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 1,
  },
  dayText: {
    fontSize: 14,
    color: '#333',
  },
  selectedDay: {
    backgroundColor: '#2e7d32',
    borderRadius: 17.5,
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  todayDay: {
    backgroundColor: '#e8f5e8',
    borderRadius: 17.5,
    borderWidth: 1,
    borderColor: '#2e7d32',
  },
  todayDayText: {
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  disabledDay: {
    opacity: 0.3,
  },
  disabledDayText: {
    color: '#ccc',
  },
  selectedDateContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  selectedDateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2e7d32',
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
