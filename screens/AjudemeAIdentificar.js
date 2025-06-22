import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HeaderInterno from '../components/HeaderInterno';
import { useColetaData } from '../data/coletas/ColetaDataContext';
import { useSugestaoIdentificacaoData } from '../data/sugestoes/SugestaoIdentificacaoContext';
import { useUsuarioData } from '../data/usuarios/UsuarioDataContext';
import { useCampoData } from '../data/campos/CampoDataContext';
import { useProjetoData } from '../data/projetos/ProjetoDataContext';
import { useFamiliaData } from '../data/familias/FamiliaDataContext';
import { useGeneroData } from '../data/generos/GeneroDataContext';
import { useEspecieData } from '../data/especies/EspecieDataContext';

const AjudemeAIdentificar = () => {
  const navigation = useNavigation();
  const { coletas, getColetasSolicitamAjuda } = useColetaData();
  const { sugestoes, getSugestoesByColetaId, updateStatusSugestao } = useSugestaoIdentificacaoData();
  const { usuarios } = useUsuarioData();
  const { campos } = useCampoData();
  const { projetos } = useProjetoData();
  const { familias } = useFamiliaData();
  const { generos } = useGeneroData();
  const { especies } = useEspecieData();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [coletasComSugestoes, setColetasComSugestoes] = useState([]);

  // Simular usuário logado (em produção, viria do contexto de autenticação)
  const usuarioLogado = usuarios[0]; // Usuário 1 como exemplo

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      // Buscar coletas do usuário que solicitam ajuda
      const coletasResponse = getColetasSolicitamAjuda();
      let coletasUsuario = [];
      
      if (coletasResponse.status === 200 && coletasResponse.data) {
        // Filtrar coletas do usuário logado (simulado)
        // Em produção, isso seria baseado no usuário autenticado
        coletasUsuario = coletasResponse.data.filter(coleta => {
          // Buscar o campo da coleta
          const campo = campos.find(c => c.id === coleta.campo_id);
          if (!campo) return false;
          
          // Buscar o projeto do campo
          const projeto = projetos.find(p => p.id === campo.projeto_id);
          if (!projeto) return false;
          
          // Verificar se o usuário é dono do projeto
          return projeto.usuario_dono_id === usuarioLogado.id;
        });
      }

      // Para cada coleta, buscar as sugestões recebidas
      const coletasComSugestoesData = await Promise.all(
        coletasUsuario.map(async (coleta) => {
          const sugestoesResponse = getSugestoesByColetaId(coleta.id);
          const sugestoesColeta = sugestoesResponse.status === 200 ? sugestoesResponse.data : [];
          
          // Buscar informações do campo e projeto
          const campo = campos.find(c => c.id === coleta.campo_id);
          const projeto = projetos.find(p => p.id === campo?.projeto_id);
          
          return {
            ...coleta,
            campo,
            projeto,
            sugestoes: sugestoesColeta,
            totalSugestoes: sugestoesColeta.length,
            sugestoesPendentes: sugestoesColeta.filter(s => s.status === 'pendente').length,
            sugestoesAceitas: sugestoesColeta.filter(s => s.status === 'aceita').length,
            sugestoesRejeitadas: sugestoesColeta.filter(s => s.status === 'rejeitada').length,
          };
        })
      );

      setColetasComSugestoes(coletasComSugestoesData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await carregarDados();
    setRefreshing(false);
  };

  const handleVerDetalhes = (coleta) => {
    navigation.navigate('TelaPedidodeAjuda-AjudemeaIdentificar', { coleta });
  };

  const handleResponderSugestao = (sugestao, acao) => {
    const acaoText = acao === 'aceita' ? 'aceitar' : 'rejeitar';
    
    Alert.alert(
      `Confirmar ${acaoText}`,
      `Tem certeza que deseja ${acaoText} esta sugestão de identificação?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          style: acao === 'aceita' ? 'default' : 'destructive',
          onPress: async () => {
            try {
              const response = await updateStatusSugestao(sugestao.id, acao);
              
              if (response.status === 200) {
                Alert.alert(
                  'Sucesso',
                  acao === 'aceita' 
                    ? 'Sugestão aceita com sucesso! A coleta foi atualizada com a identificação sugerida.' 
                    : 'Sugestão rejeitada com sucesso!',
                  [
                    {
                      text: 'OK',
                      onPress: () => carregarDados(),
                    },
                  ]
                );
              } else {
                throw new Error(response.message);
              }
            } catch (error) {
              console.error('Erro ao atualizar sugestão:', error);
              Alert.alert(
                'Erro',
                'Não foi possível processar sua resposta. Tente novamente.'
              );
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendente': return '#FFA500';
      case 'aceita': return '#4CAF50';
      case 'rejeitada': return '#F44336';
      case 'em_analise': return '#2196F3';
      default: return '#999';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'aceita': return 'Aceita';
      case 'rejeitada': return 'Rejeitada';
      case 'em_analise': return 'Em Análise';
      default: return 'Desconhecido';
    }
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

  const getNomeTaxonomico = (tipo, id) => {
    if (!id) return null;
    
    switch (tipo) {
      case 'familia':
        const familia = familias.find(f => f.id === id);
        return familia ? familia.nome : `Família ID: ${id}`;
      case 'genero':
        const genero = generos.find(g => g.id === id);
        return genero ? genero.nome : `Gênero ID: ${id}`;
      case 'especie':
        const especie = especies.find(e => e.id === id);
        return especie ? especie.nome : `Espécie ID: ${id}`;
      default:
        return `ID: ${id}`;
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <HeaderInterno title="Ajudeme a Identificar" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2e7d32" />
          <Text style={styles.loadingText}>Carregando suas coletas...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderInterno title="Ajudeme a Identificar" />
      
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Estatísticas */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>📊 Resumo das Solicitações</Text>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{coletasComSugestoes.length}</Text>
              <Text style={styles.statLabel}>Coletas com Ajuda</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {coletasComSugestoes.reduce((total, coleta) => total + coleta.totalSugestoes, 0)}
              </Text>
              <Text style={styles.statLabel}>Sugestões Recebidas</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {coletasComSugestoes.reduce((total, coleta) => total + coleta.sugestoesPendentes, 0)}
              </Text>
              <Text style={styles.statLabel}>Pendentes</Text>
            </View>
          </View>
        </View>

        {/* Lista de Coletas */}
        <View style={styles.coletasContainer}>
          <Text style={styles.sectionTitle}>🌿 Suas Coletas que Precisam de Ajuda</Text>
          
          {coletasComSugestoes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>Nenhuma coleta encontrada</Text>
              <Text style={styles.emptyText}>
                Você ainda não tem coletas que solicitaram ajuda para identificação.
              </Text>
            </View>
          ) : (
            coletasComSugestoes.map((coleta) => (
              <View key={coleta.id} style={styles.coletaCard}>
                {/* Cabeçalho da Coleta */}
                <View style={styles.coletaHeader}>
                  <View style={styles.coletaInfo}>
                    <Text style={styles.coletaNome}>{coleta.nome}</Text>
                    <Text style={styles.coletaProjeto}>
                      Projeto: {coleta.projeto?.nome || 'N/A'}
                    </Text>
                    <Text style={styles.coletaData}>
                      Coletada em {new Date(coleta.data_coleta).toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.verDetalhesButton}
                    onPress={() => handleVerDetalhes(coleta)}
                  >
                    <Text style={styles.verDetalhesText}>Ver Detalhes</Text>
                  </TouchableOpacity>
                </View>

                {/* Estatísticas da Coleta */}
                <View style={styles.coletaStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statItemNumber}>{coleta.totalSugestoes}</Text>
                    <Text style={styles.statItemLabel}>Total</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statItemNumber, { color: '#FFA500' }]}>
                      {coleta.sugestoesPendentes}
                    </Text>
                    <Text style={styles.statItemLabel}>Pendentes</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statItemNumber, { color: '#4CAF50' }]}>
                      {coleta.sugestoesAceitas}
                    </Text>
                    <Text style={styles.statItemLabel}>Aceitas</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statItemNumber, { color: '#F44336' }]}>
                      {coleta.sugestoesRejeitadas}
                    </Text>
                    <Text style={styles.statItemLabel}>Rejeitadas</Text>
                  </View>
                </View>

                {/* Sugestões Recebidas */}
                {coleta.sugestoes.length > 0 && (
                  <View style={styles.sugestoesContainer}>
                    <Text style={styles.sugestoesTitle}>💡 Sugestões Recebidas</Text>
                    
                    {coleta.sugestoes.map((sugestao) => {
                      const sugerente = usuarios.find(u => u.id === sugestao.usuario_sugerente_id);
                      
                      return (
                        <View key={sugestao.id} style={styles.sugestaoCard}>
                          {/* Cabeçalho da Sugestão */}
                          <View style={styles.sugestaoHeader}>
                            <View style={styles.sugestaoInfo}>
                              <Text style={styles.sugestaoUsuario}>
                                Sugerido por: {sugerente?.nome || 'Usuário'}
                              </Text>
                              <Text style={styles.sugestaoData}>
                                {new Date(sugestao.created_at).toLocaleDateString('pt-BR')}
                              </Text>
                            </View>
                            <View style={[
                              styles.statusBadge,
                              { backgroundColor: getStatusColor(sugestao.status) }
                            ]}>
                              <Text style={styles.statusText}>
                                {getStatusText(sugestao.status)}
                              </Text>
                            </View>
                          </View>

                          {/* Classificação Sugerida */}
                          <View style={styles.classificacaoContainer}>
                            <Text style={styles.classificacaoTitle}>Classificação Sugerida:</Text>
                            <View style={styles.classificacaoItems}>
                              {sugestao.familia_sugerida_id && (
                                <Text style={styles.classificacaoItem}>
                                  Família: {getNomeTaxonomico('familia', sugestao.familia_sugerida_id)}
                                </Text>
                              )}
                              {sugestao.genero_sugerido_id && (
                                <Text style={styles.classificacaoItem}>
                                  Gênero: {getNomeTaxonomico('genero', sugestao.genero_sugerido_id)}
                                </Text>
                              )}
                              {sugestao.especie_sugerida_id && (
                                <Text style={styles.classificacaoItem}>
                                  Espécie: {getNomeTaxonomico('especie', sugestao.especie_sugerida_id)}
                                </Text>
                              )}
                              {sugestao.nome_comum_sugerido && (
                                <Text style={styles.classificacaoItem}>
                                  Nome Comum: {sugestao.nome_comum_sugerido}
                                </Text>
                              )}
                            </View>
                          </View>

                          {/* Justificativa */}
                          <View style={styles.justificativaContainer}>
                            <Text style={styles.justificativaTitle}>Justificativa:</Text>
                            <Text style={styles.justificativaText}>
                              {sugestao.justificativa}
                            </Text>
                          </View>

                          {/* Confiança */}
                          <View style={styles.confiancaContainer}>
                            <Text style={styles.confiancaTitle}>
                              Nível de Confiança: {getConfiancaText(sugestao.confianca)}
                            </Text>
                            <View style={styles.confiancaStars}>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Text
                                  key={star}
                                  style={[
                                    styles.star,
                                    star <= sugestao.confianca && styles.starActive
                                  ]}
                                >
                                  ★
                                </Text>
                              ))}
                            </View>
                          </View>

                          {/* Observações Adicionais */}
                          {sugestao.observacoes_adicionais && (
                            <View style={styles.observacoesContainer}>
                              <Text style={styles.observacoesTitle}>Observações Adicionais:</Text>
                              <Text style={styles.observacoesText}>
                                {sugestao.observacoes_adicionais}
                              </Text>
                            </View>
                          )}

                          {/* Botões de Ação */}
                          {sugestao.status === 'pendente' && (
                            <View style={styles.actionButtons}>
                              <TouchableOpacity
                                style={[styles.actionButton, styles.acceptButton]}
                                onPress={() => handleResponderSugestao(sugestao, 'aceita')}
                              >
                                <Text style={styles.acceptButtonText}>✓ Aceitar</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={[styles.actionButton, styles.rejectButton]}
                                onPress={() => handleResponderSugestao(sugestao, 'rejeitada')}
                              >
                                <Text style={styles.rejectButtonText}>✗ Rejeitar</Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </View>
                )}
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
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  statsContainer: {
    backgroundColor: '#fff',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    alignItems: 'center',
    padding: 10,
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
  emptyContainer: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  coletaCard: {
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 10,
    padding: 15,
    elevation: 2,
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
  coletaProjeto: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  coletaData: {
    fontSize: 12,
    color: '#999',
  },
  verDetalhesButton: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
  },
  verDetalhesText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  coletaStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statItemNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statItemLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  sugestoesContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  sugestoesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  sugestaoCard: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  sugestaoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sugestaoInfo: {
    flex: 1,
  },
  sugestaoUsuario: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  sugestaoData: {
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  classificacaoContainer: {
    marginBottom: 10,
  },
  classificacaoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  classificacaoItems: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 5,
  },
  classificacaoItem: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  justificativaContainer: {
    marginBottom: 10,
  },
  justificativaTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  justificativaText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 5,
  },
  confiancaContainer: {
    marginBottom: 10,
  },
  confiancaTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  confiancaStars: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 5,
  },
  star: {
    fontSize: 16,
    color: '#ddd',
    marginRight: 2,
  },
  starActive: {
    color: '#FFD700',
  },
  observacoesContainer: {
    marginBottom: 10,
  },
  observacoesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  observacoesText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  acceptButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
  },
  rejectButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default AjudemeAIdentificar;
