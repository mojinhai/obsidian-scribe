import { useEffect } from 'react';
import type { ScribeOptions } from 'src';
import type ScribePlugin from 'src';
import { TRANSCRIPT_PLATFORM } from 'src/settings/settings';
import type { ScribeModelOptions } from '../ModalOptionsContainer';
import { SettingsItem } from 'src/settings/components/SettingsItem';
import {
  LanguageDisplayNames,
  LanguageOptions,
  type OutputLanguageOptions,
} from 'src/util/consts';
import { ButtonComponent } from 'obsidian';
import type { ScribeTemplate } from 'src/settings/components/NoteTemplateSettings';

export function ModalRecordingOptions({
  options,
  setOptions,
  noteTemplates,
}: {
  options: ScribeOptions;
  setOptions: React.Dispatch<ScribeOptions>;
  noteTemplates: ScribeTemplate[];
}) {
  const handleOptionsChange = (updatedOptions: Partial<ScribeOptions>) => {
    setOptions({
      ...options,
      ...updatedOptions,
    });
  };

  const {
    isAppendToActiveFile,
    isOnlyTranscribeActive,
    isSaveAudioFileActive,
    isMultiSpeakerEnabled,
    transcriptPlatform,
    activeNoteTemplate,
  } = options;

  return (
    <div className="scribe-recording-options">
      <label>
        <input
          type="checkbox"
          checked={isAppendToActiveFile}
          onChange={(event) => {
            handleOptionsChange({
              isAppendToActiveFile: event.target.checked,
            });
          }}
        />
        追加到活动文件
      </label>

      <label>
        <input
          type="checkbox"
          checked={isOnlyTranscribeActive}
          onChange={(event) => {
            handleOptionsChange({
              isOnlyTranscribeActive: event.target.checked,
            });
          }}
        />
        仅转录录音
      </label>
      <label>
        <input
          type="checkbox"
          checked={isSaveAudioFileActive}
          onChange={(event) => {
            handleOptionsChange({
              isSaveAudioFileActive: event.target.checked,
            });
          }}
        />
        保存音频文件
      </label>

      {transcriptPlatform === TRANSCRIPT_PLATFORM.assemblyAi && (
        <label>
          <input
            type="checkbox"
            checked={isMultiSpeakerEnabled}
            onChange={(event) => {
              handleOptionsChange({
                isMultiSpeakerEnabled: event.target.checked,
              });
            }}
          />
          启用多说话人
        </label>
      )}

      <SettingsItem
        name="活动模板"
        description=""
        control={
          <select
            defaultValue={activeNoteTemplate.name}
            className="dropdown"
            onChange={(e) => {
              const selectedTemplate = noteTemplates.find(
                (template) => template.name === e.target.value,
              );
              handleOptionsChange({
                activeNoteTemplate: selectedTemplate,
              });
            }}
          >
            {noteTemplates.map((template) => (
              <option key={template.name} value={template.name}>
                {template.name}
              </option>
            ))}
          </select>
        }
      />
    </div>
  );
}
