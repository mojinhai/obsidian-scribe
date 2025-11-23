import { useState } from 'react';
import { ModalRecordingOptions } from './options/ModalRecordingOptions';
import { ModalAiModelOptions } from './options/ModalAiModelOptions';

import type ScribePlugin from 'src';
import type { ScribeOptions } from 'src';
import type { LLM_MODELS } from 'src/util/openAiUtils';
import type { TRANSCRIPT_PLATFORM } from 'src/settings/settings';
import { ModalLanguageOptions } from './options/ModalLanguageOptions';

export interface ScribeModelOptions {
  llmModel: LLM_MODELS;
  transcriptPlatform: TRANSCRIPT_PLATFORM;
}

export function ModalOptionsContainer({
  plugin,
  options,
  setOptions,
}: {
  plugin: ScribePlugin;
  options: ScribeOptions;
  setOptions: React.Dispatch<ScribeOptions>;
}) {
  const [isModelOptionsExpanded, setIsModalOptionsExpanded] = useState(false);
  const [isLanguageOptionsExpanded, setIsLanguageOptionsExpanded] =
    useState(false);

  return (
    <div>
      <p>会话设置</p>
      <div className="scribe-options-container">
        <ModalRecordingOptions
          options={options}
          setOptions={setOptions}
          noteTemplates={plugin.settings.noteTemplates}
        />
      </div>

      <button
        onClick={() => setIsLanguageOptionsExpanded(!isLanguageOptionsExpanded)}
        type="button"
        className="scribe-settings-btn"
      >
        语言选项
      </button>

      <button
        onClick={() => setIsModalOptionsExpanded(!isModelOptionsExpanded)}
        type="button"
        className="scribe-settings-btn"
      >
        模型选项
      </button>
      {isLanguageOptionsExpanded && (
        <>
          <h5>语言选项</h5>
          <ModalLanguageOptions options={options} setOptions={setOptions} />
        </>
      )}
      {isModelOptionsExpanded && (
        <>
          <h5>AI 模型选项</h5>
          <ModalAiModelOptions options={options} setOptions={setOptions} />
        </>
      )}
    </div>
  );
}
