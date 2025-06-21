import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFamiliaData } from '../data/familias/FamiliaDataContext';
import { useGeneroData } from '../data/generos/GeneroDataContext';
import { useEspecieData } from '../data/especies/EspecieDataContext';
import { useSugestaoIdentificacaoData } from '../data/sugestoes/SugestaoIdentificacaoContext';
import { useUsuarioData } from '../data/usuarios/UsuarioDataContext';
import CustomPicker from '../components/CustomPicker';
import HeaderInterno from '../components/HeaderInterno';

const ChatAjudemeaIdentificar = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { coleta } = route.params;

  const { familias, getFamiliaById } = useFamiliaData();
  const { generos, getGenerosByFamilia, getGeneroById } = useGeneroData();
  const { especies, getEspeciesByGenero, getEspecieById } = useEspecieData();
  const { addSugestao } = useSugestaoIdentificacaoData();
  const { usuarios } = useUsuarioData();

  const [loading, setLoading] = useState(false);
  const [familia, setFamilia] = useState(null);
  const [genero, setGenero] = useState(null);
  const [especie, setEspecie] = useState(null);
  const [nomeComum, setNomeComum] = useState('');
  const [justificativa, setJustificativa] = useState('');
  const [confianca, setConfianca] = useState(3);
  const [observacoesAdicionais, setObservacoesAdicionais] = useState('');

  // Simular usuário logado (em produção, viria do contexto de autenticação)
  const usuarioLogado = usuarios[0]; // Usuário 1 como exemplo

  // Carrega gêneros quando família muda
  useEffect(() => {
    const famId = familia?.id;
    if (!famId) {
      setGenero(null);
      return;
    }

    try {
      const generosResponse = getGenerosByFamilia(famId);
      if (generosResponse.status !== 200) {
        console.error("Erro ao carregar gêneros:", generosResponse.message);
      }
    } catch (error) {
      console.error("Erro ao carregar gêneros:", error);
    }
  }, [familia?.id, getGenerosByFamilia]);

  // Carrega espécies quando gênero muda
  useEffect(() => {
    const genId = genero?.id;
    if (!genId) {
      setEspecie(null);
      return;
    }

    try {
      const especiesResponse = getEspeciesByGenero(genId);
      if (especiesResponse.status !== 200) {
        console.error("Erro ao carregar espécies:", especiesResponse.message);
      }
    } catch (error) {
      console.error("Erro ao carregar espécies:", error);
    }
  }, [genero?.id, getEspeciesByGenero]);

  // Sincroniza família e gênero quando espécie é alterada
  useEffect(() => {
    if (!especie) return;
    
    if (especie && genero && especie.genero_id !== genero?.id) {
      setGenero(getGeneroById(especie.genero_id).data);
    }

    if (genero && familia && genero.familia_id !== familia?.id) {
      setFamilia(getFamiliaById(genero.familia_id).data);
    }
  }, [especie, genero, familia, getGeneroById, getFamiliaById]);

  const handleFamiliaSelect = (item) => {
    if (!item || item.id === 0) {
      setFamilia(null);
      setGenero(null);
      setEspecie(null);
      return;
    }

    setFamilia(getFamiliaById(item.id).data);
    if (genero && genero.familia_id !== item.id) {
      setGenero(null);
      setEspecie(null);
    }
  };

  const handleGeneroSelect = (item) => {
    if (!item || item.id === 0) {
      setGenero(null);
      setEspecie(null);
      return;
    }
    const gen = getGeneroById(item.id).data;
    setGenero(gen);
    const fam = getFamiliaById(gen.familia_id).data; 
    setFamilia(fam);

    if (especie && especie.genero_id !== item.id) {
      setEspecie(null);
    }
  };

  const handleEspecieSelect = (item) => {
    const esp = getEspecieById(item.id).data;
    const gen = getGeneroById(esp.genero_id).data;
    const fam = getFamiliaById(gen.familia_id).data;

    if (familia?.id !== fam.id) {
      setFamilia(fam);
    }
    if (genero?.id !== gen.id) {
      setGenero(gen);
    }
    setEspecie(esp);
  };

  const handleSubmit = async () => {
    try {
      // Validações
      if (!justificativa.trim()) {
        Alert.alert('Erro', 'A justificativa é obrigatória');
        return;
      }

      if (!familia && !genero && !especie) {
        Alert.alert('Erro', 'Selecione pelo menos uma classificação taxonômica');
        return;
      }

      setLoading(true);

      const sugestao = {
        id: undefined,
        coleta_id: coleta.id,
        usuario_sugerente_id: usuarioLogado.id,
        especie_sugerida_id: especie?.id || null,
        genero_sugerido_id: genero?.id || null,
        familia_sugerida_id: familia?.id || null,
        nome_comum_sugerido: nomeComum.trim() || null,
        justificativa: justificativa.trim(),
        confianca: confianca,
        status: 'pendente',
        observacoes_adicionais: observacoesAdicionais.trim() || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted: false,
      };

      const response = await addSugestao(sugestao);

      if (response.status === 201) {
        Alert.alert(
          'Sucesso',
          'Sua sugestão de identificação foi enviada com sucesso!',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ],
          { cancelable: false }
        );
      } else {
        throw new Error(response.message || 'Erro ao enviar sugestão');
      }
    } catch (error) {
      console.error('Erro ao enviar sugestão:', error);
      Alert.alert(
        'Erro',
        error.message || 'Não foi possível enviar a sugestão. Por favor, tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancelar Sugestão',
      'Tem certeza que deseja cancelar? Suas informações serão perdidas.',
      [
        {
          text: 'Continuar Editando',
          style: 'cancel',
        },
        {
          text: 'Cancelar',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const getConfiancaText = (nivel) => {
    switch (nivel) {
      case 1: return 'Muito Baixa';
      case 2: return 'Baixa';
      case 3: return 'Média';
      case 4: return 'Alta';
      case 5: return 'Muito Alta';
      default: return 'Média';
    }
  };

  return (
    <View style={styles.container}>
      <HeaderInterno title="Sugerir Identificação" />
      
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView}>
          {/* Informações da Coleta */}
          <View style={styles.coletaInfoContainer}>
            <Text style={styles.sectionTitle}>📋 Coleta para Identificação</Text>
            <View style={styles.coletaCard}>
              <Text style={styles.coletaNome}>{coleta.nome}</Text>
              <Text style={styles.coletaData}>
                Coletada em {new Date(coleta.data_coleta).toLocaleDateString('pt-BR')}
              </Text>
              {coleta.observacoes && (
                <Text style={styles.coletaObservacoes}>
                  Observações: {coleta.observacoes}
                </Text>
              )}
            </View>
          </View>

          {/* Formulário de Sugestão */}
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>💡 Sua Sugestão de Identificação</Text>

            {/* Classificação Taxonômica */}
            <View style={styles.taxonomiaContainer}>
              <Text style={styles.formLabel}>🔬 Classificação Taxonômica</Text>
              
              <Text style={styles.formSubLabel}>Família</Text>
              <CustomPicker
                items={[{
                  id: 0,
                  label: "Selecione a família primeiro",
                }].concat(
                  familias.map((f) => {
                    return f.deleted === false ? {
                      id: f.id,
                      label: f.nome,
                    } : null;
                  }).filter(Boolean)
                )}
                placeholder="Selecione a família (opcional)"
                value={familia?.id}
                onChange={handleFamiliaSelect}
              />

              <Text style={styles.formSubLabel}>Gênero</Text>
              <CustomPicker
                items={[{
                  id: 0,
                  label: "Selecione o genero",
                }].concat(
                  generos.map((g) => {
                    const item = {
                      id: g.id,
                      label: g.nome,
                    }

                    if (!familia) return item;

                    return g.deleted === false && g.familia_id === familia?.id ? 
                    item : null;
                  }).filter(Boolean)
                )}
                placeholder="Selecione o gênero (opcional)"
                value={genero?.id}
                onChange={handleGeneroSelect}
              />

              <Text style={styles.formSubLabel}>Espécie</Text>
              <CustomPicker
                items={[{
                  id: 0,
                  label: "Selecione a espécie",
                }].concat(
                  especies.map((e) => {
                  const item = {
                    id: e.id,
                    label: e.nome,
                  }
                  if (!genero || !familia) return item;
                  return e.deleted === false && e.genero_id === genero?.id ? 
                  item : null;}).filter(Boolean)
                )}
                placeholder="Selecione a espécie (opcional)"
                value={especie?.id}
                onChange={handleEspecieSelect}
              />

              <Text style={styles.formSubLabel}>Nome Comum</Text>
              <TextInput
                style={styles.textInput}
                value={nomeComum}
                onChangeText={setNomeComum}
                placeholder="Digite o nome comum (opcional)"
              />
            </View>

            {/* Justificativa */}
            <View style={styles.justificativaContainer}>
              <Text style={styles.formLabel}>📝 Justificativa *</Text>
              <Text style={styles.formDescription}>
                Explique por que você acredita que esta coleta pertence à espécie sugerida. 
                Inclua características morfológicas, distribuição geográfica, habitat, etc.
              </Text>
              <TextInput
                style={styles.textArea}
                value={justificativa}
                onChangeText={setJustificativa}
                placeholder="Descreva sua justificativa para a identificação..."
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            {/* Nível de Confiança */}
            <View style={styles.confiancaContainer}>
              <Text style={styles.formLabel}>⭐ Nível de Confiança</Text>
              <Text style={styles.formDescription}>
                Indique o quão confiante você está na sua identificação
              </Text>
              
              <View style={styles.confiancaButtons}>
                {[1, 2, 3, 4, 5].map((nivel) => (
                  <TouchableOpacity
                    key={nivel}
                    style={[
                      styles.confiancaButton,
                      confianca === nivel && styles.confiancaButtonActive
                    ]}
                    onPress={() => setConfianca(nivel)}
                  >
                    <Text style={[
                      styles.confiancaButtonText,
                      confianca === nivel && styles.confiancaButtonTextActive
                    ]}>
                      {nivel}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <Text style={styles.confiancaText}>
                Confiança: {getConfiancaText(confianca)}
              </Text>
            </View>

            {/* Observações Adicionais */}
            <View style={styles.observacoesContainer}>
              <Text style={styles.formLabel}>📋 Observações Adicionais</Text>
              <Text style={styles.formDescription}>
                Informações complementares que possam ajudar na identificação
              </Text>
              <TextInput
                style={styles.textArea}
                value={observacoesAdicionais}
                onChangeText={setObservacoesAdicionais}
                placeholder="Observações adicionais (opcional)..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Informações de Segurança */}
            <View style={styles.segurancaContainer}>
              <Text style={styles.segurancaTitle}>🔒 Informações de Segurança</Text>
              <Text style={styles.segurancaText}>
                • Sua sugestão será revisada pelo coletor da amostra{'\n'}
                • As informações sobre projeto e localização são mantidas em sigilo{'\n'}
                • Você pode acompanhar o status da sua sugestão{'\n'}
                • Sugestões aceitas contribuem para o conhecimento científico
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Botões de Ação */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Enviar Sugestão</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  coletaInfoContainer: {
    backgroundColor: '#fff',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  coletaCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
  },
  coletaNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  coletaData: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  coletaObservacoes: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    elevation: 2,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  formSubLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
    marginTop: 15,
  },
  formDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
    lineHeight: 16,
  },
  taxonomiaContainer: {
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fff',
    minHeight: 80,
  },
  justificativaContainer: {
    marginBottom: 20,
  },
  confiancaContainer: {
    marginBottom: 20,
  },
  confiancaButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  confiancaButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  confiancaButtonActive: {
    backgroundColor: '#2e7d32',
    borderColor: '#2e7d32',
  },
  confiancaButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  confiancaButtonTextActive: {
    color: '#fff',
  },
  confiancaText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  observacoesContainer: {
    marginBottom: 20,
  },
  segurancaContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2e7d32',
  },
  segurancaTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  segurancaText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    elevation: 4,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  submitButton: {
    flex: 2,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#2e7d32',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChatAjudemeaIdentificar;
