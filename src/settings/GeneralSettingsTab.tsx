import { LanguageDisplayNames, LanguageOptions } from 'src/util/consts';
import { formatFilenamePrefix } from 'src/util/filenameUtils';
import AudioDeviceSettings from './components/AudioDeviceSettings';
import DirectorySelect from './components/DirectorySelect';
import {
  SettingsInput,
  SettingsSelect,
  SettingsToggle,
} from './components/SettingsControl';
import { SettingsItemHeader } from './components/SettingsItem';
import useSettingsForm from './hooks/useSettingsForm';

const languagesMapping = Object.entries(LanguageDisplayNames)
  .filter(([value]) => value !== LanguageOptions.auto)
  .map(([value, displayName]) => ({ displayName, value }));

/**
 * Tab, containing general settings
 */
function GeneralSettingsTab() {
  const { register, settings } = useSettingsForm();

  const isDateInPrefix =
    (settings.noteFilenamePrefix || '').includes('{{date}}') ||
    (settings.recordingFilenamePrefix || '').includes('{{date}}');

  return (
    <div>
      <SettingsItemHeader name="音频" />
      <AudioDeviceSettings />
      <SettingsItemHeader name="AI 处理" />
      <SettingsToggle
        {...register('isDisableLlmTranscription', {
          // Inverted displayed value because initial semantics was misleading
          // Old: negative meaning (disable) => Truthy toggle state
          // New: positive meaning (enable) => Truthy toggle state
          displayValue: (value) => !value,
          setValueAs: (value) => !value,
        })}
        name="转录录音"
        description="如果禁用，音频将不会发送到任何LLM进行转录"
      />
      <SettingsToggle
        {...register('isOnlyTranscribeActive', {
          // Inverted displayed value because initial semantics was misleading
          // Old: negative meaning (disable) => Truthy toggle state
          // New: positive meaning (enable) => Truthy toggle state
          displayValue: (value) => !value,
          setValueAs: (value) => !value,
        })}
        name="使用LLM处理转录"
        description="如果禁用，我们将只转录录音而不进行摘要、洞察等。"
      />

      <SettingsItemHeader name="语言" />
      <SettingsSelect
        {...register('scribeOutputLanguage')}
        name="Scribe 输出语言"
        description="Scribe 生成的笔记所使用的语言"
        valuesMapping={languagesMapping}
      />
      <SettingsSelect
        {...register('audioFileLanguage')}
        name="口语语言"
        description="音频转录的默认口语语言，从自动更改可能会提高准确性"
        valuesMapping={languagesMapping}
      />

      <SettingsItemHeader name="转录" />
      <SettingsToggle
        name="将转录追加到活动文件"
        description="如果为true，默认行为是将转录追加到活动文件。如果为false，将创建一个包含转录的新笔记。"
        {...register('isAppendToActiveFile')}
      />
      <DirectorySelect
        {...register('transcriptDirectory')}
        name="转录目录"
      />
      <SettingsToggle
        name='在"created_by" frontmatter中链接到Scribe'
        description="如果为true，我们将在笔记的frontmatter中添加指向Scribe的链接。这有助于知道哪些笔记是由Scribe创建的。"
        {...register('isFrontMatterLinkToScribe')}
      />

      <SettingsItemHeader name="录音" />
      <DirectorySelect
        {...register('recordingDirectory')}
        name="录音目录"
      />
      <SettingsToggle
        name="保存音频文件"
        description='在Scribe后保存音频文件。如果为false，音频文件将在转录后永久删除。这不会影响"转录现有文件"命令'
        {...register('isSaveAudioFileActive')}
      />
      <SettingsSelect
        {...register('audioFileFormat')}
        name="音频文件格式"
        description="选择保存音频录音的格式。MP3格式将在客户端从WebM转换。"
        valuesMapping={[
          {
            value: 'webm',
            displayName: 'WebM',
          },
          {
            value: 'mp3',
            displayName: 'MP3',
          },
        ]}
      />
      <SettingsItemHeader name="文件名设置" />
      <SettingsInput
        {...register('recordingFilenamePrefix')}
        name="音频录音文件名前缀"
        description="这将是音频录音文件名的前缀，使用{{date}}来包含日期"
        placeholder="scribe-"
      />
      <SettingsInput
        {...register('noteFilenamePrefix')}
        name="转录文件名前缀"
        description="这将是笔记文件名的前缀，使用{{date}}来包含日期"
        placeholder="scribe-"
      />
      <SettingsInput
        {...register('dateFilenameFormat')}
        name="日期格式"
        description="这只会在上面的转录或音频录音文件名前缀中包含{{date}}时使用"
        placeholder="YYYY-MM-DD"
        disabled={!isDateInPrefix}
      />

      {isDateInPrefix && (
        <div>
          <p>
            {formatFilenamePrefix(
              `${settings.noteFilenamePrefix}`,
              settings.dateFilenameFormat,
            )}
            文件名
          </p>
          <p>
            {formatFilenamePrefix(
              `${settings.recordingFilenamePrefix}`,
              settings.dateFilenameFormat,
            )}
            文件名
          </p>
        </div>
      )}
    </div>
  );
}

export default GeneralSettingsTab;
