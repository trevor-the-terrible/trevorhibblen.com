import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function TabWrapper({
  defaultValue = '',
  group = 'tab-content',
  tabs = [],
  ...attrs
 }: {
  tabs: Tab[],
  defaultValue?: string,
  group?: string,
  attrs?: React.HTMLAttributes<HTMLDivElement>
}) {
  return (
    <Tabs
      defaultValue={defaultValue}
      className="w-[400px]"
      onValueChange={val => onTabChange(val, group)}
    >
      <TabsList {...attrs}>
        {
          tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))
        }
      </TabsList>

      {/*
      tabs are static site content
      <TabsContent value="account">Make changes to your account here.</TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
      */}
    </Tabs>
  );
}

export type Tab = {
  id: string;
  label: string;
}

const onTabChange = (tab: string, group: string) => {
  // updates static content
  Array.from(document.getElementsByClassName(group)).forEach(element => {
    if (element.id === tab) {
      element.classList.remove('hidden');
    } else {
      element.classList.add('hidden');
    }
  });
}
