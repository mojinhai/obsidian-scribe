import { useState } from 'react';
import type ScribePlugin from 'src';
import { LLM_MODELS } from 'src/util/openAiUtils';
import { TRANSCRIPT_PLATFORM } from '../settings';
import { SettingsItem } from './SettingsItem';

export const AiModelSettings: React.FC<{
  plugin: ScribePlugin;
  saveSettings: () => void;
}> = ({ plugin, saveSettings }) => {
  const [transcriptPlatform, setTranscriptPlatform] =
    useState<TRANSCRIPT_PLATFORM>(plugin.settings.transcriptPlatform);
  const [llmModel, setLlmModel] = useState<LLM_MODELS>(
    plugin.settings.llmModel,
  );
  const [isMultiSpeakerEnabled, setIsMultiSpeakerEnabled] = useState(
    plugin.settings.isMultiSpeakerEnabled,
  );
  const [isDisableLlmTranscription, setIsDisableLlmTranscription] = useState(
    plugin.settings.isDisableLlmTranscription,
  );
  const [useCustomOpenAiBaseUrl, setUseCustomOpenAiBaseUrl] = useState(
    plugin.settings.useCustomOpenAiBaseUrl,
  );
  const [customOpenAiBaseUrl, setCustomOpenAiBaseUrl] = useState(
    plugin.settings.customOpenAiBaseUrl,
  );
  const [customTranscriptModel, setCustomTranscriptModel] = useState(
    plugin.settings.customTranscriptModel,
  );
  const [customChatModel, setCustomChatModel] = useState(
    plugin.settings.customChatModel,
  );

  const handleToggleMultiSpeaker = () => {
    const value = !isMultiSpeakerEnabled;
    setIsMultiSpeakerEnabled(value);
    plugin.settings.isMultiSpeakerEnabled = value;
    saveSettings();
  };

  const handleToggleDisableLlmTranscription = () => {
    const value = !isDisableLlmTranscription;
    setIsDisableLlmTranscription(value);
    plugin.settings.isDisableLlmTranscription = value;
    saveSettings();
  };

  const handleToggleCustomOpenAiBaseUrl = () => {
    const value = !useCustomOpenAiBaseUrl;
    setUseCustomOpenAiBaseUrl(value);
    plugin.settings.useCustomOpenAiBaseUrl = value;
    saveSettings();
  };

  const handleCustomOpenAiBaseUrlChange = (value: string) => {
    setCustomOpenAiBaseUrl(value);
    plugin.settings.customOpenAiBaseUrl = value;
    saveSettings();
  };

  const handleCustomTranscriptModelChange = (value: string) => {
    setCustomTranscriptModel(value);
    plugin.settings.customTranscriptModel = value;
    saveSettings();
  };

  const handleCustomChatModelChange = (value: string) => {
    setCustomChatModel(value);
    plugin.settings.customChatModel = value;
    saveSettings();
  };

  return (
    <div>
      <h2>AI 模型选项</h2>
      <SettingsItem
        name="转录平台"
        description="您的录音将上传到此服务"
        control={
          <select
            defaultValue={transcriptPlatform}
            className="dropdown"
            onChange={(e) => {
              const value = e.target.value as TRANSCRIPT_PLATFORM;
              setTranscriptPlatform(value);
              plugin.settings.transcriptPlatform = value;
              saveSettings();
            }}
          >
            <option value={TRANSCRIPT_PLATFORM.openAi}>OpenAI</option>
            <option value={TRANSCRIPT_PLATFORM.assemblyAi}>AssemblyAI</option>
          </select>
        }
      />

      {transcriptPlatform === TRANSCRIPT_PLATFORM.assemblyAi && (
        <SettingsItem
          name="启用多说话人"
          description="如果您的录音中有多个说话人，请启用此选项"
          control={
            <div
              className={`checkbox-container ${isMultiSpeakerEnabled ? 'is-enabled' : ''}`}
              onClick={(e) => {
                handleToggleMultiSpeaker();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleToggleMultiSpeaker();
                }
              }}
            >
              <input
                type="checkbox"
                checked={isMultiSpeakerEnabled}
                onChange={handleToggleMultiSpeaker}
              />
            </div>
          }
        />
      )}

      <SettingsItem
        name="用于创建摘要的LLM模型"
        description="转录将发送到此服务"
        control={
          <select
            defaultValue={llmModel}
            className="dropdown"
            onChange={(e) => {
              const value = e.target.value as LLM_MODELS;
              setLlmModel(value);
              plugin.settings.llmModel = value;
              saveSettings();
            }}
          >
            {Object.keys(LLM_MODELS).map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        }
      />

      <h3>自定义OpenAI配置</h3>
      <SettingsItem
        name="使用自定义OpenAI基础URL"
        description="启用此选项以使用自定义的OpenAI兼容API端点（例如，本地LLM服务器、Azure OpenAI等）"
        control={
          <div
            className={`checkbox-container ${useCustomOpenAiBaseUrl ? 'is-enabled' : ''}`}
            onClick={(e) => {
              handleToggleCustomOpenAiBaseUrl();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleToggleCustomOpenAiBaseUrl();
              }
            }}
          >
            <input
              type="checkbox"
              checked={useCustomOpenAiBaseUrl}
              onChange={handleToggleCustomOpenAiBaseUrl}
            />
          </div>
        }
      />

      {useCustomOpenAiBaseUrl && (
        <>
          <SettingsItem
            name="自定义OpenAI基础URL"
            description="您的自定义OpenAI兼容API的基础URL（例如，http://localhost:1234/v1, https://your-instance.openai.azure.com/）"
            control={
              <input
                type="text"
                placeholder="http://localhost:1234/v1"
                value={customOpenAiBaseUrl}
                onChange={(e) =>
                  handleCustomOpenAiBaseUrlChange(e.target.value)
                }
                className="text-input"
              />
            }
          />

          <SettingsItem
            name="自定义转录模型"
            description="用于音频转录的模型名称（例如，whisper-1, faster-whisper等）"
            control={
              <input
                type="text"
                placeholder="whisper-1"
                value={customTranscriptModel}
                onChange={(e) =>
                  handleCustomTranscriptModelChange(e.target.value)
                }
                className="text-input"
              />
            }
          />

          <SettingsItem
            name="自定义聊天模型"
            description="用于聊天/摘要的模型名称（例如，gpt-4, llama-3.1-8b-instruct等）"
            control={
              <input
                type="text"
                placeholder="gpt-4o"
                value={customChatModel}
                onChange={(e) => handleCustomChatModelChange(e.target.value)}
                className="text-input"
              />
            }
          />
        </>
      )}
    </div>
  );
};
