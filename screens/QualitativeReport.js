import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  Share,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import HeaderInterno from "../components/HeaderInterno";
import { useColetaData } from "../data/coletas/ColetaDataContext";
import { useCampoData } from "../data/campos/CampoDataContext";
import { useFamiliaData } from "../data/familias/FamiliaDataContext";
import { useGeneroData } from "../data/generos/GeneroDataContext";
import { useEspecieData } from "../data/especies/EspecieDataContext";
import { useRelatorioData } from "../data/relatorios/RelatorioDataContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const QualitativeReport = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { projeto, tipo } = route.params;

  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [user_id, setUser_id] = useState(null);

  // Contextos
  const { coletas } = useColetaData();
  const { campos } = useCampoData();
  const { familias } = useFamiliaData();
  const { generos } = useGeneroData();
  const { especies } = useEspecieData();
  const { createRelatorio } = useRelatorioData();

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (user_id && projeto) {
      generateQualitativeReport();
    }
  }, [user_id, projeto, coletas, campos, familias, generos, especies]);

  const loadUserData = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("user_id");
      if (!storedUserId) {
        Alert.alert("Erro", "Usuário não identificado");
        navigation.goBack();
        return;
      }
      setUser_id(storedUserId);
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
      Alert.alert("Erro", "Erro ao carregar dados do usuário");
    }
  };

  const generateQualitativeReport = () => {
    setLoading(true);

    try {
      // Filtrar coletas do projeto
      const camposDoProjeto = campos.filter(c => c.projeto_id === projeto.id);
      const coletasDoProjeto = coletas.filter(c => 
        !c.deleted && camposDoProjeto.some(campo => campo.id === c.campo_id)
      );

      if (coletasDoProjeto.length === 0) {
        setReportData({
          error: "Nenhuma coleta encontrada para este projeto"
        });
        setLoading(false);
        return;
      }

      // Análise qualitativa das coletas
      const analiseQualitativa = analyzeQualitativeData(coletasDoProjeto);
      
      // Análise de padrões
      const padroes = analyzePatterns(coletasDoProjeto);
      
      // Análise de observações
      const observacoes = analyzeObservations(coletasDoProjeto);
      
      // Análise de características
      const caracteristicas = analyzeCharacteristics(coletasDoProjeto);

      setReportData({
        projeto,
        totalColetas: coletasDoProjeto.length,
        analiseQualitativa,
        padroes,
        observacoes,
        caracteristicas,
        coletas: coletasDoProjeto,
        generatedAt: new Date().toISOString()
      });

    } catch (error) {
      console.error("Erro ao gerar relatório qualitativo:", error);
      Alert.alert("Erro", "Erro ao gerar relatório qualitativo");
    } finally {
      setLoading(false);
    }
  };

  const analyzeQualitativeData = (coletas) => {
    const coletasComObservacoes = coletas.filter(c => c.observacoes && c.observacoes.trim() !== "");
    const coletasComDescricao = coletas.filter(c => c.descricao && c.descricao.trim() !== "");
    const coletasComImagens = coletas.filter(c => c.imagens && c.imagens.length > 0);

    // Análise de qualidade das identificações
    const identificacoesCompletas = coletas.filter(c => 
      c.familia_id && c.genero_id && c.especie_id
    );
    const identificacoesParciais = coletas.filter(c => 
      (c.familia_id || c.genero_id) && !c.especie_id
    );
    const semIdentificacao = coletas.filter(c => 
      !c.familia_id && !c.genero_id && !c.especie_id
    );

    return {
      totalColetas: coletas.length,
      coletasComObservacoes: coletasComObservacoes.length,
      coletasComDescricao: coletasComDescricao.length,
      coletasComImagens: coletasComImagens.length,
      identificacoesCompletas: identificacoesCompletas.length,
      identificacoesParciais: identificacoesParciais.length,
      semIdentificacao: semIdentificacao.length,
      percentualObservacoes: coletas.length > 0 ? ((coletasComObservacoes.length / coletas.length) * 100).toFixed(1) : 0,
      percentualDescricao: coletas.length > 0 ? ((coletasComDescricao.length / coletas.length) * 100).toFixed(1) : 0,
      percentualImagens: coletas.length > 0 ? ((coletasComImagens.length / coletas.length) * 100).toFixed(1) : 0
    };
  };

  const analyzePatterns = (coletas) => {
    // Padrões temporais
    const coletasPorEstacao = {
      "Primavera": 0,
      "Verão": 0,
      "Outono": 0,
      "Inverno": 0
    };

    coletas.forEach(coleta => {
      if (coleta.data_coleta) {
        const data = new Date(coleta.data_coleta);
        const mes = data.getMonth() + 1;
        
        if (mes >= 9 && mes <= 11) coletasPorEstacao["Primavera"]++;
        else if (mes >= 12 || mes <= 2) coletasPorEstacao["Verão"]++;
        else if (mes >= 3 && mes <= 5) coletasPorEstacao["Outono"]++;
        else coletasPorEstacao["Inverno"]++;
      }
    });

    // Padrões de identificação
    const padroesIdentificacao = {
      "Identificação Imediata": coletas.filter(c => c.identificada && c.data_identificacao === c.data_coleta).length,
      "Identificação Posterior": coletas.filter(c => c.identificada && c.data_identificacao !== c.data_coleta).length,
      "Aguardando Identificação": coletas.filter(c => !c.identificada).length
    };

    // Padrões de coleta por campo
    const padroesPorCampo = {};
    coletas.forEach(coleta => {
      if (coleta.campo_id) {
        const campo = campos.find(c => c.id === coleta.campo_id);
        const campoNome = campo ? campo.nome : "Campo não identificado";
        
        if (!padroesPorCampo[campoNome]) {
          padroesPorCampo[campoNome] = {
            total: 0,
            identificadas: 0,
            comObservacoes: 0,
            comImagens: 0
          };
        }
        
        padroesPorCampo[campoNome].total++;
        if (coleta.identificada) padroesPorCampo[campoNome].identificadas++;
        if (coleta.observacoes) padroesPorCampo[campoNome].comObservacoes++;
        if (coleta.imagens && coleta.imagens.length > 0) padroesPorCampo[campoNome].comImagens++;
      }
    });

    return {
      coletasPorEstacao,
      padroesIdentificacao,
      padroesPorCampo,
      estacaoMaisAtiva: Object.keys(coletasPorEstacao).reduce((a, b) => 
        coletasPorEstacao[a] > coletasPorEstacao[b] ? a : b
      )
    };
  };

  const analyzeObservations = (coletas) => {
    const observacoesCompletas = coletas.filter(c => 
      c.observacoes && c.observacoes.length > 50
    );
    const observacoesMedias = coletas.filter(c => 
      c.observacoes && c.observacoes.length > 20 && c.observacoes.length <= 50
    );
    const observacoesBreves = coletas.filter(c => 
      c.observacoes && c.observacoes.length <= 20
    );

    // Palavras-chave mais comuns nas observações
    const palavrasChave = {};
    coletas.forEach(coleta => {
      if (coleta.observacoes) {
        const palavras = coleta.observacoes.toLowerCase()
          .replace(/[^\w\s]/g, '')
          .split(/\s+/)
          .filter(palavra => palavra.length > 3);
        
        palavras.forEach(palavra => {
          palavrasChave[palavra] = (palavrasChave[palavra] || 0) + 1;
        });
      }
    });

    // Top 10 palavras-chave
    const topPalavrasChave = Object.entries(palavrasChave)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([palavra, count]) => ({ palavra, count }));

    return {
      observacoesCompletas: observacoesCompletas.length,
      observacoesMedias: observacoesMedias.length,
      observacoesBreves: observacoesBreves.length,
      topPalavrasChave,
      percentualObservacoesCompletas: coletas.length > 0 ? 
        ((observacoesCompletas.length / coletas.length) * 100).toFixed(1) : 0
    };
  };

  const analyzeCharacteristics = (coletas) => {
    // Características das coletas identificadas vs não identificadas
    const caracteristicasIdentificadas = {
      comObservacoes: 0,
      comDescricao: 0,
      comImagens: 0,
      comLocalizacao: 0
    };

    const caracteristicasNaoIdentificadas = {
      comObservacoes: 0,
      comDescricao: 0,
      comImagens: 0,
      comLocalizacao: 0
    };

    coletas.forEach(coleta => {
      const target = coleta.identificada ? caracteristicasIdentificadas : caracteristicasNaoIdentificadas;
      
      if (coleta.observacoes) target.comObservacoes++;
      if (coleta.descricao) target.comDescricao++;
      if (coleta.imagens && coleta.imagens.length > 0) target.comImagens++;
      if (coleta.latitude && coleta.longitude) target.comLocalizacao++;
    });

    // Qualidade das identificações por família
    const qualidadePorFamilia = {};
    coletas.forEach(coleta => {
      if (coleta.familia_id) {
        const familia = familias.find(f => f.id === coleta.familia_id);
        const familiaNome = familia ? familia.nome : "Família não identificada";
        
        if (!qualidadePorFamilia[familiaNome]) {
          qualidadePorFamilia[familiaNome] = {
            total: 0,
            comObservacoes: 0,
            comImagens: 0,
            identificacaoCompleta: 0
          };
        }
        
        qualidadePorFamilia[familiaNome].total++;
        if (coleta.observacoes) qualidadePorFamilia[familiaNome].comObservacoes++;
        if (coleta.imagens && coleta.imagens.length > 0) qualidadePorFamilia[familiaNome].comImagens++;
        if (coleta.especie_id) qualidadePorFamilia[familiaNome].identificacaoCompleta++;
      }
    });

    return {
      caracteristicasIdentificadas,
      caracteristicasNaoIdentificadas,
      qualidadePorFamilia
    };
  };

  const handleSaveReport = async () => {
    try {
      const relatorio = {
        id: undefined,
        titulo: `Relatório Qualitativo - ${projeto.nome}`,
        tipo: "qualitativo",
        projeto_id: projeto.id,
        campo_id: null,
        periodo_inicio: null,
        periodo_fim: null,
        dados: reportData,
        usuario_gerador_id: user_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted: false
      };

      const response = await createRelatorio(relatorio);
      
      if (response.status === 200) {
        Alert.alert(
          "Sucesso",
          "Relatório salvo com sucesso!",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert("Erro", "Erro ao salvar relatório");
      }
    } catch (error) {
      console.error("Erro ao salvar relatório:", error);
      Alert.alert("Erro", "Erro ao salvar relatório");
    }
  };

  const handleShare = async () => {
    try {
      const reportText = generateReportText();
      await Share.share({
        message: reportText,
        title: `Relatório Qualitativo - ${projeto.nome}`
      });
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
    }
  };

  const generateReportText = () => {
    if (!reportData) return "";

    let text = `RELATÓRIO QUALITATIVO\n`;
    text += `Projeto: ${projeto.nome}\n`;
    text += `Data: ${new Date().toLocaleDateString("pt-BR")}\n\n`;

    text += `ANÁLISE QUALITATIVA:\n`;
    text += `- Total de coletas: ${reportData.analiseQualitativa.totalColetas}\n`;
    text += `- Coletas com observações: ${reportData.analiseQualitativa.coletasComObservacoes} (${reportData.analiseQualitativa.percentualObservacoes}%)\n`;
    text += `- Coletas com descrição: ${reportData.analiseQualitativa.coletasComDescricao} (${reportData.analiseQualitativa.percentualDescricao}%)\n`;
    text += `- Coletas com imagens: ${reportData.analiseQualitativa.coletasComImagens} (${reportData.analiseQualitativa.percentualImagens}%)\n\n`;

    return text;
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <HeaderInterno />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2e7d32" />
          <Text style={styles.loadingText}>Gerando relatório qualitativo...</Text>
        </View>
      </View>
    );
  }

  if (reportData?.error) {
    return (
      <View style={styles.container}>
        <HeaderInterno />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{reportData.error}</Text>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.buttonText}>VOLTAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderInterno />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.pageTitle}>RELATÓRIO QUALITATIVO</Text>
        <Text style={styles.projectName}>{projeto.nome}</Text>

        {/* Análise Qualitativa Geral */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Análise Qualitativa Geral</Text>
          <View style={styles.qualityGrid}>
            <View style={styles.qualityCard}>
              <Text style={styles.qualityNumber}>{reportData.analiseQualitativa.coletasComObservacoes}</Text>
              <Text style={styles.qualityLabel}>Com Observações</Text>
              <Text style={styles.qualityPercent}>{reportData.analiseQualitativa.percentualObservacoes}%</Text>
            </View>
            <View style={styles.qualityCard}>
              <Text style={styles.qualityNumber}>{reportData.analiseQualitativa.coletasComDescricao}</Text>
              <Text style={styles.qualityLabel}>Com Descrição</Text>
              <Text style={styles.qualityPercent}>{reportData.analiseQualitativa.percentualDescricao}%</Text>
            </View>
            <View style={styles.qualityCard}>
              <Text style={styles.qualityNumber}>{reportData.analiseQualitativa.coletasComImagens}</Text>
              <Text style={styles.qualityLabel}>Com Imagens</Text>
              <Text style={styles.qualityPercent}>{reportData.analiseQualitativa.percentualImagens}%</Text>
            </View>
          </View>
        </View>

        {/* Padrões de Identificação */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Padrões de Identificação</Text>
          <View style={styles.identificationPatterns}>
            <View style={styles.patternCard}>
              <Text style={styles.patternLabel}>Identificação Completa</Text>
              <Text style={styles.patternNumber}>{reportData.analiseQualitativa.identificacoesCompletas}</Text>
              <Text style={styles.patternDescription}>
                Família, gênero e espécie identificados
              </Text>
            </View>
            <View style={styles.patternCard}>
              <Text style={styles.patternLabel}>Identificação Parcial</Text>
              <Text style={styles.patternNumber}>{reportData.analiseQualitativa.identificacoesParciais}</Text>
              <Text style={styles.patternDescription}>
                Apenas família ou gênero identificados
              </Text>
            </View>
            <View style={styles.patternCard}>
              <Text style={styles.patternLabel}>Sem Identificação</Text>
              <Text style={styles.patternNumber}>{reportData.analiseQualitativa.semIdentificacao}</Text>
              <Text style={styles.patternDescription}>
                Aguardando identificação
              </Text>
            </View>
          </View>
        </View>

        {/* Padrões Temporais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Padrões Temporais</Text>
          <View style={styles.temporalPatterns}>
            <Text style={styles.subsectionTitle}>Coletas por Estação:</Text>
            {Object.entries(reportData.padroes.coletasPorEstacao).map(([estacao, count]) => (
              <View key={estacao} style={styles.temporalItem}>
                <Text style={styles.estacaoName}>{estacao}</Text>
                <Text style={styles.estacaoCount}>{count} coletas</Text>
              </View>
            ))}
            <Text style={styles.highlightText}>
              Estação mais ativa: {reportData.padroes.estacaoMaisAtiva}
            </Text>
          </View>
        </View>

        {/* Análise de Observações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Análise de Observações</Text>
          <View style={styles.observationsAnalysis}>
            <View style={styles.observationCard}>
              <Text style={styles.observationLabel}>Observações Completas</Text>
              <Text style={styles.observationNumber}>{reportData.observacoes.observacoesCompletas}</Text>
              <Text style={styles.observationDescription}>Mais de 50 caracteres</Text>
            </View>
            <View style={styles.observationCard}>
              <Text style={styles.observationLabel}>Observações Médias</Text>
              <Text style={styles.observationNumber}>{reportData.observacoes.observacoesMedias}</Text>
              <Text style={styles.observationDescription}>20-50 caracteres</Text>
            </View>
            <View style={styles.observationCard}>
              <Text style={styles.observationLabel}>Observações Breves</Text>
              <Text style={styles.observationNumber}>{reportData.observacoes.observacoesBreves}</Text>
              <Text style={styles.observationDescription}>Menos de 20 caracteres</Text>
            </View>
          </View>
        </View>

        {/* Palavras-chave */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Palavras-chave Mais Comuns</Text>
          <View style={styles.keywordsContainer}>
            {reportData.observacoes.topPalavrasChave.map((item, index) => (
              <View key={index} style={styles.keywordItem}>
                <Text style={styles.keywordText}>{item.palavra}</Text>
                <Text style={styles.keywordCount}>{item.count}x</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Características por Campo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Características por Campo</Text>
          <View style={styles.fieldCharacteristics}>
            {Object.entries(reportData.padroes.padroesPorCampo).map(([campo, stats]) => (
              <View key={campo} style={styles.fieldCharacteristicCard}>
                <Text style={styles.fieldName}>{campo}</Text>
                <View style={styles.fieldStats}>
                  <Text style={styles.fieldStat}>Total: {stats.total}</Text>
                  <Text style={styles.fieldStat}>Identificadas: {stats.identificadas}</Text>
                  <Text style={styles.fieldStat}>Com Obs: {stats.comObservacoes}</Text>
                  <Text style={styles.fieldStat}>Com Imagens: {stats.comImagens}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Botões de Ação */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.shareButton]}
          onPress={handleShare}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>COMPARTILHAR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleSaveReport}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>SALVAR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.backButton]}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>VOLTAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 100,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 5,
    textAlign: "center",
  },
  projectName: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 15,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  qualityGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  qualityCard: {
    backgroundColor: "#e8f5e9",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
  },
  qualityNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  qualityLabel: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },
  qualityPercent: {
    fontSize: 12,
    color: "#2e7d32",
    fontWeight: "600",
    marginTop: 2,
  },
  identificationPatterns: {
    gap: 15,
  },
  patternCard: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  patternLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  patternNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 5,
  },
  patternDescription: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  temporalPatterns: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
  },
  temporalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  estacaoName: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  estacaoCount: {
    fontSize: 16,
    color: "#2e7d32",
    fontWeight: "bold",
  },
  observationsAnalysis: {
    gap: 15,
  },
  observationCard: {
    backgroundColor: "#fff3e0",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ffcc02",
  },
  observationLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f57c00",
    marginBottom: 5,
  },
  observationNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f57c00",
    marginBottom: 5,
  },
  observationDescription: {
    fontSize: 14,
    color: "#666",
  },
  keywordsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  keywordItem: {
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  keywordText: {
    fontSize: 14,
    color: "#1976d2",
    fontWeight: "600",
    marginRight: 5,
  },
  keywordCount: {
    fontSize: 12,
    color: "#1976d2",
    backgroundColor: "#fff",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  fieldCharacteristics: {
    gap: 15,
  },
  fieldCharacteristicCard: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  fieldName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  fieldStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  fieldStat: {
    fontSize: 14,
    color: "#666",
    backgroundColor: "#e9ecef",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  highlightText: {
    fontSize: 16,
    color: "#2e7d32",
    fontWeight: "600",
    marginTop: 10,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  shareButton: {
    backgroundColor: "#007bff",
  },
  saveButton: {
    backgroundColor: "#28a745",
  },
  backButton: {
    backgroundColor: "#666",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 15,
    color: "#2e7d32",
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
});

export default QualitativeReport; 