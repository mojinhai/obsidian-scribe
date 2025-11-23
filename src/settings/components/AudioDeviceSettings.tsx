import { useEffect, useState } from 'react';
import useSettingsForm from '../hooks/useSettingsForm';
import { SettingsSelect } from './SettingsControl';

interface AudioDevice {
  deviceId: string;
  label: string;
}

/**
 * Settings input for selecting audio devices
 */
function AudioDeviceSettings() {
  const { register } = useSettingsForm();
  const [isLoading, setIsLoading] = useState(true);
  const [audioDevices, setAudioDevices] = useState<AudioDevice[]>([]);

  const valuesMapping = audioDevices.map((device) => ({
    displayName: device.label,
    value: device.deviceId,
  }));

  useEffect(() => {
    const getAudioDevices = async () => {
      try {
        // Request permission to access media devices
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        stream.getTracks().forEach((track) => track.stop());

        // Get list of audio input devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputDevices = devices
          .filter((device) => device.kind === 'audioinput')
          .map((device) => ({
            deviceId: device.deviceId,
            label:
              device.label || `麦克风 (${device.deviceId.slice(0, 8)}...)`,
          }));

        setAudioDevices(audioInputDevices);
      } catch (error) {
        console.error('Error getting audio devices:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getAudioDevices();
  }, []);

  return isLoading ? (
    <div>正在加载设备...</div>
  ) : (
    <SettingsSelect
      {...register('selectedAudioDeviceId')}
      name="音频输入设备"
      description="选择用于录音的麦克风"
      valuesMapping={valuesMapping}
    />
  );
}

export default AudioDeviceSettings;
