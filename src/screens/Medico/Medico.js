// src/screens/Medico/Op1Screen.js (Reescrito)
import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  SectionList, 
  TouchableOpacity, 
  Platform,
  LayoutAnimation,
  UIManager,
  Button,
  Image
} from 'react-native';

const API_URL = "http://10.110.12.15:8080/medicos";

// Ícones (você precisará ter esses arquivos PNG ou usar uma biblioteca de ícones)
// Assumindo que você tem um ícone de lupa e um triângulo/seta
const IconeLupa = require('../../../assets/lupa.png'); // Exemplo
const IconeSeta = require('../../../assets/seta.png'); // Exemplo

// Habilita LayoutAnimation para Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// =========================================================================
// FUNÇÃO AUXILIAR PARA AGRUPAR E FILTRAR OS DADOS
// =========================================================================
const groupAndFilterMedicos = (medicos, searchText) => {
  const filteredMedicos = medicos.filter(medico => 
    medico.nome.toLowerCase().includes(searchText.toLowerCase()) || 
    medico.especialidade.toLowerCase().includes(searchText.toLowerCase())
  );

  const grouped = filteredMedicos.reduce((acc, medico) => {
    const firstLetter = medico.nome[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(medico);
    return acc;
  }, {});

  // Converte o objeto agrupado para o formato do SectionList
  const sections = Object.keys(grouped)
    .sort() // Garante a ordem alfabética das seções
    .map(letter => ({
      title: letter,
      data: grouped[letter],
    }));

  return sections;
};

// =========================================================================
// COMPONENTE CARD EXPANSÍVEL
// =========================================================================
const MedicoCard = ({ medico, navigation }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    // Anima a mudança de layout
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={cardStyles.card}>
      {/* SEÇÃO PRINCIPAL VISÍVEL */}
      <TouchableOpacity onPress={toggleExpand} style={cardStyles.mainInfo}>
        <View>
          <Text style={cardStyles.nome}>{medico.nome}</Text>
          <Text style={cardStyles.especialidade}>{medico.especialidade} | CRM: {medico.crm}</Text>
        </View>
        
        {/* Ícone triangular para expandir/colapsar */}
        <Image
          source={IconeSeta}
          style={[
            cardStyles.arrowIcon,
            { transform: [{ rotate: isExpanded ? '90deg' : '0deg' }] },
          ]}
        />
      </TouchableOpacity>

      {/* SEÇÃO EXPANSÍVEL (Detalhes) */}
      {isExpanded && (
        <View style={cardStyles.details}>
          <Text style={cardStyles.detailText}>Email: {medico.email}</Text>
          <Text style={cardStyles.detailText}>Telefone: {medico.telefone}</Text>
          <Text style={cardStyles.detailText}>Endereço: {medico.endereco}</Text>
          
          <View style={cardStyles.actionButtons}>
            <Button
              title="Editar"
              onPress={() => navigation.navigate('EmConstrucao')} // Deveria ser uma tela de edição
            />
            <Button
              title="Desativar Perfil"
              color="red"
              onPress={() => navigation.navigate('EmConstrucao')} 
            />
          </View>
        </View>
      )}
    </View>
  );
};

// =========================================================================
// TELA PRINCIPAL
// =========================================================================
const Op1Screen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [medicos, setMedicos] = useState([]);

  // 🔥 CHAMA A API QUANDO A TELA CARREGA
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setMedicos(data.content))  // sua API usa Page<>
      .catch(err => console.log("Erro ao buscar médicos:", err));
  }, []);

  const sections = useMemo(
    () => groupAndFilterMedicos(medicos, searchText),
    [medicos, searchText]
  );

  return (
    <View style={styles.container}>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar Médico ou Especialidade"
          value={searchText}
          onChangeText={setSearchText}
        />
        <Image source={IconeLupa} style={styles.searchIcon} />
      </View>

      <View style={styles.listWrapper}>
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <MedicoCard medico={item} navigation={navigation} />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
        />
      </View>

      <View style={styles.fixedButtonContainer}>
        <Button
          title="Cadastrar Novo Perfil"
          onPress={() => navigation.navigate('EmConstrucao')}
        />
      </View>
    </View>
  );
};

export default Op1Screen;