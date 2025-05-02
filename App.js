// App 1 - Mood Mirror 

import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, Modal, TouchableOpacity, StyleSheet, ScrollView, ImageBackground } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function App() {
  const [mood, setMood] = useState(null)
  const [modalOn, setModalOn] = useState(false)
  const [notes, setNotes] = useState('')
  const [username, setUsername] = useState('')
  const [tempName, setTempName] = useState('')

  // basic emoji + mood matching
  const emojiBank = ['😊', '😢', '😡', '😌']
  const moodBank = ['happy', 'sad', 'mad', 'chill']

  const msgByMood = {
    happy: ['solid mood 😎', 'vibes are high today'],
    sad: ['you’re not alone', 'hang in there'],
    mad: ['go for a walk', 'yell into a pillow '],
    chill: ['nice and breezy', 'float through the day']
  }

  const pickMsg = (m) => {
    let choices = msgByMood[m]
    if (!choices) return 'idk what to say'
    return choices[Math.floor(Math.random() * choices.length)]
  }

  const showMood = (i) => {
    setMood(moodBank[i])
    setModalOn(true)
  }

  const saveName = async (txt) => {
    try {
      await AsyncStorage.setItem('user', txt)
      setUsername(txt)
    } catch (err) {
      console.log('save error', err)
    }
  }

  const getName = async () => {
    try {
      let found = await AsyncStorage.getItem('user')
      if (found) setUsername(found)
    } catch (err) {
      console.log('get name fail', err)
    }
  }

  useEffect(() => {
    getName()
  }, [])

  return (
    <ImageBackground source={require('./assets/Background image app1.jpg')} style={styles.bg}>
      <ScrollView contentContainerStyle={styles.center}>
        <View style={styles.container}>
          <Text style={styles.title}>Mood Mirror</Text>

          <Text style={styles.prompt}>how are you feeling{username ? `, ${username}` : ''}?</Text>

          <View style={styles.emojiRow}>
            {emojiBank.map((em, i) => (
              <TouchableOpacity key={i} style={styles.emoBubble} onPress={() => showMood(i)}>
                <Text style={styles.emoji}>{em}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.prompt}>how should i call you?</Text>
          <TextInput
            placeholder='type ur name...'
            value={tempName}
            onChangeText={setTempName}
            style={styles.inputField}
          />

          <TouchableOpacity style={styles.saveBtn} onPress={() => saveName(tempName)}>
            <Text style={styles.saveText}>save</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={modalOn} transparent animationType='slide'>
          <View style={styles.modalBg}>
            <View style={styles.modalBox}>
              <Text style={styles.modalMsg}>{pickMsg(mood)}</Text>
              <TextInput
                style={styles.noteInput}
                placeholder='drop a thought if u want'
                value={notes}
                onChangeText={setNotes}
                multiline
              />
              <TouchableOpacity onPress={() => setModalOn(false)} style={styles.closeBtn}>
                <Text style={{ color: '#fff' }}>done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  center: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  container: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    padding: 20,
    maxWidth: 360,
    width: '100%'
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12
  },
  prompt: {
    fontSize: 16,
    marginBottom: 8
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16
  },
  emoBubble: {
    backgroundColor: 'rgba(200,235,230,0.75)',
    borderRadius: 10,
    padding: 10
  },
  emoji: {
    fontSize: 24
  },
  inputField: {
    backgroundColor: '#fff',
    borderColor: '#aaa',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10
  },
  saveBtn: {
    backgroundColor: '#45756f',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center'
  },
  saveText: {
    color: 'white',
    fontWeight: '500'
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 14,
    width: '85%'
  },
  modalMsg: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333'
  },
  noteInput: {
    borderColor: '#bbb',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    minHeight: 70,
    textAlignVertical: 'top',
    marginBottom: 12
  },
  closeBtn: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center'
  }
})
