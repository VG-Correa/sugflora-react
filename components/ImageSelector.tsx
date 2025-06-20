import React from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

/**
 * Props:
 * images: array of uri strings
 * onAddImage: function(uri) => void
 * onRemoveImage: function(uri) => void
 * disabled: boolean (optional)
 */
export default function ImageSelector({
  images = [],
  onAddImage,
  onRemoveImage,
  disabled = false,
}) {
  const pickImage = async () => {
    if (disabled) return;

    try {
      // Solicitar permissão
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão necessária",
          "Precisamos de permissão para acessar suas fotos."
        );
        return;
      }

      // Abrir galeria
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        if (asset.base64) {
          const base64Image = `data:image/jpeg;base64,${asset.base64}`;
          onAddImage(base64Image);
        } else if (asset.uri) {
          onAddImage(asset.uri);
        }
      }
    } catch (error) {
      console.error("Erro ao selecionar imagem:", error);
      Alert.alert(
        "Erro",
        "Não foi possível selecionar a imagem. Tente novamente."
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.previewContainer}>
        {images.map((uri, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri }} style={styles.image} />
            {!disabled && (
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => onRemoveImage(uri)}
              >
                <Ionicons name="close-circle" size={20} color="#f00" />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      {!disabled && (
        <TouchableOpacity style={styles.addBtn} onPress={pickImage}>
          <Ionicons name="add" size={24} color="#fff" />
          <Text style={styles.addBtnText}>Adicionar Imagem</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  previewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  imageWrapper: {
    position: "relative",
    marginRight: 10,
    marginBottom: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeBtn: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    borderRadius: 8,
  },
  addBtnText: {
    marginLeft: 8,
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
