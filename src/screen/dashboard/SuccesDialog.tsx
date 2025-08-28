import React from 'react';
import { Modal, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import GlobalStyle from '../../uitility/GlobalStyle';

interface ConfirmDialogProps {
  visible: boolean;
  onClose: () => void;
  user: {
    name: string;
    role: string;
    id: string;
    punchTime: string;
    image: any;
  };
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ visible, onClose, user }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Profile Image */}
          <Image source={user.image} style={styles.avatar} />

          {/* Confirm Icon */}
          <View style={styles.iconRow}>
            <Ionicons name="checkmark-circle" size={22} color="green" />
            <Text style={styles.confirmText}>Punch-in confirmed</Text>
          </View>

          {/* Welcome Message */}
          {/* <Text style={styles.welcomeText}>Welcome, {user.name}!</Text>
          <Text style={styles.subText}>
            {user.role} • ID: {user.id}
          </Text> */}

          {/* Punch-in Time */}
          {/* <View style={styles.timeBox}>
            <Text style={styles.timeText}>Punch in : {user.punchTime}</Text>
          </View> */}
<View style={styles.card}>
      <Text style={[GlobalStyle.regular_Font,styles.welcomeText]}>Welcome, {user.name}!</Text>
      <Text style={[GlobalStyle.regular_Font,styles.subText]}>
        {user.role}• ID: {user.id}
      </Text>
      <Text style={[GlobalStyle.semibold_black,styles.punchText]}>Punch in : <Text style={styles.time}>{user.punchTime}</Text></Text>
    </View>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
          
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
   card: {
    backgroundColor: '#FCF4FF',
    borderWidth: 2,
    borderColor: '#E2A3FA',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  subText: {
    fontSize: 14,
    color: '#5D5C5C',
    marginBottom: 6,
  },
  punchText: {
    fontSize: 14,
    color: '#FE7B01',
    fontWeight: '500',
  },
  time: {
    color: '#FE7B01',
    fontWeight: '700',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // card: {
  //   backgroundColor: '#fff',
  //   width: '80%',
  //   borderRadius: 12,
  //   padding: 16,
  //   alignItems: 'center',
  // },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#4CAF50',
    marginBottom: 10,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },

  timeBox: {
    backgroundColor: '#f8e9ff',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#d43f8d',
  },
  closeButton: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  closeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});

export default ConfirmDialog;
