import { Tabs } from "@mantine/core";

export default function ProjectTabs({ description }) {
  return (
    <Tabs
      defaultValue="description"
      className="mt-6"
      styles={{
        tab: {
          fontWeight: 500,
          fontSize: '16px',
          padding: '12px 16px',
          borderRadius: '8px',
          transition: 'background-color 0.3s',
          color: '#333',
        },
        tabActive: {
          backgroundColor: '#f5f5f5',
          color: '#111',
          boxShadow: 'inset 0 -2px 0 #333',
        },
        list: {
          gap: '8px',
          borderBottom: '1px solid #e0e0e0',
          paddingBottom: '8px',
          marginBottom: '16px',
        },
        panel: {
          backgroundColor: '#fafafa',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
        },
      }}
    >
      <Tabs.List grow>
        <Tabs.Tab value="description">Description</Tabs.Tab>
        <Tabs.Tab value="members">Members</Tabs.Tab>
        <Tabs.Tab value="co-leaders">Co-Leaders</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="description">
        {description}
      </Tabs.Panel>
      <Tabs.Panel value="members">
        {/* Members List Here */}
      </Tabs.Panel>
      <Tabs.Panel value="co-leaders">
        {/* Co-Leaders List Here */}
      </Tabs.Panel>
    </Tabs>
  );
}
