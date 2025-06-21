{/* TELA 24 DO PROTÓTIPO */}

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFamiliaData } from '../data/familias/FamiliaDataContext';
import { useGeneroData } from '../data/generos/GeneroDataContext';
import { useEspecieData } from '../data/especies/EspecieDataContext';
import { useSugestaoIdentificacaoData } from '../data/sugestoes/SugestaoIdentificacaoContext';
import HeaderInterno from '../components/HeaderInterno';

const TelaPedidodeAjuda = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { coleta } = route.params;

  const { familias } = useFamiliaData();
  const { generos } = useGeneroData();
  const { especies } = useEspecieData();
  const { getSugestoesByColetaId } = useSugestaoIdentificacaoData();

  const [sugestoes, setSugestoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    carregarSugestoes();
  }, [coleta.id]);

  const carregarSugestoes = async () => {
    try {
      setLoading(true);
      const response = getSugestoesByColetaId(coleta.id);
      
      if (response.status === 200 && response.data) {
        setSugestoes(response.data);
      } else {
        setSugestoes([]);
      }
    } catch (error) {
      console.error('Erro ao carregar sugestões:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (dataString) => {
    if (!dataString) return 'Data não informada';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  const getFamiliaNome = (familiaId) => {
    if (!familiaId) return 'Não definida';
    const familia = familias.find(f => f.id === familiaId);
    return familia ? familia.nome : 'Não encontrada';
  };

  const getGeneroNome = (generoId) => {
    if (!generoId) return 'Não definido';
    const genero = generos.find(g => g.id === generoId);
    return genero ? genero.nome : 'Não encontrado';
  };

  const getEspecieNome = (especieId) => {
    if (!especieId) return 'Não definida';
    const especie = especies.find(e => e.id === especieId);
    return especie ? especie.nome : 'Não encontrada';
  };

  const handleSugerirIdentificacao = () => {
    navigation.navigate('Chat-AjudemeaIdentificar', { coleta });
  };

  const handleVoltar = () => {
    navigation.goBack();
  };

  const nextImage = () => {
    if (coleta.imagens && coleta.imagens.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === coleta.imagens.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (coleta.imagens && coleta.imagens.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? coleta.imagens.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e7d32" />
        <Text style={styles.loadingText}>Carregando detalhes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderInterno title="Detalhes da Coleta" />
      
      <ScrollView style={styles.scrollView}>
        {/* Header da Coleta */}
        <View style={styles.headerContainer}>
          <View style={styles.coletaInfo}>
            <Text style={styles.coletaNome}>{coleta.nome}</Text>
            <Text style={styles.coletaData}>
              📅 Coletada em {formatarData(coleta.data_coleta)}
            </Text>
          </View>
          <View style={[
            styles.statusBadge,
            { backgroundColor: coleta.identificada ? '#4caf50' : '#ff9800' }
          ]}>
            <Text style={styles.statusText}>
              {coleta.identificada ? 'Identificada' : 'Aguardando Ajuda'}
            </Text>
          </View>
        </View>

        {/* Imagens */}
        {coleta.imagens && coleta.imagens.length > 0 && (
          <View style={styles.imagesContainer}>
            <Text style={styles.imagesTitle}>📸 Imagens da Coleta</Text>
            <View style={styles.imageViewer}>
              <TouchableOpacity style={styles.imageNavButton} onPress={prevImage}>
                <Text style={styles.imageNavText}>‹</Text>
              </TouchableOpacity>
              
              <Image
                source={{ uri: coleta.imagens[currentImageIndex] }}
                style={styles.mainImage}
                resizeMode="cover"
              />
              
              <TouchableOpacity style={styles.imageNavButton} onPress={nextImage}>
                <Text style={styles.imageNavText}>›</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.imageIndicators}>
              {coleta.imagens.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.imageIndicator,
                    index === currentImageIndex && styles.imageIndicatorActive
                  ]}
                />
              ))}
            </View>
            
            <Text style={styles.imageCounter}>
              {currentImageIndex + 1} de {coleta.imagens.length}
            </Text>
          </View>
        )}

        {/* Classificação Atual */}
        <View style={styles.classificacaoContainer}>
          <Text style={styles.sectionTitle}>🔬 Classificação Taxonômica Atual</Text>
          
          <View style={styles.classificacaoRow}>
            <Text style={styles.classificacaoLabel}>Família:</Text>
            <Text style={styles.classificacaoValue}>
              {getFamiliaNome(coleta.familia_id)}
            </Text>
          </View>
          
          <View style={styles.classificacaoRow}>
            <Text style={styles.classificacaoLabel}>Gênero:</Text>
            <Text style={styles.classificacaoValue}>
              {getGeneroNome(coleta.genero_id)}
            </Text>
          </View>
          
          <View style={styles.classificacaoRow}>
            <Text style={styles.classificacaoLabel}>Espécie:</Text>
            <Text style={styles.classificacaoValue}>
              {getEspecieNome(coleta.especie_id)}
            </Text>
          </View>
          
          {coleta.nome_comum && (
            <View style={styles.classificacaoRow}>
              <Text style={styles.classificacaoLabel}>Nome Comum:</Text>
              <Text style={styles.classificacaoValue}>{coleta.nome_comum}</Text>
            </View>
          )}
        </View>

        {/* Observações */}
        {coleta.observacoes && (
          <View style={styles.observacoesContainer}>
            <Text style={styles.sectionTitle}>📝 Observações do Coletor</Text>
            <Text style={styles.observacoesText}>{coleta.observacoes}</Text>
          </View>
        )}

        {/* Sugestões de Identificação */}
        <View style={styles.sugestoesContainer}>
          <Text style={styles.sectionTitle}>💡 Sugestões de Identificação</Text>
          
          {sugestoes.length === 0 ? (
            <View style={styles.emptySugestoes}>
              <Text style={styles.emptySugestoesText}>
                Nenhuma sugestão de identificação ainda.
              </Text>
              <Text style={styles.emptySugestoesSubtext}>
                Seja o primeiro a sugerir uma identificação!
              </Text>
            </View>
          ) : (
            sugestoes.map((sugestao) => (
              <View key={sugestao.id} style={styles.sugestaoCard}>
                <View style={styles.sugestaoHeader}>
                  <Text style={styles.sugestaoUsuario}>
                    Sugestão de Usuário #{sugestao.usuario_sugerente_id}
                  </Text>
                  <View style={[
                    styles.sugestaoStatus,
                    { backgroundColor: getStatusColor(sugestao.status) }
                  ]}>
                    <Text style={styles.sugestaoStatusText}>
                      {getStatusText(sugestao.status)}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.sugestaoContent}>
                  <Text style={styles.sugestaoLabel}>Espécie Sugerida:</Text>
                  <Text style={styles.sugestaoValue}>
                    {getEspecieNome(sugestao.especie_sugerida_id)}
                  </Text>
                  
                  <Text style={styles.sugestaoLabel}>Justificativa:</Text>
                  <Text style={styles.sugestaoJustificativa}>
                    {sugestao.justificativa}
                  </Text>
                  
                  <View style={styles.sugestaoConfianca}>
                    <Text style={styles.sugestaoLabel}>Nível de Confiança:</Text>
                    <View style={styles.confiancaStars}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Text
                          key={star}
                          style={[
                            styles.confiancaStar,
                            star <= sugestao.confianca && styles.confiancaStarActive
                          ]}
                        >
                          ★
                        </Text>
                      ))}
                    </View>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Informações de Segurança */}
        <View style={styles.segurancaContainer}>
          <Text style={styles.sectionTitle}>🔒 Informações de Segurança</Text>
          <Text style={styles.segurancaText}>
            Esta coleta foi disponibilizada publicamente para identificação. 
            As informações sobre projeto e localização específica foram mantidas em sigilo 
            para proteger a privacidade do coletor.
          </Text>
        </View>
      </ScrollView>

      {/* Botões de Ação */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.voltarButton} onPress={handleVoltar}>
          <Text style={styles.voltarButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sugerirButton}
          onPress={handleSugerirIdentificacao}
        >
          <Text style={styles.sugerirButtonText}>💡 Sugerir Identificação</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'aceita': return '#4caf50';
    case 'rejeitada': return '#f44336';
    case 'em_analise': return '#ff9800';
    default: return '#9e9e9e';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'aceita': return 'Aceita';
    case 'rejeitada': return 'Rejeitada';
    case 'em_analise': return 'Em Análise';
    default: return 'Pendente';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 10,
    borderRadius: 10,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  coletaInfo: {
    flex: 1,
  },
  coletaNome: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  coletaData: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  imagesContainer: {
    backgroundColor: '#fff',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    elevation: 2,
  },
  imagesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  imageViewer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  imageNavButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2e7d32',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  imageNavText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  mainImage: {
    width: 250,
    height: 250,
    borderRadius: 10,
  },
  imageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  imageIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  imageIndicatorActive: {
    backgroundColor: '#2e7d32',
  },
  imageCounter: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
  },
  classificacaoContainer: {
    backgroundColor: '#fff',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  classificacaoRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  classificacaoLabel: {
    fontSize: 14,
    color: '#666',
    width: 100,
    fontWeight: 'bold',
  },
  classificacaoValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  observacoesContainer: {
    backgroundColor: '#fff',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    elevation: 2,
  },
  observacoesText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  sugestoesContainer: {
    backgroundColor: '#fff',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    elevation: 2,
  },
  emptySugestoes: {
    alignItems: 'center',
    padding: 20,
  },
  emptySugestoesText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  emptySugestoesSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  sugestaoCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  sugestaoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sugestaoUsuario: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  sugestaoStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sugestaoStatusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  sugestaoContent: {
    marginTop: 10,
  },
  sugestaoLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sugestaoValue: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  sugestaoJustificativa: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
    marginBottom: 10,
  },
  sugestaoConfianca: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confiancaStars: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  confiancaStar: {
    fontSize: 16,
    color: '#ddd',
    marginRight: 2,
  },
  confiancaStarActive: {
    color: '#ffd700',
  },
  segurancaContainer: {
    backgroundColor: '#fff',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    elevation: 2,
  },
  segurancaText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    elevation: 4,
  },
  voltarButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
    alignItems: 'center',
  },
  voltarButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  sugerirButton: {
    flex: 2,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#2e7d32',
    alignItems: 'center',
  },
  sugerirButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default TelaPedidodeAjuda;
