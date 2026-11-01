
import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddRepositoryScreen({ navigation }) {

  const [ownerid, setOwnerid] = useState('');
  const [repoid, setRepoid] = useState('');
  const [carregando, setCarregando] = useState(false);

  const adicionarRepositorio = async () => {

    if (!ownerid.trim() || !repoid.trim()) {
      Alert.alert('Atenção', 'Preencha os dois campos!');
      return;
    }

    try {
      setCarregando(true);

      const respostaRepo = await axios.get(
        `https://api.github.com/repos/${ownerid.trim()}/${repoid.trim()}`
      );

      const respostaOwner = await axios.get(
        `https://api.github.com/users/${ownerid.trim()}`
      );

      const repositorio = {
        ...respostaRepo.data,

        owner: {
          ...respostaRepo.data.owner,
          followers: respostaOwner.data.followers,
          public_repos: respostaOwner.data.public_repos
        }
      };

      const dados = await AsyncStorage.getItem('@repositorios');

      const lista = dados ? JSON.parse(dados) : [];

      const existe = lista.some(
        item => item.full_name === repositorio.full_name
      );

      if (existe) {
        Alert.alert('Atenção', 'Esse repositório já foi adicionado!');
        return;
      }

      lista.push(repositorio);

      await AsyncStorage.setItem(
        '@repositorios',
        JSON.stringify(lista)
      );

      Alert.alert('Sucesso', 'Repositório adicionado!');

      navigation.goBack();

    } catch (error) {

      if (error.response?.status === 404) {
        Alert.alert(
          'Erro',
          'Repositório ou proprietário não encontrado.'
        );

      } else if (error.response?.status === 403) {
        Alert.alert(
          'Erro',
          'Limite de requisições da API do GitHub atingido.'
        );

      } else {
        Alert.alert(
          'Erro',
          'Não foi possível buscar o repositório.'
        );
      }

      console.log(error);

    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.label}>Owner ID:</Text>

      <TextInput
        style={styles.input}
        placeholder="Ex: facebook"
        value={ownerid}
        onChangeText={setOwnerid}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Repo ID:</Text>

      <TextInput
        style={styles.input}
        placeholder="Ex: react"
        value={repoid}
        onChangeText={setRepoid}
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={adicionarRepositorio}
        disabled={carregando}
      >
        {carregando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Adicionar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
        disabled={carregando}
      >
        <Text style={styles.buttonText}>Cancelar</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 15
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16
  },

  addButton: {
    backgroundColor: '#238636',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30
  },

  cancelButton: {
    backgroundColor: '#d73a49',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }

});
