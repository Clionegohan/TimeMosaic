import { useState } from 'react';
import timeMosaicLogo from './assets/TimeMosaicLogo.png';
import { useColumns } from './hooks/useColumns';
import { useTags } from './hooks/useTags';
import { MultiColumnView } from './components/MultiColumnView/MultiColumnView';
import { TagSelector } from './components/TagSelector/TagSelector';
import { extractTimelineYears } from './lib/utils';

function App() {
  const { tags, loading: tagsLoading, error: tagsError } = useTags();

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { columns, loading: columnsLoading } = useColumns(selectedTags);

  const timelineYears = extractTimelineYears(columns);

  const handleSelectTag = (tag: string) => {
    if (selectedTags.length < 5 && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  return (
    <div className="min-h-screen bg-[var(--tm-paper)]">
      <header className="bg-[var(--tm-paper)] border-b border-black/10">
        <div className="max-w-7xl mx-auto px-5 py-10">
          <div className="flex items-center gap-4">
            <img
              src={timeMosaicLogo}
              alt="TimeMosaic"
              className="h-[72px] w-[72px]"
              decoding="async"
              loading="eager"
            />
            <h1 className="text-4xl font-extralight font-serif tracking-[0.02em] text-stone-900">
              TimeMosaic
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 py-8 space-y-6">

        <TagSelector
          allTags={tags}
          selectedTags={selectedTags}
          onSelectTag={handleSelectTag}
          onRemoveTag={handleRemoveTag}
          loading={tagsLoading}
          error={tagsError}
        />

        {selectedTags.length > 0 && (
          <>
            {columnsLoading ? (
              <section className="rounded-2xl border border-black/10 bg-[var(--tm-paper)] shadow-[0_1px_0_rgba(0,0,0,0.04)]">
                <div className="p-10 text-center text-stone-600">カラムデータを読み込み中...</div>
              </section>
            ) : (
              <MultiColumnView timelineYears={timelineYears} columns={columns} />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
