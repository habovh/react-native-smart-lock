/**
 * Sample React Native App
 *
 * adapted from App.js generated by the following command:
 *
 * react-native init example
 *
 * https://github.com/facebook/react-native
 */

import React, {useState, useEffect, useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  Button,
  Text,
  Image,
  View,
} from 'react-native';
import SmartLock from '@gustash/react-native-smart-lock';

const App = () => {
  const [account, setAccount] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const _onLogin = useCallback(async () => {
    const credentials = {
      id: username,
      profilePictureUri:
        'https://api.adorable.io/avatars/285/abott@adorable.png',
      name: 'John Doe',
      password,
    };

    const error = await SmartLock.save(credentials);

    // The save method might be canceled if the system wants to give priority
    // to the password manager UI instead.
    if (error && error !== 'canceled') {
      console.error(error);
    }

    setUsername('');
    setPassword('');
    setAccount(credentials);
  }, [username, password]);

  const _onLogout = useCallback(() => {
    setAccount(null);
    SmartLock.disableAutoSignIn();
  }, []);

  const _onDelete = useCallback(async () => {
    const error = await SmartLock.delete(account.id);

    if (error) {
      console.error(error);
      return;
    }

    _onLogout();
  }, [account, _onLogout]);

  useEffect(() => {
    const request = async () => {
      const {error, success, ...credentials} = await SmartLock.request();

      if (error) {
        console.error(error);
        return;
      }

      if (success) {
        // Account found
        setAccount(credentials);
      }
    };

    request();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {account ? (
        <View style={styles.profile}>
          <Image
            source={{uri: account.profilePictureUri}}
            style={[styles.image, styles.spacing]}
          />
          <Text style={styles.spacing}>Logged in as: {account.name}</Text>
          <View style={styles.spacing}>
            <Button title="Delete Credentials" onPress={_onDelete} />
          </View>
          <View style={styles.spacing}>
            <Button title="Logout" onPress={_onLogout} />
          </View>
        </View>
      ) : (
        <>
          <TextInput
            underlineColorAndroid="lightblue"
            placeholder="Username"
            onChangeText={setUsername}
            value={username}
            style={styles.spacing}
          />
          <TextInput
            underlineColorAndroid="lightblue"
            placeholder="Password"
            onChangeText={setPassword}
            value={password}
            style={styles.spacing}
          />
          <View style={styles.spacing}>
            <Button title="Login" onPress={_onLogin} />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profile: {
    alignItems: 'center',
  },
  spacing: {
    marginTop: 20,
  },
  image: {
    width: 285 / 2,
    height: 285 / 2,
    borderRadius: 285 / 4,
  },
});

export default App;
