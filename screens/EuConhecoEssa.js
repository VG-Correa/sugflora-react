import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useColetaData } from '../data/coletas/ColetaDataContext';
import { useFamiliaData } from '../data/familias/FamiliaDataContext';
import { useGeneroData } from '../data/generos/GeneroDataContext';
import { useEspecieData } from '../data/especies/EspecieDataContext';
import { useUsuarioData } from '../data/usuarios/UsuarioDataContext';
import { useCampoData } from '../data/campos/CampoDataContext';
import { useProjetoData } from '../data/projetos/ProjetoDataContext';
import HeaderInterno from '../components/HeaderInterno';

const EuConhecoEssa = () => {
  const navigation = useNavigation();
  const { getColetasOutrosUsuarios } = useColetaData();
  const { familias } = useFamiliaData();
  const { generos } = useGeneroData();
  const { especies } = useEspecieData();
  const { usuarios } = useUsuarioData();
  const { campos } = useCampoData();
  const { projetos } = useProjetoData();

  const [coletas, setColetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('todas'); // todas, com_imagens, sem_identificacao

  // Simular usuário logado (em produção, viria do contexto de autenticação)
  const usuarioLogado = usuarios[0]; // Usuário 1 como exemplo

  useEffect(() => {
    carregarColetas();
  }, []);

  const carregarColetas = async () => {
    try {
      setLoading(true);
      const response = getColetasOutrosUsuarios(usuarioLogado.id, campos, projetos);
      
      if (response.status === 200 && response.data) {
        setColetas(response.data);
      } else {
        console.log('Nenhuma coleta encontrada:', response.message);
        setColetas([]);
      }
    } catch (error) {
      console.error('Erro ao carregar coletas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as coletas');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await carregarColetas();
    setRefreshing(false);
  };

  const filtrarColetas = (coletas) => {
    switch (filter) {
      case 'com_imagens':
        return coletas.filter(coleta => coleta.imagens && coleta.imagens.length > 0);
      case 'sem_identificacao':
        return coletas.filter(coleta => !coleta.identificada);
      default:
        return coletas;
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

  const handleVerColeta = (coleta) => {
    navigation.navigate('TelaPedidodeAjuda-AjudemeaIdentificar', { coleta });
  };

  const handleSugerirIdentificacao = (coleta) => {
    navigation.navigate('Chat-AjudemeaIdentificar', { coleta });
  };

  const coletasFiltradas = filtrarColetas(coletas);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e7d32" />
        <Text style={styles.loadingText}>Carregando coletas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderInterno title="Eu Conheço Essa!" />
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Filtros */}
        <View style={styles.filterContainer}>
          <Text style={styles.filterTitle}>Filtrar por:</Text>
          <View style={styles.filterButtons}>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'todas' && styles.filterButtonActive]}
              onPress={() => setFilter('todas')}
            >
              <Text style={[styles.filterButtonText, filter === 'todas' && styles.filterButtonTextActive]}>
                Todas
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'com_imagens' && styles.filterButtonActive]}
              onPress={() => setFilter('com_imagens')}
            >
              <Text style={[styles.filterButtonText, filter === 'com_imagens' && styles.filterButtonTextActive]}>
                Com Imagens
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'sem_identificacao' && styles.filterButtonActive]}
              onPress={() => setFilter('sem_identificacao')}
            >
              <Text style={[styles.filterButtonText, filter === 'sem_identificacao' && styles.filterButtonTextActive]}>
                Não Identificadas
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Estatísticas */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>📊 Estatísticas</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{coletasFiltradas.length}</Text>
              <Text style={styles.statLabel}>Coletas Disponíveis</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {coletasFiltradas.filter(c => c.imagens && c.imagens.length > 0).length}
              </Text>
              <Text style={styles.statLabel}>Com Imagens</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {coletasFiltradas.filter(c => !c.identificada).length}
              </Text>
              <Text style={styles.statLabel}>Não Identificadas</Text>
            </View>
          </View>
        </View>

        {/* Lista de Coletas */}
        <View style={styles.coletasContainer}>
          <Text style={styles.sectionTitle}>🌿 Coletas de Outros Usuários que Precisam de Ajuda</Text>
          
          {coletasFiltradas.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhuma coleta encontrada</Text>
              <Text style={styles.emptySubtext}>
                Não há coletas de outros usuários que solicitem ajuda para identificação no momento.
              </Text>
            </View>
          ) : (
            coletasFiltradas.map((coleta) => (
              <View key={coleta.id} style={styles.coletaCard}>
                {/* Header da Coleta */}
                <View style={styles.coletaHeader}>
                  <View style={styles.coletaInfo}>
                    <Text style={styles.coletaNome}>{coleta.nome}</Text>
                    <Text style={styles.coletaData}>
                      📅 {formatarData(coleta.data_coleta)}
                    </Text>
                  </View>
                  <View style={styles.coletaStatus}>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: coleta.identificada ? '#4CAF50' : '#FFA500' }
                    ]}>
                      <Text style={styles.statusText}>
                        {coleta.identificada ? 'Identificada' : 'Não Identificada'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Classificação Taxonômica */}
                <View style={styles.taxonomiaContainer}>
                  <Text style={styles.taxonomiaTitle}>Classificação Atual:</Text>
                  <View style={styles.taxonomiaItems}>
                    <Text style={styles.taxonomiaItem}>
                      Família: {getFamiliaNome(coleta.familia_id)}
                    </Text>
                    <Text style={styles.taxonomiaItem}>
                      Gênero: {getGeneroNome(coleta.genero_id)}
                    </Text>
                    <Text style={styles.taxonomiaItem}>
                      Espécie: {getEspecieNome(coleta.especie_id)}
                    </Text>
                    {coleta.nome_comum && (
                      <Text style={styles.taxonomiaItem}>
                        Nome Comum: {coleta.nome_comum}
                      </Text>
                    )}
                  </View>
                </View>

                {/* Imagens */}
                {coleta.imagens && coleta.imagens.length > 0 && (
                  <View style={styles.imagensContainer}>
                    <Text style={styles.imagensTitle}>📸 Imagens ({coleta.imagens.length})</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {coleta.imagens.map((imagem, index) => (
                        <View key={index} style={styles.imagemContainer}>
                          <Image
                            source={{ uri: imagem }}
                            style={styles.imagem}
                            resizeMode="cover"
                          />
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                )}

                {/* Observações */}
                {coleta.observacoes && (
                  <View style={styles.observacoesContainer}>
                    <Text style={styles.observacoesTitle}>📝 Observações:</Text>
                    <Text style={styles.observacoesText}>{coleta.observacoes}</Text>
                  </View>
                )}

                {/* Botões de Ação */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.verDetalhesButton}
                    onPress={() => handleVerColeta(coleta)}
                  >
                    <Text style={styles.verDetalhesText}>Ver Detalhes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.sugerirButton}
                    onPress={() => handleSugerirIdentificacao(coleta)}
                  >
                    <Text style={styles.sugerirText}>Sugerir Identificação</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
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
  filterContainer: {
    backgroundColor: '#fff',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    elevation: 2,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterButtonActive: {
    backgroundColor: '#2e7d32',
    borderColor: '#2e7d32',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  statsContainer: {
    backgroundColor: '#fff',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  coletasContainer: {
    padding: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  coletaCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  coletaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  coletaInfo: {
    flex: 1,
  },
  coletaNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  coletaData: {
    fontSize: 12,
    color: '#666',
  },
  coletaStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  taxonomiaContainer: {
    marginBottom: 15,
  },
  taxonomiaTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  taxonomiaItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  taxonomiaItem: {
    fontSize: 12,
    color: '#666',
    marginRight: 10,
    marginBottom: 5,
  },
  imagensContainer: {
    marginBottom: 15,
  },
  imagensTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  imagemContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  imagem: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  observacoesContainer: {
    marginBottom: 15,
  },
  observacoesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  observacoesText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  verDetalhesButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 5,
    alignItems: 'center',
  },
  verDetalhesText: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  sugerirButton: {
    backgroundColor: '#2e7d32',
  },
  sugerirText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EuConhecoEssa;
