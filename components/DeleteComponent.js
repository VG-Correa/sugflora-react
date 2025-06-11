import React from "react";
import { View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native";

const DeleteConfirmationModal = ({ visible, title, message, onConfirm, onCancel }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{title}</Text>
          <Text>{message}</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} style={styles.deleteButton}>
              <Text style={styles.buttonText}>Sim</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  cancelButton: {
    marginRight: 10,
    padding: 10,
  },
  deleteButton: {
    backgroundColor: "#d9534f",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
  },
  cancelText: {
    color: "#555",
  },
});

export default DeleteConfirmationModal;
