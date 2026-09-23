import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { colors } from '../../theme/colors';
import { useShopContext } from '../../context/ShopContext';
import { Shop } from '../../types';
import { Camera, ImagePlus, Trash2 } from 'lucide-react-native';

import * as ImagePicker from 'expo-image-picker';

interface AddShopScreenProps {
  onSuccess: () => void;
  shopToEdit?: Shop | null;
}

export const AddShopScreen: React.FC<AddShopScreenProps> = ({ onSuccess, shopToEdit }) => {
  const { addNewShop, updateShop } = useShopContext();

  const isEditMode = !!shopToEdit;

  const [shopNumber, setShopNumber] = useState<string>(shopToEdit?.shopNumber || '');
  const [name, setName] = useState<string>(shopToEdit?.shopName || shopToEdit?.name || '');
  const [mobile, setMobile] = useState<string>(shopToEdit?.mobile || '');
  const [address, setAddress] = useState<string>(shopToEdit?.address || '');
  const [city, setCity] = useState<string>(shopToEdit?.city || '');
  const [pincode, setPincode] = useState<string>(shopToEdit?.pincode || '');
  const [photoUrl, setPhotoUrl] = useState<string>(shopToEdit?.photoUrl || '');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (shopToEdit) {
      setShopNumber(shopToEdit.shopNumber || '');
      setName(shopToEdit.shopName || shopToEdit.name || '');
      setMobile(shopToEdit.mobile || '');
      setAddress(shopToEdit.address || '');
      setCity(shopToEdit.city || '');
      setPincode(shopToEdit.pincode || '');
      if (shopToEdit.photoUrl) setPhotoUrl(shopToEdit.photoUrl);
    }
  }, [shopToEdit]);

  const takePhotoWithCamera = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Camera permission is required to take a shop photo.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [9, 16],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUrl(result.assets[0].uri);
      }
    } catch (e) {
      console.log('Error launching camera', e);
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Photo library permission is required to choose a photo.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [9, 16],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUrl(result.assets[0].uri);
      }
    } catch (e) {
      console.log('Error picking image from gallery', e);
    }
  };

  const handleUploadPhoto = () => {
    Alert.alert(
      'Upload Shop Photo 📸',
      'Choose an option to upload shop storefront photo',
      [
        { text: 'Take Photo (Camera 📷)', onPress: takePhotoWithCamera },
        { text: 'Choose from Gallery 🖼️', onPress: pickImageFromGallery },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleRemovePhoto = () => {
    setPhotoUrl('');
  };

  const handleSave = async () => {
    const errs: { [key: string]: string } = {};

    if (!name.trim()) errs.name = 'Shop Name is required';
    if (!mobile.trim() || mobile.length !== 10) errs.mobile = 'Valid 10-digit mobile required';
    if (!address.trim()) errs.address = 'Shop Address is required';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    let result = null;

    if (isEditMode && shopToEdit) {
      result = await updateShop(shopToEdit.id, {
        shopNumber: shopNumber || shopToEdit.shopNumber,
        shopName: name,
        name,
        mobile,
        address,
        city: city || 'Bhimavaram',
        pincode: pincode || '534201',
        photoUrl,
      });
    } else {
      result = await addNewShop({
        shopNumber: shopNumber || `SHOP-AP-${Math.floor(1000 + Math.random() * 9000)}`,
        shopName: name,
        name,
        mobile,
        address,
        city: city || 'Bhimavaram',
        pincode: pincode || '534201',
        photoUrl,
      });
    }

    setLoading(false);

    if (result) {
      onSuccess();
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.screenTitle}>{isEditMode ? 'Edit Shop Details' : 'Add New Shop'}</Text>
      <Text style={styles.screenSub}>
        {isEditMode ? 'Update location, shop photo, and address details.' : 'Enter shop details & upload photo for wholesale chicken delivery.'}
      </Text>

      {/* Shop Photo Upload Box */}
      <Text style={styles.photoLabel}>Shop Photo 📸</Text>
      {photoUrl ? (
        <View style={styles.photoPreviewContainer}>
          <Image source={{ uri: photoUrl }} style={styles.photoPreviewImage} />
          <View style={styles.photoActions}>
            <TouchableOpacity style={styles.changePhotoBtn} onPress={handleUploadPhoto} activeOpacity={0.8}>
              <Camera size={14} color={colors.primary} style={{ marginRight: 4 }} />
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.removePhotoBtn} onPress={handleRemovePhoto} activeOpacity={0.8}>
              <Trash2 size={14} color="#DC2626" style={{ marginRight: 4 }} />
              <Text style={styles.removePhotoText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity style={styles.uploadCard} activeOpacity={0.8} onPress={handleUploadPhoto}>
          <View style={styles.uploadIconCircle}>
            <ImagePlus size={24} color={colors.primary} />
          </View>
          <Text style={styles.uploadTitle}>Upload Shop Front Photo</Text>
          <Text style={styles.uploadSub}>Tap to select image from camera or gallery (PNG, JPG)</Text>
        </TouchableOpacity>
      )}

      {/* Form Fields */}
      <View style={styles.formGroup}>
        <Input
          label="Shop Number / Code"
          placeholder="e.g. SHOP-AP-2002"
          value={shopNumber}
          onChangeText={setShopNumber}
        />

        <Input
          label="Shop Name *"
          placeholder="e.g. Bhimavaram Main Shop"
          value={name}
          onChangeText={(v) => {
            setName(v);
            if (errors.name) setErrors(e => ({ ...e, name: '' }));
          }}
          error={errors.name}
        />

        <Input
          label="Shop Mobile *"
          prefix="+91"
          placeholder="e.g. 9811223344"
          keyboardType="phone-pad"
          maxLength={10}
          value={mobile}
          onChangeText={(v) => {
            setMobile(v);
            if (errors.mobile) setErrors(e => ({ ...e, mobile: '' }));
          }}
          error={errors.mobile}
        />

        <Input
          label="Shop Address *"
          placeholder="e.g. Station Road, Bhimavaram"
          value={address}
          onChangeText={(v) => {
            setAddress(v);
            if (errors.address) setErrors(e => ({ ...e, address: '' }));
          }}
          error={errors.address}
        />
      </View>

      <Button
        title={isEditMode ? 'Update Shop Details' : 'Save Shop Location'}
        variant="primary"
        size="lg"
        loading={loading}
        onPress={handleSave}
        style={styles.saveBtn}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.gray900,
  },
  screenSub: {
    fontSize: 13,
    color: colors.gray500,
    marginTop: 2,
    marginBottom: 16,
  },
  photoLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.gray800,
    marginBottom: 8,
  },
  uploadCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF7F3',
    borderWidth: 1.5,
    borderColor: '#FFD6C6',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  uploadIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  uploadTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  uploadSub: {
    fontSize: 12,
    color: colors.gray500,
    marginTop: 4,
    textAlign: 'center',
  },
  photoPreviewContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.gray200,
    padding: 10,
    marginBottom: 16,
    alignItems: 'center',
  },
  photoPreviewImage: {
    width: '100%',
    height: 280,
    aspectRatio: 9 / 16,
    borderRadius: 14,
    resizeMode: 'cover',
  },
  photoActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
    paddingHorizontal: 4,
  },
  changePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  changePhotoText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  removePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  removePhotoText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  formGroup: {
    marginBottom: 10,
  },
  saveBtn: {
    marginTop: 10,
    marginBottom: 20,
  },
});
