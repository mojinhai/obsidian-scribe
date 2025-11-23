import { useEffect, useState } from 'react';

import { SettingsItem } from './SettingsItem';
import type ScribePlugin from 'src';

export interface ScribeTemplate {
  id: string;
  name: string;
  sections: TemplateSection[];
}
export interface TemplateSection {
  id: string;
  sectionHeader: string;
  sectionInstructions: string;
  isSectionOptional?: boolean;
  sectionOutputPrefix?: string;
  sectionOutputPostfix?: string; // Added property
}

export const DEFAULT_TEMPLATE: ScribeTemplate = {
  id: 'default',
  name: 'Scribe',
  sections: [
    {
      id: '1',
      sectionHeader: 'Summary',
      sectionInstructions: `转录内容的Markdown摘要。它将嵌套在h2标签下，所以使用小于h2的标题标签
包含说话人主要观点的简洁要点`,
    },
    {
      id: '2',
      sectionHeader: 'Insights',
      sectionInstructions: `从转录中获得的Markdown洞察。
关于你认为的洞察和改进的一两个段落的简短部分
关于改进事项的几个要点，可以自由使用标题
它将嵌套在h2标签下，所以使用小于h2的标题标签
        `,
    },
    {
      id: '3',
      sectionHeader: 'Mermaid Chart',
      sectionOutputPrefix: '```mermaid',
      sectionOutputPostfix: '```',
      sectionInstructions: `一个有效的unicode mermaid图表，显示概念地图，包括你获得的洞察以及说话人所说的话，
不要用任何东西包装它，只输出mermaid图表。
在节点文本中不要使用不是字母的特殊字符，特别是换行符、制表符或特殊字符如撇号、引号或逗号`,
    },
    {
      id: '4',
      sectionHeader: 'Answered Questions',
      isSectionOptional: true,
      sectionInstructions: `如果用户说"Hey Scribe"或暗示你，要求你做某事，回答问题或执行请求并将答案放在这里
将文本放在markdown中，它将嵌套在h2标签下，所以使用小于h2的标题标签
用一个简短的句子作为标题总结问题，并在下面整齐地放置你的回复，对于有多少问题就做多少
以清晰简洁的方式回答他们的问题`,
    },
  ],
};

const TemplateSection: React.FC<{
  section: TemplateSection;
  activeTemplate: ScribeTemplate;
  setActiveTemplate: (template: ScribeTemplate) => void;
  isTemplateLocked: boolean;
  setNoteTemplates: (templates: ScribeTemplate[]) => void;
  noteTemplates: ScribeTemplate[];
}> = ({
  section,
  activeTemplate,
  setActiveTemplate,
  isTemplateLocked,
  setNoteTemplates,
  noteTemplates,
}) => {
  const updateSection = (updatedSection: TemplateSection) => {
    const updatedSections = activeTemplate.sections.map((sec) =>
      sec.sectionHeader === section.sectionHeader ? updatedSection : sec,
    );

    const updatedNoteTemplates = noteTemplates.map((template) => {
      // Fill the id if it is not set
      if (!template.id) {
        template.id = Math.random().toString(36).substring(2, 9);
      }

      const isUpdatedTemplate =
        template.id === activeTemplate.id ||
        template.name === activeTemplate.name;

      if (isUpdatedTemplate) {
        return { ...template, sections: updatedSections };
      }

      return template;
    });

    setNoteTemplates(updatedNoteTemplates);
    setActiveTemplate({ ...activeTemplate, sections: updatedSections });
  };

  const removeSection = () => {
    const updatedSections = activeTemplate.sections.filter(
      (sec) => sec.id !== section.id,
    );
    setActiveTemplate({ ...activeTemplate, sections: updatedSections });
  };

  return (
    <div style={{ width: '100%' }}>
      <SettingsItem
        name="部分标题"
        description=""
        control={
          <input
            disabled={isTemplateLocked}
            type="text"
            value={section.sectionHeader}
            onChange={(e) => {
              updateSection({ ...section, sectionHeader: e.target.value });
            }}
          />
        }
      />

      <p>部分说明</p>
      <textarea
        disabled={isTemplateLocked}
        value={section.sectionInstructions}
        onChange={(e) => {
          updateSection({ ...section, sectionInstructions: e.target.value });
        }}
        rows={3}
        style={{
          width: '100%',
          overflow: 'visible',
          height: 'auto',
        }}
        onFocus={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = `${target.scrollHeight}px`;
        }}
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = `${target.scrollHeight}px`;
        }}
      />

      <SettingsItem
        name="部分可选"
        description='将部分标记为可选 - 例如"询问Scribe"'
        control={
          <input
            disabled={isTemplateLocked}
            type="checkbox"
            checked={Boolean(section.isSectionOptional)}
            onChange={(e) => {
              updateSection({
                ...section,
                isSectionOptional: e.target.checked,
              });
            }}
          />
        }
      />

      <SettingsItem
        name="部分输出前缀"
        description="部分输出的前缀 - 这对代码块很有用"
        control={
          <input
            disabled={isTemplateLocked}
            type="text"
            value={section.sectionOutputPrefix || ''}
            onChange={(e) => {
              updateSection({
                ...section,
                sectionOutputPrefix: e.target.value,
              });
            }}
          />
        }
      />

      <SettingsItem
        name="部分输出后缀"
        description="部分输出的后缀 - 这对代码块很有用"
        control={
          <input
            disabled={isTemplateLocked}
            type="text"
            value={section.sectionOutputPostfix || ''}
            onChange={(e) => {
              updateSection({
                ...section,
                sectionOutputPostfix: e.target.value,
              });
            }}
          />
        }
      />

      <button type="button" onClick={removeSection} disabled={isTemplateLocked}>
        移除部分
      </button>

      <hr />
    </div>
  );
};

