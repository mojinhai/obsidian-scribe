import { SettingsInput } from './components/SettingsControl';
import { SettingsItemHeader } from './components/SettingsItem';
import useSettingsForm from './hooks/useSettingsForm';

/**
 * Tab, containing general settings
 */
function ProviderSettingsTab() {
  const { register, settings } = useSettingsForm();

  return (
    <div>
      <SettingsItemHeader name="API 密钥" />
      <SettingsInput
        {...register('openAiApiKey')}
        name="OpenAI API 密钥"
        description="您可以在OpenAI开发者控制台找到此密钥 - https://platform.openai.com/settings"
        placeholder="sk-..."
      />
      <SettingsInput
        {...register('assemblyAiApiKey')}
        name="AssemblyAI API 密钥"
        description="您可以在AssemblyAI开发者控制台找到此密钥 - https://www.assemblyai.com/app/account"
        placeholder="c3p0..."
      />
    </div>
  );
}

export default ProviderSettingsTab;
