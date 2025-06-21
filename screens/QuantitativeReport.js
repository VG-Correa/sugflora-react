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

const QuantitativeReport = () => {
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
    console.log("=== USEEFFECT QUANTITATIVE REPORT ===");
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
      generateQuantitativeReport();
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

  const generateQuantitativeReport = () => {
    setLoading(true);

    try {
      console.log("=== GERANDO RELATÓRIO QUANTITATIVO ===");
      console.log("projeto:", projeto);
      console.log("coletas disponíveis:", coletas.length);
      console.log("campos disponíveis:", campos.length);

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

      console.log("Iniciando cálculos...");

      // Estatísticas gerais
      const estatisticasGerais = calculateGeneralStatistics(coletasDoProjeto);
      console.log("estatísticas gerais:", estatisticasGerais);
      
      // Estatísticas por período
      const estatisticasPeriodo = calculatePeriodStatistics(coletasDoProjeto);
      console.log("estatísticas por período:", estatisticasPeriodo);
      
      // Estatísticas por campo
      const estatisticasCampo = calculateFieldStatistics(coletasDoProjeto, camposDoProjeto);
      console.log("estatísticas por campo:", estatisticasCampo);
      
      // Estatísticas taxonômicas
      const estatisticasTaxonomicas = calculateTaxonomicStatistics(coletasDoProjeto);
      console.log("estatísticas taxonômicas:", estatisticasTaxonomicas);
      
      // Estatísticas de identificação
      const estatisticasIdentificacao = calculateIdentificationStatistics(coletasDoProjeto);
      console.log("estatísticas de identificação:", estatisticasIdentificacao);

      const finalReportData = {
        projeto,
        totalColetas: coletasDoProjeto.length,
        estatisticasGerais,
        estatisticasPeriodo,
        estatisticasCampo,
        estatisticasTaxonomicas,
        estatisticasIdentificacao,
        coletas: coletasDoProjeto,
        generatedAt: new Date().toISOString()
      };

      console.log("Relatório final gerado:", finalReportData);
      setReportData(finalReportData);

    } catch (error) {
      console.error("Erro ao gerar relatório quantitativo:", error);
      setReportData({
        error: `Erro ao gerar relatório: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateGeneralStatistics = (coletas) => {
    const totalColetas = coletas.length;
    const coletasIdentificadas = coletas.filter(c => c.identificada).length;
    const coletasNaoIdentificadas = totalColetas - coletasIdentificadas;
    const taxaIdentificacao = totalColetas > 0 ? (coletasIdentificadas / totalColetas) * 100 : 0;

    // Período de coletas
    const datasColeta = coletas
      .map(c => new Date(c.data_coleta))
      .filter(d => !isNaN(d.getTime()))
      .sort((a, b) => a - b);

    const dataInicio = datasColeta.length > 0 ? datasColeta[0] : null;
    const dataFim = datasColeta.length > 0 ? datasColeta[datasColeta.length - 1] : null;

    return {
      totalColetas,
      coletasIdentificadas,
      coletasNaoIdentificadas,
      taxaIdentificacao: taxaIdentificacao.toFixed(1),
      dataInicio,
      dataFim,
      periodoDias: dataInicio && dataFim ? 
        Math.ceil((dataFim - dataInicio) / (1000 * 60 * 60 * 24)) : 0
    };
  };

  const calculatePeriodStatistics = (coletas) => {
    console.log("=== CALCULANDO ESTATÍSTICAS POR PERÍODO ===");
    
    const coletasPorMes = {};
    const coletasPorAno = {};
    const coletasPorSemana = {};

    coletas.forEach(coleta => {
      if (coleta.data_coleta) {
        try {
          const data = new Date(coleta.data_coleta);
          if (!isNaN(data.getTime())) {
            const mes = data.getMonth() + 1;
            const ano = data.getFullYear();
            const semana = Math.ceil((data.getDate() + new Date(ano, mes - 1, 1).getDay()) / 7);
            const mesAno = `${mes}/${ano}`;
            const semanaAno = `${semana}/${ano}`;

            coletasPorMes[mesAno] = (coletasPorMes[mesAno] || 0) + 1;
            coletasPorAno[ano] = (coletasPorAno[ano] || 0) + 1;
            coletasPorSemana[semanaAno] = (coletasPorSemana[semanaAno] || 0) + 1;
          }
        } catch (error) {
          console.log("Erro ao processar data da coleta:", coleta.data_coleta, error);
        }
      }
    });

    // Verificar se há dados antes de usar reduce
    const mesKeys = Object.keys(coletasPorMes);
    const anoKeys = Object.keys(coletasPorAno);
    const semanaKeys = Object.keys(coletasPorSemana);

    const result = {
      coletasPorMes,
      coletasPorAno,
      coletasPorSemana,
      mesMaisAtivo: mesKeys.length > 0 ? mesKeys.reduce((a, b) => 
        coletasPorMes[a] > coletasPorMes[b] ? a : b
      ) : "N/A",
      anoMaisAtivo: anoKeys.length > 0 ? anoKeys.reduce((a, b) => 
        coletasPorAno[a] > coletasPorAno[b] ? a : b
      ) : "N/A",
      semanaMaisAtiva: semanaKeys.length > 0 ? semanaKeys.reduce((a, b) => 
        coletasPorSemana[a] > coletasPorSemana[b] ? a : b
      ) : "N/A"
    };

    console.log("Resultado das estatísticas por período:", result);
    return result;
  };

  const calculateFieldStatistics = (coletas, camposDoProjeto) => {
    const estatisticasPorCampo = {};

    camposDoProjeto.forEach(campo => {
      const coletasDoCampo = coletas.filter(c => c.campo_id === campo.id);
      const coletasIdentificadas = coletasDoCampo.filter(c => c.identificada).length;
      const taxaIdentificacao = coletasDoCampo.length > 0 ? 
        (coletasIdentificadas / coletasDoCampo.length) * 100 : 0;

      estatisticasPorCampo[campo.nome] = {
        totalColetas: coletasDoCampo.length,
        coletasIdentificadas,
        taxaIdentificacao: taxaIdentificacao.toFixed(1),
        especiesUnicas: new Set(coletasDoCampo.filter(c => c.especie_id).map(c => c.especie_id)).size
      };
    });

    return estatisticasPorCampo;
  };

  const calculateTaxonomicStatistics = (coletas) => {
    console.log("=== CALCULANDO ESTATÍSTICAS TAXONÔMICAS ===");
    
    const familiasCount = {};
    const generosCount = {};
    const especiesCount = {};
    const especiesUnicas = new Set();

    coletas.forEach(coleta => {
      if (coleta.familia_id) {
        const familia = familias.find(f => f.id === coleta.familia_id);
        const familiaNome = familia ? familia.nome : "Família não identificada";
        familiasCount[familiaNome] = (familiasCount[familiaNome] || 0) + 1;
      }

      if (coleta.genero_id) {
        const genero = generos.find(g => g.id === coleta.genero_id);
        const generoNome = genero ? genero.nome : "Gênero não identificado";
        generosCount[generoNome] = (generosCount[generoNome] || 0) + 1;
      }

      if (coleta.especie_id) {
        const especie = especies.find(e => e.id === coleta.especie_id);
        const especieNome = especie ? especie.nome : "Espécie não identificada";
        especiesCount[especieNome] = (especiesCount[especieNome] || 0) + 1;
        especiesUnicas.add(coleta.especie_id);
      }
    });

    // Verificar se há dados antes de usar reduce
    const familiaKeys = Object.keys(familiasCount);
    const generoKeys = Object.keys(generosCount);
    const especieKeys = Object.keys(especiesCount);

    const result = {
      familiasCount,
      generosCount,
      especiesCount,
      totalFamilias: familiaKeys.length,
      totalGeneros: generoKeys.length,
      totalEspecies: especiesUnicas.size,
      familiaMaisComum: familiaKeys.length > 0 ? familiaKeys.reduce((a, b) => 
        familiasCount[a] > familiasCount[b] ? a : b
      ) : "N/A",
      generoMaisComum: generoKeys.length > 0 ? generoKeys.reduce((a, b) => 
        generosCount[a] > generosCount[b] ? a : b
      ) : "N/A",
      especieMaisComum: especieKeys.length > 0 ? especieKeys.reduce((a, b) => 
        especiesCount[a] > especiesCount[b] ? a : b
      ) : "N/A"
    };

    console.log("Resultado das estatísticas taxonômicas:", result);
    return result;
  };

  const calculateIdentificationStatistics = (coletas) => {
    console.log("=== CALCULANDO ESTATÍSTICAS DE IDENTIFICAÇÃO ===");
    
    const identificadasPorMes = {};
    const taxaIdentificacaoPorMes = {};

    coletas.forEach(coleta => {
      if (coleta.data_coleta) {
        try {
          const data = new Date(coleta.data_coleta);
          if (!isNaN(data.getTime())) {
            const mesAno = `${data.getMonth() + 1}/${data.getFullYear()}`;

            if (!identificadasPorMes[mesAno]) {
              identificadasPorMes[mesAno] = { total: 0, identificadas: 0 };
            }

            identificadasPorMes[mesAno].total += 1;
            if (coleta.identificada) {
              identificadasPorMes[mesAno].identificadas += 1;
            }
          }
        } catch (error) {
          console.log("Erro ao processar data da coleta:", coleta.data_coleta, error);
        }
      }
    });

    // Calcular taxa de identificação por mês
    Object.keys(identificadasPorMes).forEach(mesAno => {
      const { total, identificadas } = identificadasPorMes[mesAno];
      taxaIdentificacaoPorMes[mesAno] = total > 0 ? (identificadas / total) * 100 : 0;
    });

    // Verificar se há dados antes de usar reduce
    const taxaKeys = Object.keys(taxaIdentificacaoPorMes);

    const result = {
      identificadasPorMes,
      taxaIdentificacaoPorMes,
      mesComMaiorTaxa: taxaKeys.length > 0 ? taxaKeys.reduce((a, b) => 
        taxaIdentificacaoPorMes[a] > taxaIdentificacaoPorMes[b] ? a : b
      ) : "N/A"
    };

    console.log("Resultado das estatísticas de identificação:", result);
    return result;
  };

  const handleSaveReport = async () => {
    try {
      console.log("=== SALVANDO RELATÓRIO QUANTITATIVO ===");
      console.log("reportData:", reportData);
      
      if (!reportData || reportData.error) {
        console.log("Relatório não pode ser salvo - dados inválidos");
        Alert.alert("Erro", "Relatório não pode ser salvo. Dados inválidos.");
        return;
      }

      const relatorio = {
        id: undefined,
        titulo: `Relatório Quantitativo - ${projeto.nome}`,
        descricao: `Relatório quantitativo gerado para o projeto ${projeto.nome}`,
        tipo: "quantitativo",
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
      console.log("=== COMPARTILHANDO RELATÓRIO QUANTITATIVO ===");
      
      if (!reportData || reportData.error) {
        console.log("Relatório não pode ser compartilhado - dados inválidos");
        Alert.alert("Erro", "Relatório não pode ser compartilhado. Dados inválidos.");
        return;
      }
      
      const reportText = generateReportText();
      console.log("Texto do relatório para compartilhamento:", reportText);
      
      await Share.share({
        message: reportText,
        title: `Relatório Quantitativo - ${projeto?.nome || "Projeto"}`
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

    console.log("=== GERANDO TEXTO DO RELATÓRIO QUANTITATIVO ===");
    console.log("reportData:", reportData);

    let text = `RELATÓRIO QUANTITATIVO\n`;
    text += `Projeto: ${projeto?.nome || "Projeto não identificado"}\n`;
    text += `Data: ${new Date().toLocaleDateString("pt-BR")}\n\n`;

    text += `ESTATÍSTICAS GERAIS:\n`;
    text += `- Total de coletas: ${reportData.estatisticasGerais?.totalColetas || 0}\n`;
    text += `- Coletas identificadas: ${reportData.estatisticasGerais?.coletasIdentificadas || 0}\n`;
    text += `- Taxa de identificação: ${reportData.estatisticasGerais?.taxaIdentificacao || 0}%\n`;
    text += `- Período de coletas: ${reportData.estatisticasGerais?.periodoDias || 0} dias\n\n`;

    text += `ESTATÍSTICAS TAXONÔMICAS:\n`;
    text += `- Famílias: ${reportData.estatisticasTaxonomicas?.totalFamilias || 0}\n`;
    text += `- Gêneros: ${reportData.estatisticasTaxonomicas?.totalGeneros || 0}\n`;
    text += `- Espécies únicas: ${reportData.estatisticasTaxonomicas?.totalEspecies || 0}\n\n`;

    if (reportData.estatisticasPeriodo?.mesMaisAtivo && reportData.estatisticasPeriodo.mesMaisAtivo !== "N/A") {
      text += `PERÍODOS MAIS ATIVOS:\n`;
      text += `- Mês mais ativo: ${reportData.estatisticasPeriodo.mesMaisAtivo}\n`;
      if (reportData.estatisticasPeriodo?.anoMaisAtivo && reportData.estatisticasPeriodo.anoMaisAtivo !== "N/A") {
        text += `- Ano mais ativo: ${reportData.estatisticasPeriodo.anoMaisAtivo}\n`;
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
          <Text style={styles.loadingText}>Gerando relatório quantitativo...</Text>
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
        <Text style={styles.pageTitle}>RELATÓRIO QUANTITATIVO</Text>
        <Text style={styles.projectName}>{projeto.nome}</Text>

        {/* Estatísticas Gerais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estatísticas Gerais</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{reportData.estatisticasGerais?.totalColetas || 0}</Text>
              <Text style={styles.statLabel}>Total de Coletas</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{reportData.estatisticasGerais?.coletasIdentificadas || 0}</Text>
              <Text style={styles.statLabel}>Identificadas</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{reportData.estatisticasGerais?.taxaIdentificacao || 0}%</Text>
              <Text style={styles.statLabel}>Taxa de Identificação</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{reportData.estatisticasGerais?.periodoDias || 0}</Text>
              <Text style={styles.statLabel}>Dias de Coleta</Text>
            </View>
          </View>
        </View>

        {/* Estatísticas Taxonômicas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estatísticas Taxonômicas</Text>
          <View style={styles.taxonomicStats}>
            <View style={styles.taxonomicCard}>
              <Text style={styles.taxonomicNumber}>{reportData.estatisticasTaxonomicas?.totalFamilias || 0}</Text>
              <Text style={styles.taxonomicLabel}>Famílias</Text>
            </View>
            <View style={styles.taxonomicCard}>
              <Text style={styles.taxonomicNumber}>{reportData.estatisticasTaxonomicas?.totalGeneros || 0}</Text>
              <Text style={styles.taxonomicLabel}>Gêneros</Text>
            </View>
            <View style={styles.taxonomicCard}>
              <Text style={styles.taxonomicNumber}>{reportData.estatisticasTaxonomicas?.totalEspecies || 0}</Text>
              <Text style={styles.taxonomicLabel}>Espécies Únicas</Text>
            </View>
          </View>
        </View>

        {/* Estatísticas por Campo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estatísticas por Campo</Text>
          <View style={styles.fieldStats}>
            {Object.entries(reportData.estatisticasCampo || {}).map(([campo, stats]) => (
              <View key={campo} style={styles.fieldCard}>
                <Text style={styles.fieldName}>{campo}</Text>
                <View style={styles.fieldDetails}>
                  <Text style={styles.fieldDetail}>Total: {stats.totalColetas}</Text>
                  <Text style={styles.fieldDetail}>Identificadas: {stats.coletasIdentificadas}</Text>
                  <Text style={styles.fieldDetail}>Taxa: {stats.taxaIdentificacao}%</Text>
                  <Text style={styles.fieldDetail}>Espécies: {stats.especiesUnicas}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Períodos Mais Ativos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Períodos Mais Ativos</Text>
          <View style={styles.periodStats}>
            <View style={styles.periodCard}>
              <Text style={styles.periodLabel}>Mês Mais Ativo</Text>
              <Text style={styles.periodValue}>{reportData.estatisticasPeriodo?.mesMaisAtivo || "N/A"}</Text>
            </View>
            <View style={styles.periodCard}>
              <Text style={styles.periodLabel}>Ano Mais Ativo</Text>
              <Text style={styles.periodValue}>{reportData.estatisticasPeriodo?.anoMaisAtivo || "N/A"}</Text>
            </View>
            <View style={styles.periodCard}>
              <Text style={styles.periodLabel}>Semana Mais Ativa</Text>
              <Text style={styles.periodValue}>{reportData.estatisticasPeriodo?.semanaMaisAtiva || "N/A"}</Text>
            </View>
          </View>
        </View>

        {/* Top Taxa */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Taxa Mais Representadas</Text>
          <View style={styles.topTaxa}>
            <View style={styles.topTaxaCard}>
              <Text style={styles.topTaxaLabel}>Família Mais Comum</Text>
              <Text style={styles.topTaxaValue}>{reportData.estatisticasTaxonomicas?.familiaMaisComum || "N/A"}</Text>
            </View>
            <View style={styles.topTaxaCard}>
              <Text style={styles.topTaxaLabel}>Gênero Mais Comum</Text>
              <Text style={styles.topTaxaValue}>{reportData.estatisticasTaxonomicas?.generoMaisComum || "N/A"}</Text>
            </View>
            <View style={styles.topTaxaCard}>
              <Text style={styles.topTaxaLabel}>Espécie Mais Comum</Text>
              <Text style={styles.topTaxaValue}>{reportData.estatisticasTaxonomicas?.especieMaisComum || "N/A"}</Text>
            </View>
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
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  statCard: {
    backgroundColor: "#e3f2fd",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    minWidth: "45%",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1976d2",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },
  taxonomicStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  taxonomicCard: {
    backgroundColor: "#f3e5f5",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
  },
  taxonomicNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#7b1fa2",
  },
  taxonomicLabel: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },
  fieldStats: {
    gap: 15,
  },
  fieldCard: {
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
  fieldDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  fieldDetail: {
    fontSize: 14,
    color: "#666",
    backgroundColor: "#e9ecef",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  periodStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  periodCard: {
    backgroundColor: "#e8f5e9",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
  },
  periodLabel: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 5,
  },
  periodValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  topTaxa: {
    gap: 15,
  },
  topTaxaCard: {
    backgroundColor: "#fff3e0",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ffcc02",
  },
  topTaxaLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  topTaxaValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f57c00",
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

export default QuantitativeReport; 