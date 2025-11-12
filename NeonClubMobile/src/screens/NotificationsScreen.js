import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { notificationsAPI } from '../services/api';
import { COLOR_SCHEME } from '../utils/colors';

const Item = ({ item }) => (
  <View style={styles.item}> 
    <View style={styles.iconCircle}><Text style={{ color:'#fff' }}>{item.type==='warning'?'!':'🔔'}</Text></View>
    <View style={{ flex: 1 }}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemBody} numberOfLines={2}>{item.body}</Text>
      <Text style={styles.itemTime}>{new Date(item.createdAt || Date.now()).toLocaleString()}</Text>
    </View>
  </View>
);

const NotificationsScreen = ({ navigation, route }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await notificationsAPI.list();
        setItems(Array.isArray(res?.data) ? res.data : []);
      } catch {}
    })();
  }, []);

  return (
    <View style={{ flex:1, backgroundColor:'#fff' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => (navigation.canGoBack()? navigation.goBack() : navigation.navigate('Main'))} style={{ padding: 8 }}><Text style={{ fontSize: 18 }}>‹</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
      <FlatList
        data={items}
        keyExtractor={(item, idx) => item._id || String(idx)}
        renderItem={({ item }) => <Item item={item} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection:'row', alignItems:'center', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor:'#E5E7EB', paddingHorizontal: 12, paddingVertical: 12 },
  headerTitle: { fontWeight:'700', fontSize: 18, marginLeft: 6 },
  item: { flexDirection:'row', gap: 12, backgroundColor:'#fff', borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: StyleSheet.hairlineWidth, borderColor:'#E5E7EB' },
  iconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLOR_SCHEME.primaryPurple, alignItems:'center', justifyContent:'center' },
  itemTitle: { fontWeight:'700', color: COLOR_SCHEME.textPrimary },
  itemBody: { color: COLOR_SCHEME.textSecondary, marginTop: 2 },
  itemTime: { color:'#94A3B8', marginTop: 6, fontSize: 12 },
});

export default NotificationsScreen;