const TemplateControls: React.FC<{
  noteTemplates: ScribeTemplate[];
  activeTemplate: ScribeTemplate;
  setNoteTemplates: (templates: ScribeTemplate[]) => void;
  setActiveTemplate: (template: ScribeTemplate) => void;
  isTemplateLocked: boolean;
}> = ({
  noteTemplates,
  activeTemplate,
  setNoteTemplates,
  setActiveTemplate,
  isTemplateLocked,
}) => {
  return (
    <>
      <SettingsItem
        name="活动模板"
        description="选择活动笔记模板 - 这将在模态框中自动选择"
        control={
          <select
            value={activeTemplate.name}
            className="dropdown"
            onChange={(e) => {
              const selectedTemplate = noteTemplates.find(
                (template) => template.name === e.target.value,
              );

              if (selectedTemplate) {
                setActiveTemplate(selectedTemplate);
              }
            }}
          >
            {noteTemplates.map((template) => (
              <option key={template.name} value={template.name}>
                {template.name}{' '}
                {template.name === DEFAULT_TEMPLATE.name ? '(已锁定)' : ''}
              </option>
            ))}
          </select>
        }
      />
      <button
        type="button"
        onClick={() => {
          const newTemplate: ScribeTemplate = {
            id: Math.random().toString(36).substring(2, 9),
            name: Date.now().toString(),
            sections: [],
          };
          const updatedTemplates = [...noteTemplates, newTemplate];
          setNoteTemplates(updatedTemplates);
          setActiveTemplate(newTemplate);
        }}
      >
        新建模板
      </button>

      <button
        type="button"
        onClick={() => {
          const clonedTemplate: ScribeTemplate = {
            ...activeTemplate,
            name: `${activeTemplate.name} (Copy)`,
          };
          const updatedTemplates = [...noteTemplates, clonedTemplate];
          setNoteTemplates(updatedTemplates);
          setActiveTemplate(clonedTemplate);
        }}
      >
        克隆模板
      </button>

      <button
        disabled={isTemplateLocked}
        type="button"
        onClick={() => {
          const updatedTemplates = noteTemplates.filter(
            (template) => template.name !== activeTemplate.name,
          );

          setNoteTemplates(updatedTemplates);
          setActiveTemplate(updatedTemplates[0]);
        }}
      >
        移除活动模板
      </button>

      <SettingsItem
        name="模板名称"
        description="更改活动模板的名称"
        control={
          <input
            disabled={isTemplateLocked}
            type="text"
            value={activeTemplate.name}
            onChange={(e) => {
              const updatedTemplate = {
                ...activeTemplate,
                name: e.target.value,
              };

              const activeTemplateIdx = noteTemplates.findIndex(
                (template) => template.name === activeTemplate.name,
              );

              const updatedTemplates = [...noteTemplates];
              updatedTemplates[activeTemplateIdx] = updatedTemplate;

              setActiveTemplate(updatedTemplate);
              setNoteTemplates(updatedTemplates);
            }}
          />
        }
      />

      <button
        type="button"
        disabled={isTemplateLocked}
        onClick={() => {
          const newSection: TemplateSection = {
            id: Math.random().toString(36).substring(2, 9),
            sectionHeader: '新部分',
            sectionInstructions: '新部分说明',
          };

          const updatedTemplate = {
            ...activeTemplate,
            sections: [...activeTemplate.sections, newSection],
          };

          const activeTemplateIdx = noteTemplates.findIndex(
            (template) => template.name === activeTemplate.name,
          );

          const updatedTemplates = [...noteTemplates];
          updatedTemplates[activeTemplateIdx] = updatedTemplate;

          setActiveTemplate(updatedTemplate);
          setNoteTemplates(updatedTemplates);
        }}
      >
        添加新部分
      </button>
      <hr />
    </>
  );
};

export const NoteTemplateSettings: React.FC<{
  plugin: ScribePlugin;
  saveSettings: () => void;
}> = ({ plugin, saveSettings }) => {
  const [noteTemplates, setNoteTemplates] = useState(
    plugin.settings.noteTemplates,
  );
  const [activeTemplate, setActiveTemplate] = useState(
    plugin.settings.activeNoteTemplate,
  );
  const isTemplateLocked = activeTemplate.name === DEFAULT_TEMPLATE.name;

  useEffect(() => {
    plugin.settings.noteTemplates = noteTemplates;
    plugin.settings.activeNoteTemplate = activeTemplate;
    saveSettings();
  }, [noteTemplates, activeTemplate, plugin, saveSettings]);

  return (
    <div>
      <h2>模板</h2>
      <TemplateControls
        noteTemplates={noteTemplates}
        activeTemplate={activeTemplate}
        setNoteTemplates={setNoteTemplates}
        setActiveTemplate={setActiveTemplate}
        isTemplateLocked={isTemplateLocked}
      />
      {activeTemplate.sections.map((section) => (
        <TemplateSection
          key={section.id}
          section={section}
          activeTemplate={activeTemplate}
          setActiveTemplate={setActiveTemplate}
          setNoteTemplates={setNoteTemplates}
          noteTemplates={noteTemplates}
          isTemplateLocked={isTemplateLocked}
        />
      ))}
    </div>
  );
};
