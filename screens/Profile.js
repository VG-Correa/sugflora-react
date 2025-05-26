import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Adicione esta importação
import HeaderInterno from "../components/HeaderInterno";

const Profile = () => {
  const navigation = useNavigation(); // Adicione este hook

  return (
    <View style={styles.container}>
      {/* Cabeçalho igual ao da HomePage */}
           <HeaderInterno />


      <ScrollView style={styles.content}>
        <Text style={styles.pageTitle}>EDITAR PERFIL</Text>
        
        <View style={styles.profileSection}>
          {/* Seção Foto à esquerda */}
          <View style={styles.photoSection}>
            <Text style={styles.photoLabel}>Foto</Text>
            <View style={styles.photoPlaceholder}></View>
            <TouchableOpacity style={styles.changePhotoButton}>
              <Text style={styles.changePhotoText}>Alterar foto</Text>
            </TouchableOpacity>
          </View>
          
          {/* Dados do perfil à direita */}
          <View style={styles.dataSection}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>NOME</Text>
              <TextInput
                style={styles.input}
                placeholder=""
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>SOBRENOME</Text>
              <TextInput
                style={styles.input}
                placeholder=""
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>SEXO</Text>
              <TextInput
                style={styles.input}
                placeholder=""
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>DATA DE NASCIMENTO</Text>
              <TextInput
                style={styles.input}
                placeholder=""
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>RG</Text>
              <TextInput
                style={styles.input}
                placeholder=""
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>CPF</Text>
              <TextInput
                style={styles.input}
                placeholder=""
              />
            </View>
          </View>
        </View>

        {/* Seção inferior */}
        <View style={styles.bottomSection}>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>PAÍS</Text>
            <TextInput
              style={styles.input}
              placeholder=""
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>ESTADO</Text>
            <TextInput
              style={styles.input}
              placeholder=""
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>CIDADE</Text>
            <TextInput
              style={styles.input}
              placeholder=""
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>ENDEREÇO DE E-MAIL</Text>
            <TextInput
              style={styles.input}
              placeholder=""
            />
          </View>

          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>SALVAR ALTERAÇÕES</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#2e7d32',
  },
  profileSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  photoSection: {
    width: '30%',
    alignItems: 'center',
    marginRight: 20,
  },
  photoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2e7d32',
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e8f5e9',
    marginBottom: 10,
  },
  changePhotoButton: {
    backgroundColor: '#2e7d32',
    padding: 8,
    borderRadius: 5,
  },
  changePhotoText: {
    color: '#fff',
    fontSize: 12,
  },
  dataSection: {
    flex: 1,
  },
  bottomSection: {
    paddingHorizontal: 20,
  },
  fieldGroup: {
    marginBottom: 15,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#555',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  saveButton: {
    backgroundColor: '#2e7d32',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Profile;