import React from 'react';
import { Modal, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import GlobalStyle from '../../uitility/GlobalStyle';
import { images } from '../../uitility/image';
import { AppColors } from '../../uitility/color';

interface ConfirmDialogProps {
  visible: boolean;
  onClose: () => void;
  user: {
    name: string;
    punch: string;
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
        <Ionicons style={{alignSelf:"flex-end",padding:8}} name="close" size={15} onPress={onClose}/>
          <Image source={user.image} style={[styles.avatar,{borderColor:user.punch=="Punch IN"?"#05DF72":"#FF0000"}]} />
          <View style={styles.iconRow}>
 <Image source={images.check} style={[styles.avatar,{height:20,width:20}]} />
             <Text style={styles.confirmText}>{user.punch} confirmed</Text>
          </View>
<View style={[styles.card,{borderColor:user.punch=="Punch IN"?"#05DF72":"#FF0000"}]}>
      <Text style={[GlobalStyle.bold_white,styles.welcomeText]}>Welcome, {user.name}!</Text>
      <Text style={[GlobalStyle.regular_Font,styles.subText]}>
        ID: {user.id}
      </Text>
      <Text style={[GlobalStyle.semibold_black,styles.punchText]}>
        {user.punch=="Punch IN"?"  Punch in :":"  Punch out :"}
       <Text style={styles.time}>{user.punchTime}</Text></Text>
    </View>      
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
   card: {
    backgroundColor: '#ffff',
    borderWidth: 2,
    borderColor: '#E2A3FA',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    marginTop:10
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  subText: {
    fontSize: 14,
    color:AppColors.black,
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
    width: 150,
    height: 150,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#05DF72',
    marginBottom: 10,
    marginTop:10
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
    borderRadius: 18,
    backgroundColor: AppColors.secondary,
    borderWidth:1,
    borderColor:AppColors.gradient
  },
  closeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});

export default ConfirmDialog;
