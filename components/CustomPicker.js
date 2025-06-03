import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  StyleSheet,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CustomPicker = ({
  items,
  defaultValue,
  onChange,
  placeholder = "Selecione",
  style
}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  
  // Filtrar itens baseado no texto de pesquisa
  const filteredItems = items.filter(item => 
    item.valor.toLowerCase().includes(searchText.toLowerCase())
  );

  // Definir valor padrão
  useEffect(() => {
    if (defaultValue) {
      const defaultItem = items.find(item => item.id === defaultValue);
      if (defaultItem) {
        setSelectedItem(defaultItem);
        onChange(defaultItem);
      }
    }
  }, [defaultValue, items]);

  const handleSelect = (item) => {
    setSelectedItem(item);
    onChange(item);
    setModalVisible(false);
    setSearchText('');
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity 
        style={styles.pickerButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={selectedItem ? styles.selectedText : styles.placeholderText}>
          {selectedItem ? selectedItem.valor : placeholder}
        </Text>
        <Ionicons 
          name={modalVisible ? "chevron-up" : "chevron-down"} 
          size={18} 
          color="#666" 
        />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Header da Modal */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione um item</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            {/* Campo de Pesquisa */}
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Pesquisar..."
                placeholderTextColor="#999"
                value={searchText}
                onChangeText={setSearchText}
                autoFocus={true}
              />
            </View>
            
            {/* Lista de Itens */}
            <FlatList
              data={filteredItems}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.itemContainer}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.itemText}>{item.valor}</Text>
                  {selectedItem?.id === item.id && (
                    <Ionicons name="checkmark" size={18} color="#2e7d32" />
                  )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              keyboardShouldPersistTaps="handled"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  pickerButton: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedText: {
    flex: 1,
    color: '#333',
  },
  placeholderText: {
    flex: 1,
    color: '#999',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginHorizontal: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#333',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 16,
  },
});

export default CustomPicker;