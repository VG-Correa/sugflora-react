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

const BiodiversityReport = () => {
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
    console.log("=== USEEFFECT LOAD USER DATA ===");
    loadUserData();
  }, []);

  useEffect(() => {
    console.log("=== USEEFFECT BIODIVERSITY REPORT ===");
    console.log("projeto:", projeto);
    console.log("coletas carregadas:", coletas.length);
    console.log("campos carregados:", campos.length);
    console.log("familias carregadas:", familias.length);
    console.log("generos carregados:", generos.length);
    console.log("especies carregadas:", especies.length);
    console.log("user_id:", user_id);

    if (projeto && coletas.length > 0 && campos.length > 0 && 
        familias.length > 0 && generos.length > 0 && especies.length > 0 && user_id) {
      console.log("Todos os dados necessários estão disponíveis, gerando relatório...");
      generateBiodiversityReport();
    } else {
      console.log("Aguardando carregamento dos dados...");
      console.log("Projeto:", !!projeto);
      console.log("Coletas:", coletas.length);
      console.log("Campos:", campos.length);
      console.log("Famílias:", familias.length);
      console.log("Gêneros:", generos.length);
      console.log("Espécies:", especies.length);
      console.log("User ID:", !!user_id);
    }
  }, [projeto, coletas, campos, familias, generos, especies, user_id]);

  const loadUserData = async () => {
    try {
      console.log("=== CARREGANDO DADOS DO USUÁRIO ===");
      
      const token = await AsyncStorage.getItem("token");
      const storedUserId = await AsyncStorage.getItem("user_id");
      
      console.log("Token encontrado:", !!token);
      console.log("User ID encontrado:", storedUserId);

      if (!token) {
        console.log("Token não encontrado");
        Alert.alert("Erro", "Token não encontrado. Faça login novamente.");
        navigation.navigate("Login");
        return;
      }

      if (!storedUserId) {
        console.log("User ID não encontrado");
        Alert.alert("Erro", "Usuário não identificado");
        navigation.navigate("Login");
        return;
      }

      setUser_id(storedUserId);
      console.log("User ID definido:", storedUserId);
      
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
      Alert.alert("Erro", "Erro ao carregar dados do usuário");
      navigation.navigate("Login");
    }
  };

  const generateBiodiversityReport = () => {
    setLoading(true);

    try {
      console.log("=== GERANDO RELATÓRIO DE BIODIVERSIDADE ===");
      console.log("projeto:", projeto);
      console.log("coletas disponíveis:", coletas.length);
      console.log("campos disponíveis:", campos.length);
      console.log("familias disponíveis:", familias.length);
      console.log("generos disponíveis:", generos.length);
      console.log("especies disponíveis:", especies.length);

      // Filtrar coletas do projeto
      const camposDoProjeto = campos.filter(c => c.projeto_id === projeto.id);
      console.log("campos do projeto:", camposDoProjeto);

      const coletasDoProjeto = coletas.filter(c => 
        !c.deleted && camposDoProjeto.some(campo => campo.id === c.campo_id)
      );
      console.log("coletas do projeto:", coletasDoProjeto.length);

      if (coletasDoProjeto.length === 0) {
        console.log("Nenhuma coleta encontrada para este projeto");
        setReportData({
          error: "Nenhuma coleta encontrada para este projeto"
        });
        setLoading(false);
        return;
      }

      console.log("Iniciando análises...");

      // Análise de biodiversidade
      const biodiversidade = analyzeBiodiversity(coletasDoProjeto);
      console.log("biodiversidade analisada:", biodiversidade);
      
      // Análise de riqueza de espécies
      const riquezaEspecies = analyzeSpeciesRichness(coletasDoProjeto);
      console.log("riqueza de espécies analisada:", riquezaEspecies);
      
      // Análise de distribuição
      const distribuicao = analyzeDistribution(coletasDoProjeto, camposDoProjeto);
      console.log("distribuição analisada:", distribuicao);
      
      // Análise temporal
      const analiseTemporal = analyzeTemporalPatterns(coletasDoProjeto);
      console.log("análise temporal:", analiseTemporal);

      const finalReportData = {
        projeto,
        totalColetas: coletasDoProjeto.length,
        biodiversidade,
        riquezaEspecies,
        distribuicao,
        analiseTemporal,
        coletas: coletasDoProjeto,
        generatedAt: new Date().toISOString()
      };

      console.log("Relatório final gerado:", finalReportData);
      setReportData(finalReportData);

    } catch (error) {
      console.error("Erro ao gerar relatório de biodiversidade:", error);
      setReportData({
        error: `Erro ao gerar relatório: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const analyzeBiodiversity = (coletas) => {
    console.log("=== ANALISANDO BIODIVERSIDADE ===");
    console.log("coletas recebidas:", coletas.length);
    console.log("familias disponíveis:", familias.length);
    console.log("generos disponíveis:", generos.length);
    console.log("especies disponíveis:", especies.length);

    const familiasCount = {};
    const generosCount = {};
    const especiesCount = {};
    const especiesUnicas = new Set();

    coletas.forEach(coleta => {
      console.log("Processando coleta:", coleta.id);
      
      // Contagem por família
      if (coleta.familia_id) {
        const familia = familias.find(f => f.id === coleta.familia_id);
        const familiaNome = familia ? familia.nome : "Família não identificada";
        familiasCount[familiaNome] = (familiasCount[familiaNome] || 0) + 1;
        console.log("Família encontrada:", familiaNome);
      }

      // Contagem por gênero
      if (coleta.genero_id) {
        const genero = generos.find(g => g.id === coleta.genero_id);
        const generoNome = genero ? genero.nome : "Gênero não identificado";
        generosCount[generoNome] = (generosCount[generoNome] || 0) + 1;
        console.log("Gênero encontrado:", generoNome);
      }

      // Contagem por espécie
      if (coleta.especie_id) {
        const especie = especies.find(e => e.id === coleta.especie_id);
        const especieNome = especie ? especie.nome : "Espécie não identificada";
        especiesCount[especieNome] = (especiesCount[especieNome] || 0) + 1;
        especiesUnicas.add(coleta.especie_id);
        console.log("Espécie encontrada:", especieNome);
      }
    });

    // Calcular índices de biodiversidade
    const totalFamilias = Object.keys(familiasCount).length;
    const totalGeneros = Object.keys(generosCount).length;
    const totalEspecies = especiesUnicas.size;

    console.log("Totais calculados:", { totalFamilias, totalGeneros, totalEspecies });

    // Índice de Shannon-Wiener
    const shannonIndex = calculateShannonIndex(especiesCount);

    // Índice de Simpson
    const simpsonIndex = calculateSimpsonIndex(especiesCount);

    const result = {
      familiasCount,
      generosCount,
      especiesCount,
      totalFamilias,
      totalGeneros,
      totalEspecies,
      shannonIndex,
      simpsonIndex,
      especiesUnicas: Array.from(especiesUnicas)
    };

    console.log("Resultado da análise de biodiversidade:", result);
    return result;
  };

  const analyzeSpeciesRichness = (coletas) => {
    console.log("=== ANALISANDO RIQUEZA DE ESPÉCIES ===");
    
    const riquezaPorCampo = {};
    const especiesPorCampo = {};

    coletas.forEach(coleta => {
      console.log("Processando coleta para riqueza:", coleta.id, "campo_id:", coleta.campo_id);
      
      if (coleta.campo_id && coleta.especie_id) {
        const campo = campos.find(c => c.id === coleta.campo_id);
        const especie = especies.find(e => e.id === coleta.especie_id);
        
        if (campo && especie) {
          const campoNome = campo.nome;
          
          if (!especiesPorCampo[campoNome]) {
            especiesPorCampo[campoNome] = new Set();
          }
          
          especiesPorCampo[campoNome].add(coleta.especie_id);
          console.log("Espécie adicionada ao campo:", campoNome, "espécie:", especie.nome);
        }
      }
    });

    // Calcular riqueza por campo
    Object.keys(especiesPorCampo).forEach(campoNome => {
      riquezaPorCampo[campoNome] = especiesPorCampo[campoNome].size;
      console.log("Riqueza do campo", campoNome, ":", riquezaPorCampo[campoNome]);
    });

    // Encontrar campo com maior riqueza
    const campoMaisRico = Object.keys(riquezaPorCampo).reduce((a, b) => 
      riquezaPorCampo[a] > riquezaPorCampo[b] ? a : b, null
    );

    const result = {
      riquezaPorCampo,
      campoMaisRico,
      especiesPorCampo: Object.fromEntries(
        Object.entries(especiesPorCampo).map(([campo, especies]) => [
          campo, 
          Array.from(especies)
        ])
      )
    };

    console.log("Resultado da análise de riqueza:", result);
    return result;
  };

  const analyzeDistribution = (coletas, camposDoProjeto) => {
    console.log("=== ANALISANDO DISTRIBUIÇÃO ===");
    console.log("coletas recebidas:", coletas.length);
    console.log("campos do projeto:", camposDoProjeto.length);
    
    const distribuicaoPorCampo = {};
    const distribuicaoPorStatus = {
      identificadas: 0,
      naoIdentificadas: 0
    };

    // Inicializar contadores para cada campo
    camposDoProjeto.forEach(campo => {
      distribuicaoPorCampo[campo.nome] = 0;
      console.log("Campo inicializado:", campo.nome);
    });

    // Contar coletas por campo e status
    coletas.forEach(coleta => {
      console.log("Processando coleta para distribuição:", coleta.id);
      
      const campo = camposDoProjeto.find(c => c.id === coleta.campo_id);
      if (campo) {
        distribuicaoPorCampo[campo.nome]++;
        console.log("Coleta contada para campo:", campo.nome);
      }

      if (coleta.identificada) {
        distribuicaoPorStatus.identificadas++;
      } else {
        distribuicaoPorStatus.naoIdentificadas++;
      }
    });

    const result = {
      distribuicaoPorCampo,
      distribuicaoPorStatus,
      totalCampos: camposDoProjeto.length,
      campoComMaisColetas: Object.keys(distribuicaoPorCampo).reduce((a, b) => 
        distribuicaoPorCampo[a] > distribuicaoPorCampo[b] ? a : b, null
      )
    };

    console.log("Resultado da análise de distribuição:", result);
    return result;
  };

  const analyzeTemporalPatterns = (coletas) => {
    console.log("=== ANALISANDO PADRÕES TEMPORAIS ===");
    
    const coletasPorMes = {};
    const coletasPorAno = {};

    coletas.forEach(coleta => {
      console.log("Processando coleta para análise temporal:", coleta.id, "data:", coleta.data_coleta);
      
      if (coleta.data_coleta) {
        try {
          const data = new Date(coleta.data_coleta);
          if (!isNaN(data.getTime())) {
            const mes = data.getMonth() + 1; // Janeiro = 1
            const ano = data.getFullYear();
            
            const mesNome = data.toLocaleDateString('pt-BR', { month: 'long' });
            const anoStr = ano.toString();
            
            coletasPorMes[mesNome] = (coletasPorMes[mesNome] || 0) + 1;
            coletasPorAno[anoStr] = (coletasPorAno[anoStr] || 0) + 1;
            
            console.log("Coleta processada - Mês:", mesNome, "Ano:", anoStr);
          }
        } catch (error) {
          console.log("Erro ao processar data da coleta:", coleta.data_coleta, error);
        }
      }
    });

    // Encontrar mês e ano mais ativos
    const mesMaisAtivo = Object.keys(coletasPorMes).reduce((a, b) => 
      coletasPorMes[a] > coletasPorMes[b] ? a : b, null
    );
    
    const anoMaisAtivo = Object.keys(coletasPorAno).reduce((a, b) => 
      coletasPorAno[a] > coletasPorAno[b] ? a : b, null
    );

    const result = {
      coletasPorMes,
      coletasPorAno,
      mesMaisAtivo,
      anoMaisAtivo,
      totalMeses: Object.keys(coletasPorMes).length,
      totalAnos: Object.keys(coletasPorAno).length
    };

    console.log("Resultado da análise temporal:", result);
    return result;
  };

  const calculateShannonIndex = (especiesCount) => {
    console.log("=== CALCULANDO ÍNDICE DE SHANNON ===");
    console.log("especiesCount:", especiesCount);
    
    const especies = Object.values(especiesCount);
    const total = especies.reduce((sum, count) => sum + count, 0);
    
    if (total === 0) {
      console.log("Total de espécies é 0, retornando 0");
      return 0;
    }
    
    let shannonIndex = 0;
    especies.forEach(count => {
      if (count > 0) {
        const pi = count / total;
        shannonIndex -= pi * Math.log(pi);
      }
    });
    
    console.log("Índice de Shannon calculado:", shannonIndex);
    return shannonIndex.toFixed(3);
  };

  const calculateSimpsonIndex = (especiesCount) => {
    console.log("=== CALCULANDO ÍNDICE DE SIMPSON ===");
    console.log("especiesCount:", especiesCount);
    
    const especies = Object.values(especiesCount);
    const total = especies.reduce((sum, count) => sum + count, 0);
    
    if (total === 0) {
      console.log("Total de espécies é 0, retornando 0");
      return 0;
    }
    
    let simpsonIndex = 0;
    especies.forEach(count => {
      if (count > 0) {
        const pi = count / total;
        simpsonIndex += pi * pi;
      }
    });
    
    console.log("Índice de Simpson calculado:", simpsonIndex);
    return simpsonIndex.toFixed(3);
  };

  const handleSaveReport = async () => {
    try {
      console.log("=== SALVANDO RELATÓRIO ===");
      console.log("reportData:", reportData);
      
      if (!reportData || reportData.error) {
        console.log("Relatório não pode ser salvo - dados inválidos");
        Alert.alert("Erro", "Relatório não pode ser salvo. Dados inválidos.");
        return;
      }

      const relatorio = {
        id: undefined,
        titulo: `Relatório de Biodiversidade - ${projeto.nome}`,
        descricao: `Relatório de biodiversidade gerado para o projeto ${projeto.nome}`,
        tipo: "biodiversidade",
        projeto_id: projeto.id,
        usuario_id: parseInt(user_id),
        data_inicio: new Date().toISOString(),
        data_fim: new Date().toISOString(),
        status: "ativo",
        arquivo_url: undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted: false
      };

      console.log("Relatório a ser salvo:", relatorio);

      const response = await createRelatorio(relatorio);
      
      if (response.status === 200) {
        console.log("Relatório salvo com sucesso");
        Alert.alert(
          "Sucesso",
          "Relatório salvo com sucesso!",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      } else {
        console.log("Erro ao salvar relatório - status:", response.status);
        Alert.alert("Erro", "Erro ao salvar relatório");
      }
    } catch (error) {
      console.error("Erro ao salvar relatório:", error);
      Alert.alert("Erro", "Erro ao salvar relatório");
    }
  };

  const handleShare = async () => {
    try {
      console.log("=== COMPARTILHANDO RELATÓRIO ===");
      
      if (!reportData || reportData.error) {
        console.log("Relatório não pode ser compartilhado - dados inválidos");
        Alert.alert("Erro", "Relatório não pode ser compartilhado. Dados inválidos.");
        return;
      }
      
      const reportText = generateReportText();
      console.log("Texto do relatório para compartilhamento:", reportText);
      
      await Share.share({
        message: reportText,
        title: `Relatório de Biodiversidade - ${projeto?.nome || "Projeto"}`
      });
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
      Alert.alert("Erro", "Erro ao compartilhar relatório");
    }
  };

  const generateReportText = () => {
    if (!reportData) {
      console.log("reportData é null, retornando texto vazio");
      return "";
    }

    console.log("=== GERANDO TEXTO DO RELATÓRIO ===");
    console.log("reportData:", reportData);

    let text = `RELATÓRIO DE BIODIVERSIDADE\n`;
    text += `Projeto: ${projeto?.nome || "Projeto não identificado"}\n`;
    text += `Data: ${new Date().toLocaleDateString("pt-BR")}\n\n`;

    text += `RESUMO EXECUTIVO:\n`;
    text += `- Total de coletas: ${reportData.totalColetas || 0}\n`;
    text += `- Famílias identificadas: ${reportData.biodiversidade?.totalFamilias || 0}\n`;
    text += `- Gêneros identificados: ${reportData.biodiversidade?.totalGeneros || 0}\n`;
    text += `- Espécies únicas: ${reportData.biodiversidade?.totalEspecies || 0}\n`;
    text += `- Índice de Shannon-Wiener: ${reportData.biodiversidade?.shannonIndex || "N/A"}\n`;
    text += `- Índice de Simpson: ${reportData.biodiversidade?.simpsonIndex || "N/A"}\n\n`;

    if (reportData.riquezaEspecies?.campoMaisRico) {
      text += `CAMPO COM MAIOR RIQUEZA:\n`;
      text += `- ${reportData.riquezaEspecies.campoMaisRico}\n\n`;
    }

    if (reportData.analiseTemporal?.mesMaisAtivo) {
      text += `PADRÕES TEMPORAIS:\n`;
      text += `- Mês mais ativo: ${reportData.analiseTemporal.mesMaisAtivo}\n`;
      if (reportData.analiseTemporal?.anoMaisAtivo) {
        text += `- Ano mais ativo: ${reportData.analiseTemporal.anoMaisAtivo}\n`;
      }
      text += `\n`;
    }

    console.log("Texto do relatório gerado:", text);
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
          <Text style={styles.loadingText}>Gerando relatório de biodiversidade...</Text>
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

  // Verificação de segurança para reportData
  if (!reportData) {
    return (
      <View style={styles.container}>
        <HeaderInterno />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erro ao gerar relatório. Dados não disponíveis.</Text>
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
        <Text style={styles.pageTitle}>RELATÓRIO DE BIODIVERSIDADE</Text>
        <Text style={styles.projectName}>{projeto.nome}</Text>

        {/* Resumo Executivo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo Executivo</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryNumber}>{reportData.totalColetas || 0}</Text>
              <Text style={styles.summaryLabel}>Total de Coletas</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryNumber}>{reportData.biodiversidade?.totalFamilias || 0}</Text>
              <Text style={styles.summaryLabel}>Famílias</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryNumber}>{reportData.biodiversidade?.totalGeneros || 0}</Text>
              <Text style={styles.summaryLabel}>Gêneros</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryNumber}>{reportData.biodiversidade?.totalEspecies || 0}</Text>
              <Text style={styles.summaryLabel}>Espécies Únicas</Text>
            </View>
          </View>
        </View>

        {/* Índices de Biodiversidade */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Índices de Biodiversidade</Text>
          <View style={styles.indicesContainer}>
            <View style={styles.indexCard}>
              <Text style={styles.indexLabel}>Índice de Shannon-Wiener</Text>
              <Text style={styles.indexValue}>{reportData.biodiversidade?.shannonIndex || "N/A"}</Text>
              <Text style={styles.indexDescription}>
                Mede a diversidade considerando riqueza e equitabilidade
              </Text>
            </View>
            <View style={styles.indexCard}>
              <Text style={styles.indexLabel}>Índice de Simpson</Text>
              <Text style={styles.indexValue}>{reportData.biodiversidade?.simpsonIndex || "N/A"}</Text>
              <Text style={styles.indexDescription}>
                Mede a probabilidade de duas coletas serem da mesma espécie
              </Text>
            </View>
          </View>
        </View>

        {/* Riqueza de Espécies */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Riqueza de Espécies por Campo</Text>
          <View style={styles.richnessContainer}>
            {Object.entries(reportData.riquezaEspecies?.riquezaPorCampo || {}).map(([campo, riqueza]) => (
              <View key={campo} style={styles.richnessItem}>
                <Text style={styles.campoName}>{campo}</Text>
                <Text style={styles.riquezaValue}>{riqueza} espécies</Text>
              </View>
            ))}
          </View>
          {reportData.riquezaEspecies?.campoMaisRico && (
            <Text style={styles.highlightText}>
              Campo com maior riqueza: {reportData.riquezaEspecies.campoMaisRico}
            </Text>
          )}
        </View>

        {/* Distribuição */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Distribuição das Coletas</Text>
          <View style={styles.distributionContainer}>
            <Text style={styles.subsectionTitle}>Por Campo:</Text>
            {Object.entries(reportData.distribuicao?.distribuicaoPorCampo || {}).map(([campo, count]) => (
              <View key={campo} style={styles.distributionItem}>
                <Text style={styles.campoName}>{campo}</Text>
                <Text style={styles.countValue}>{count} coletas</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Padrões Temporais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Padrões Temporais</Text>
          <View style={styles.temporalContainer}>
            {reportData.analiseTemporal?.mesMaisAtivo && (
              <Text style={styles.highlightText}>
                Mês mais ativo: {reportData.analiseTemporal.mesMaisAtivo}
              </Text>
            )}
            {reportData.analiseTemporal?.anoMaisAtivo && (
              <Text style={styles.highlightText}>
                Ano mais ativo: {reportData.analiseTemporal.anoMaisAtivo}
              </Text>
            )}
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
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  summaryCard: {
    backgroundColor: "#e8f5e9",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    minWidth: "45%",
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },
  indicesContainer: {
    gap: 15,
  },
  indexCard: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  indexLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  indexValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 5,
  },
  indexDescription: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  richnessContainer: {
    gap: 10,
  },
  richnessItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
  },
  campoName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  riquezaValue: {
    fontSize: 16,
    color: "#2e7d32",
    fontWeight: "bold",
  },
  distributionContainer: {
    gap: 10,
  },
  distributionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
  },
  countValue: {
    fontSize: 16,
    color: "#2e7d32",
    fontWeight: "bold",
  },
  temporalContainer: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
  },
  highlightText: {
    fontSize: 16,
    color: "#2e7d32",
    fontWeight: "600",
    marginBottom: 5,
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

export default BiodiversityReport; 