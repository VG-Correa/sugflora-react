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
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import HeaderInterno from "../components/HeaderInterno";
import { useFamiliaData } from "../data/familias/FamiliaDataContext";
import { useGeneroData } from "../data/generos/GeneroDataContext";
import { useEspecieData } from "../data/especies/EspecieDataContext";
import { useCampoData } from "../data/campos/CampoDataContext";

const ReportView = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { coletas, filtros } = route.params;

  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  // Contextos para buscar informações relacionadas
  const { familias } = useFamiliaData();
  const { generos } = useGeneroData();
  const { especies } = useEspecieData();
  const { campos } = useCampoData();

  useEffect(() => {
    if (coletas && filtros) {
      generateReportData();
    }
  }, [coletas, filtros]);

  const generateReportData = () => {
    setLoading(true);

    try {
      // Estatísticas gerais
      const totalColetas = coletas.length;
      const coletasIdentificadas = coletas.filter((c) => c.identificada).length;
      const coletasNaoIdentificadas = totalColetas - coletasIdentificadas;

      // Estatísticas por família
      const familiasCount = {};
      coletas.forEach((coleta) => {
        if (coleta.familia_id) {
          const familia = familias.find((f) => f.id === coleta.familia_id);
          const familiaNome = familia ? familia.nome : "Família não encontrada";
          familiasCount[familiaNome] = (familiasCount[familiaNome] || 0) + 1;
        }
      });

      // Estatísticas por gênero
      const generosCount = {};
      coletas.forEach((coleta) => {
        if (coleta.genero_id) {
          const genero = generos.find((g) => g.id === coleta.genero_id);
          const generoNome = genero ? genero.nome : "Gênero não encontrado";
          generosCount[generoNome] = (generosCount[generoNome] || 0) + 1;
        }
      });

      // Estatísticas por espécie
      const especiesCount = {};
      coletas.forEach((coleta) => {
        if (coleta.especie_id) {
          const especie = especies.find((e) => e.id === coleta.especie_id);
          const especieNome = especie ? especie.nome : "Espécie não encontrada";
          especiesCount[especieNome] = (especiesCount[especieNome] || 0) + 1;
        }
      });

      // Estatísticas por campo
      const camposCount = {};
      coletas.forEach((coleta) => {
        if (coleta.campo_id) {
          const campo = campos.find((c) => c.id === coleta.campo_id);
          const campoNome = campo ? campo.nome : "Campo não encontrado";
          camposCount[campoNome] = (camposCount[campoNome] || 0) + 1;
        }
      });

      // Período de coletas
      const datasColeta = coletas
        .map((c) => new Date(c.data_coleta))
        .filter((d) => !isNaN(d.getTime()))
        .sort((a, b) => a - b);

      const dataInicio = datasColeta.length > 0 ? datasColeta[0] : null;
      const dataFim =
        datasColeta.length > 0 ? datasColeta[datasColeta.length - 1] : null;

      setReportData({
        totalColetas,
        coletasIdentificadas,
        coletasNaoIdentificadas,
        familiasCount,
        generosCount,
        especiesCount,
        camposCount,
        dataInicio,
        dataFim,
        coletas,
        filtros,
      });
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      Alert.alert("Erro", "Erro ao gerar relatório");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Não informada";
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const generateReportText = () => {
    if (!reportData) return "";

    let report = "RELATÓRIO DE COLETAS BOTÂNICAS\n";
    report += "=".repeat(50) + "\n\n";

    // Informações do relatório
    report += `Data de geração: ${new Date().toLocaleDateString("pt-BR")}\n`;
    report += `Tipo de relatório: ${
      filtros.tipoRelatorio === "completo" ? "Completo" : "Resumido"
    }\n`;

    if (filtros.dataInicio || filtros.dataFim) {
      report += `Período: `;
      if (filtros.dataInicio && filtros.dataFim) {
        report += `${filtros.dataInicio.toLocaleDateString(
          "pt-BR"
        )} a ${filtros.dataFim.toLocaleDateString("pt-BR")}\n`;
      } else if (filtros.dataInicio) {
        report += `A partir de ${filtros.dataInicio.toLocaleDateString(
          "pt-BR"
        )}\n`;
      } else if (filtros.dataFim) {
        report += `Até ${filtros.dataFim.toLocaleDateString("pt-BR")}\n`;
      }
    }

    if (filtros.projeto) {
      report += `Projeto: ${filtros.projeto.nome}\n`;
    }

    report += "\n" + "=".repeat(50) + "\n";
    report += "ESTATÍSTICAS GERAIS\n";
    report += "=".repeat(50) + "\n\n";

    report += `Total de coletas: ${reportData.totalColetas}\n`;
    report += `Coletas identificadas: ${reportData.coletasIdentificadas}\n`;
    report += `Coletas não identificadas: ${reportData.coletasNaoIdentificadas}\n`;
    report += `Taxa de identificação: ${(
      (reportData.coletasIdentificadas / reportData.totalColetas) *
      100
    ).toFixed(1)}%\n\n`;

    if (reportData.dataInicio && reportData.dataFim) {
      report += `Período de coletas: ${formatDate(
        reportData.dataInicio
      )} a ${formatDate(reportData.dataFim)}\n\n`;
    }

    // Estatísticas por família
    if (Object.keys(reportData.familiasCount).length > 0) {
      report += "COLETAS POR FAMÍLIA:\n";
      report += "-".repeat(30) + "\n";
      Object.entries(reportData.familiasCount)
        .sort(([, a], [, b]) => b - a)
        .forEach(([familia, count]) => {
          report += `${familia}: ${count} coleta(s)\n`;
        });
      report += "\n";
    }

    // Estatísticas por gênero
    if (Object.keys(reportData.generosCount).length > 0) {
      report += "COLETAS POR GÊNERO:\n";
      report += "-".repeat(30) + "\n";
      Object.entries(reportData.generosCount)
        .sort(([, a], [, b]) => b - a)
        .forEach(([genero, count]) => {
          report += `${genero}: ${count} coleta(s)\n`;
        });
      report += "\n";
    }

    // Estatísticas por espécie
    if (Object.keys(reportData.especiesCount).length > 0) {
      report += "COLETAS POR ESPÉCIE:\n";
      report += "-".repeat(30) + "\n";
      Object.entries(reportData.especiesCount)
        .sort(([, a], [, b]) => b - a)
        .forEach(([especie, count]) => {
          report += `${especie}: ${count} coleta(s)\n`;
        });
      report += "\n";
    }

    // Estatísticas por campo
    if (Object.keys(reportData.camposCount).length > 0) {
      report += "COLETAS POR CAMPO:\n";
      report += "-".repeat(30) + "\n";
      Object.entries(reportData.camposCount)
        .sort(([, a], [, b]) => b - a)
        .forEach(([campo, count]) => {
          report += `${campo}: ${count} coleta(s)\n`;
        });
      report += "\n";
    }

    // Lista detalhada de coletas (apenas no relatório completo)
    if (filtros.tipoRelatorio === "completo") {
      report += "=".repeat(50) + "\n";
      report += "LISTA DETALHADA DE COLETAS\n";
      report += "=".repeat(50) + "\n\n";

      reportData.coletas.forEach((coleta, index) => {
        report += `Coleta #${index + 1}\n`;
        report += `ID: ${coleta.id}\n`;
        report += `Nome: ${coleta.nome}\n`;
        report += `Data: ${formatDate(coleta.data_coleta)}\n`;
        report += `Status: ${
          coleta.identificada ? "Identificada" : "Não identificada"
        }\n`;

        if (coleta.nome_comum) {
          report += `Nome comum: ${coleta.nome_comum}\n`;
        }

        if (coleta.familia_id) {
          const familia = familias.find((f) => f.id === coleta.familia_id);
          report += `Família: ${familia ? familia.nome : "Não encontrada"}\n`;
        }

        if (coleta.genero_id) {
          const genero = generos.find((g) => g.id === coleta.genero_id);
          report += `Gênero: ${genero ? genero.nome : "Não encontrado"}\n`;
        }

        if (coleta.especie_id) {
          const especie = especies.find((e) => e.id === coleta.especie_id);
          report += `Espécie: ${especie ? especie.nome : "Não encontrada"}\n`;
        }

        if (coleta.campo_id) {
          const campo = campos.find((c) => c.id === coleta.campo_id);
          report += `Campo: ${campo ? campo.nome : "Não encontrado"}\n`;
        }

        if (coleta.observacoes) {
          report += `Observações: ${coleta.observacoes}\n`;
        }

        if (coleta.imagens && coleta.imagens.length > 0) {
          report += `Imagens: ${coleta.imagens.length} foto(s)\n`;
        }

        report += "\n" + "-".repeat(30) + "\n\n";
      });
    }

    return report;
  };

  const handleShare = async () => {
    try {
      const reportText = generateReportText();

      if (Platform.OS === "web") {
        // Para web, criar um blob e download
        const blob = new Blob([reportText], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `relatorio_coletas_${
          new Date().toISOString().split("T")[0]
        }.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // Para mobile, usar Share API
        await Share.share({
          message: reportText,
          title: "Relatório de Coletas Botânicas",
        });
      }
    } catch (error) {
      console.error("Erro ao compartilhar relatório:", error);
      Alert.alert("Erro", "Não foi possível compartilhar o relatório");
    }
  };

  const handlePrint = () => {
    Alert.alert(
      "Imprimir Relatório",
      "Para imprimir o relatório, use a opção de compartilhar e selecione 'Imprimir' ou salve como PDF.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Compartilhar", onPress: handleShare },
      ]
    );
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
          <Text style={styles.loadingText}>Gerando relatório...</Text>
        </View>
      </View>
    );
  }

  if (!reportData) {
    return (
      <View style={styles.container}>
        <HeaderInterno />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erro ao carregar relatório</Text>
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
        showsVerticalScrollIndicator={true}
      >
        <Text style={styles.pageTitle}>RELATÓRIO DE COLETAS</Text>

        {/* Informações do Relatório */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações do Relatório</Text>
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Data de geração:</Text>
              <Text style={styles.infoValue}>
                {new Date().toLocaleDateString("pt-BR")}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Tipo:</Text>
              <Text style={styles.infoValue}>
                {filtros.tipoRelatorio === "completo" ? "Completo" : "Resumido"}
              </Text>
            </View>
            {filtros.projeto && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Projeto:</Text>
                <Text style={styles.infoValue}>{filtros.projeto.nome}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Estatísticas Gerais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estatísticas Gerais</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{reportData.totalColetas}</Text>
              <Text style={styles.statLabel}>Total de Coletas</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {reportData.coletasIdentificadas}
              </Text>
              <Text style={styles.statLabel}>Identificadas</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {reportData.coletasNaoIdentificadas}
              </Text>
              <Text style={styles.statLabel}>Não Identificadas</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {(
                  (reportData.coletasIdentificadas / reportData.totalColetas) *
                  100
                ).toFixed(1)}
                %
              </Text>
              <Text style={styles.statLabel}>Taxa de Identificação</Text>
            </View>
          </View>
        </View>

        {/* Estatísticas por Família */}
        {Object.keys(reportData.familiasCount).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Coletas por Família</Text>
            <View style={styles.listContainer}>
              {Object.entries(reportData.familiasCount)
                .sort(([, a], [, b]) => b - a)
                .map(([familia, count], index) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.listItemText}>{familia}</Text>
                    <Text style={styles.listItemCount}>{count}</Text>
                  </View>
                ))}
            </View>
          </View>
        )}

        {/* Estatísticas por Gênero */}
        {Object.keys(reportData.generosCount).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Coletas por Gênero</Text>
            <View style={styles.listContainer}>
              {Object.entries(reportData.generosCount)
                .sort(([, a], [, b]) => b - a)
                .map(([genero, count], index) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.listItemText}>{genero}</Text>
                    <Text style={styles.listItemCount}>{count}</Text>
                  </View>
                ))}
            </View>
          </View>
        )}

        {/* Estatísticas por Espécie */}
        {Object.keys(reportData.especiesCount).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Coletas por Espécie</Text>
            <View style={styles.listContainer}>
              {Object.entries(reportData.especiesCount)
                .sort(([, a], [, b]) => b - a)
                .map(([especie, count], index) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.listItemText}>{especie}</Text>
                    <Text style={styles.listItemCount}>{count}</Text>
                  </View>
                ))}
            </View>
          </View>
        )}

        {/* Estatísticas por Campo */}
        {Object.keys(reportData.camposCount).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Coletas por Campo</Text>
            <View style={styles.listContainer}>
              {Object.entries(reportData.camposCount)
                .sort(([, a], [, b]) => b - a)
                .map(([campo, count], index) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.listItemText}>{campo}</Text>
                    <Text style={styles.listItemCount}>{count}</Text>
                  </View>
                ))}
            </View>
          </View>
        )}

        {/* Lista de Coletas (apenas no relatório completo) */}
        {filtros.tipoRelatorio === "completo" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lista de Coletas</Text>
            <View style={styles.coletasList}>
              {reportData.coletas.map((coleta, index) => (
                <View key={coleta.id} style={styles.coletaCard}>
                  <View style={styles.coletaHeader}>
                    <Text style={styles.coletaTitle}>Coleta #{index + 1}</Text>
                    <View
                      style={[
                        styles.coletaStatus,
                        {
                          backgroundColor: coleta.identificada
                            ? "#4caf50"
                            : "#ff9800",
                        },
                      ]}
                    >
                      <Text style={styles.coletaStatusText}>
                        {coleta.identificada
                          ? "Identificada"
                          : "Não identificada"}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.coletaInfo}>ID: {coleta.id}</Text>
                  <Text style={styles.coletaInfo}>Nome: {coleta.nome}</Text>
                  <Text style={styles.coletaInfo}>
                    Data: {formatDate(coleta.data_coleta)}
                  </Text>
                  {coleta.nome_comum && (
                    <Text style={styles.coletaInfo}>
                      Nome comum: {coleta.nome_comum}
                    </Text>
                  )}
                  {coleta.observacoes && (
                    <Text style={styles.coletaInfo}>
                      Observações: {coleta.observacoes}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}
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
          style={[styles.button, styles.printButton]}
          onPress={handlePrint}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>IMPRIMIR</Text>
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
    padding: 20,
    paddingBottom: 120,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#f44336",
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2e7d32",
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 15,
  },
  infoContainer: {
    backgroundColor: "#e8f5e9",
    borderRadius: 10,
    padding: 15,
  },
  infoItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e7d32",
    width: 120,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    width: "48%",
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },
  listContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 15,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  listItemText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  listItemCount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  coletasList: {
    gap: 15,
  },
  coletaCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 15,
  },
  coletaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  coletaTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  coletaStatus: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  coletaStatusText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
  },
  coletaInfo: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  shareButton: {
    backgroundColor: "#2196f3",
  },
  printButton: {
    backgroundColor: "#ff9800",
  },
  backButton: {
    backgroundColor: "#666",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default ReportView;
