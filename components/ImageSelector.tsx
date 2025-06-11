import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Ionicons } from '@expo/vector-icons';

/**
 * Props:
 * images: array of uri strings
 * onAddImage: function(uri) => void
 * onRemoveImage: function(uri) => void
 */
export default function ImageSelector({ images = [], onAddImage, onRemoveImage }) {
  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 0,
        quality: 0.7,
      },
      (response) => {
        if (response.didCancel) {
          return;
        }
        if (response.errorCode) {
          alert('Erro ao acessar a galeria: ' + response.errorMessage);
          return;
        }
        const assets = response.assets || [];
        assets.forEach((asset) => {
          if (asset.uri) {
            onAddImage(asset.uri);
          }
        });
      }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.previewContainer}>
        {images.map((uri) => (
          <View key={uri} style={styles.imageWrapper}>
            <Image source={{ uri }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => onRemoveImage(uri)}
            >
              <Ionicons name="close-circle" size={20} color="#f00" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.addBtn} onPress={pickImage}>
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.addBtnText}>Adicionar Imagem</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  previewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
    marginBottom: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 8,
  },
  addBtnText: {
    marginLeft: 8,
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
