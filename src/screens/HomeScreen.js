
import React, { useState, useCallback, useLayoutEffect } from 'react';

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {

  const [repositorios, setRepositorios] = useState([]);

  const carregarRepositorios = async () => {
    try {
      const dados = await AsyncStorage.getItem('@repositorios');

      if (dados !== null) {
        setRepositorios(JSON.parse(dados));
      } else {
        setRepositorios([]);
      }

    } catch (error) {
      console.log('Erro ao carregar:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarRepositorios();
    }, [])
  );

  const limparDados = async () => {
    Alert.alert(
      'Limpar repositórios',
      'Deseja realmente excluir todos os repositórios salvos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('@repositorios');
            setRepositorios([]);
          }
        }
      ]
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>

          <TouchableOpacity
            onPress={() => navigation.navigate('Adicionar')}
            style={styles.headerButton}
          >
            <Text style={styles.headerText}>+</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={limparDados}
            style={styles.headerButton}
          >
            <Text style={styles.headerText}>-</Text>
          </TouchableOpacity>

        </View>
      )
    });
  }, [navigation, repositorios]);

  const renderRepositorio = ({ item }) => (
    <View style={styles.card}>

      <Text style={styles.title}>
        {item.name}
      </Text>

      <Text style={styles.description}>
        {item.description || 'Sem descrição'}
      </Text>

      <Text style={styles.section}>
        Repositório
      </Text>

      <Text>Estrelas: {item.stargazers_count}</Text>
      <Text>Forks: {item.forks_count}</Text>

      <View style={styles.divider} />

      <Text style={styles.section}>
        Proprietário: {item.owner.login}
      </Text>

      <Text>Seguidores: {item.owner.followers}</Text>
      <Text>Repositórios públicos: {item.owner.public_repos}</Text>

    </View>
  );

  return (
    <View style={styles.container}>

      <FlatList
        data={repositorios}
        keyExtractor={(item) => item.full_name}
        renderItem={renderRepositorio}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Nenhum repositório cadastrado.
          </Text>
        }
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 12
  },

  headerButtons: {
    flexDirection: 'row',
    gap: 20,
    marginRight: 10
  },

  headerButton: {
    paddingHorizontal: 5
  },

  headerText: {
    fontSize: 28,
    color: '#0969da'
  },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0969da'
  },

  description: {
    marginVertical: 8,
    color: '#555'
  },

  section: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 8,
    marginBottom: 5
  },

  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10
  },

  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#777'
  }
});
