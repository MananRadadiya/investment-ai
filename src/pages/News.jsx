import { useState } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, TrendingUp, TrendingDown, Minus, Bookmark, BookmarkCheck, Search, Filter, Sparkles } from 'lucide-react';
import { newsArticles, trendingTopics, aiMarketSummary } from '../data/newsData';

const categories = ['All', 'Stocks', 'Crypto', 'Economy', 'Commodities'];

const sentimentConfig = {
  bullish: { color: '#22c55e', icon: TrendingUp, label: 'Bullish' },
  bearish: { color: '#ef4444', icon: TrendingDown, label: 'Bearish' },
  neutral: { color: '#f59e0b', icon: Minus, label: 'Neutral' },
};

export default function News() {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('ai-invest-bookmarks');
    return saved ? JSON.parse(saved) : [];
  });
  const [showAISummary, setShowAISummary] = useState(true);

  const toggleBookmark = (id) => {
    setBookmarks((prev) => {
      const next = prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id];
      localStorage.setItem('ai-invest-bookmarks', JSON.stringify(next));
      return next;
    });
  };

  const filtered = newsArticles.filter((a) => {
    const matchCategory = category === 'All' || a.category.toLowerCase() === category.toLowerCase();
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchCategory && matchSearch;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: '32px' }}>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight" style={{ marginBottom: '8px' }}>News & Insights</h1>
          <p className="text-sm" style={{ color: 'var(--color-text-dim)' }}>Market news powered by AI analysis</p>
        </div>
        <div className="relative">
          <Search className="absolute w-4 h-4" style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dim)' }} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search news..."
            className="text-sm focus:outline-none" style={{ paddingLeft: '38px', paddingRight: '16px', paddingTop: '10px', paddingBottom: '10px', background: 'var(--color-input-bg)', borderRadius: '12px', border: '1px solid var(--color-border)', color: 'var(--color-text)', width: '220px' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
        {/* Main Feed */}
        <div>
          {/* AI Summary */}
          {showAISummary && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="panel" style={{ padding: '24px 28px', marginBottom: '24px', borderLeft: '3px solid var(--color-accent)' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
                <div className="flex items-center" style={{ gap: '10px' }}>
                  <Sparkles style={{ width: '18px', height: '18px', color: 'var(--color-accent)' }} />
                  <span className="text-sm font-semibold">AI Market Summary</span>
                </div>
                <button onClick={() => setShowAISummary(false)} className="text-xs cursor-pointer" style={{ background: 'none', border: 'none', color: 'var(--color-text-dim)' }}>Dismiss</button>
              </div>
              <div className="text-sm" style={{ color: 'var(--color-text-muted)', lineHeight: 1.8 }}>
                {aiMarketSummary.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} style={{ color: 'var(--color-text)' }}>{part}</strong> : part)}
              </div>
            </motion.div>
          )}

          {/* Category Filters */}
          <div className="flex items-center" style={{ gap: '6px', marginBottom: '24px' }}>
            {categories.map((c) => (
              <button key={c} onClick={() => setCategory(c)} className="text-xs font-semibold cursor-pointer" style={{ padding: '8px 16px', borderRadius: '999px', border: 'none', background: category === c ? 'var(--color-accent)' : 'var(--color-surface)', color: category === c ? '#fff' : 'var(--color-text-muted)', transition: 'all 150ms' }}>
                {c}
              </button>
            ))}
          </div>

          {/* News Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map((article, idx) => {
              const SentimentIcon = sentimentConfig[article.sentiment]?.icon || Minus;
              const sentimentColor = sentimentConfig[article.sentiment]?.color || '#f59e0b';
              const isBookmarked = bookmarks.includes(article.id);
              return (
                <motion.div key={article.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }} className="panel" style={{ padding: '20px 24px' }}>
                  <div className="flex items-start justify-between" style={{ gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <div className="flex items-center" style={{ gap: '10px', marginBottom: '8px' }}>
                        <span className="text-xs font-semibold" style={{ color: 'var(--color-accent)' }}>{article.source}</span>
                        <span className="text-xs" style={{ color: 'var(--color-text-dim)' }}>·</span>
                        <span className="text-xs" style={{ color: 'var(--color-text-dim)' }}>{article.time}</span>
                        <span className="text-xs" style={{ color: 'var(--color-text-dim)' }}>·</span>
                        <span className="text-xs" style={{ color: 'var(--color-text-dim)' }}>{article.readTime} read</span>
                      </div>
                      <h3 className="text-sm font-semibold" style={{ marginBottom: '6px', lineHeight: 1.5 }}>{article.title}</h3>
                      <p className="text-xs" style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{article.summary}</p>
                      <div className="flex items-center" style={{ gap: '8px', marginTop: '12px' }}>
                        <span className="flex items-center text-xs font-semibold" style={{ gap: '4px', padding: '3px 10px', borderRadius: '999px', background: `${sentimentColor}15`, color: sentimentColor }}>
                          <SentimentIcon style={{ width: '12px', height: '12px' }} />{sentimentConfig[article.sentiment]?.label}
                        </span>
                        {article.tags.map((tag) => (
                          <span key={tag} className="text-xs" style={{ padding: '3px 8px', borderRadius: '6px', background: 'var(--color-surface-active)', color: 'var(--color-text-dim)' }}>#{tag}</span>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => toggleBookmark(article.id)} className="cursor-pointer flex-shrink-0" style={{ background: 'none', border: 'none', color: isBookmarked ? 'var(--color-accent)' : 'var(--color-text-dim)', padding: '4px' }}>
                      {isBookmarked ? <BookmarkCheck style={{ width: '18px', height: '18px' }} /> : <Bookmark style={{ width: '18px', height: '18px' }} />}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Trending Topics */}
          <div className="panel" style={{ padding: '24px', marginBottom: '16px' }}>
            <span className="section-label">Trending Topics</span>
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {trendingTopics.map((topic, idx) => (
                <motion.div key={topic.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.04 }} className="flex items-center justify-between" style={{ padding: '8px 12px', borderRadius: '10px', background: 'var(--color-surface-hover)', cursor: 'pointer' }}
                  onClick={() => setSearch(topic.name)}>
                  <div className="flex items-center" style={{ gap: '10px' }}>
                    <span className="text-xs font-bold" style={{ color: 'var(--color-text-dim)', width: '16px' }}>#{idx + 1}</span>
                    <span className="text-sm font-medium">{topic.name}</span>
                  </div>
                  <div className="flex items-center" style={{ gap: '6px' }}>
                    <span className="text-xs" style={{ color: 'var(--color-text-dim)' }}>{topic.count}</span>
                    {topic.trend === 'up' && <TrendingUp style={{ width: '12px', height: '12px', color: '#22c55e' }} />}
                    {topic.trend === 'down' && <TrendingDown style={{ width: '12px', height: '12px', color: '#ef4444' }} />}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bookmarked */}
          <div className="panel" style={{ padding: '24px' }}>
            <span className="section-label">Bookmarked ({bookmarks.length})</span>
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {bookmarks.length === 0 ? (
                <p className="text-xs" style={{ color: 'var(--color-text-dim)', padding: '12px 0' }}>No saved articles yet</p>
              ) : (
                bookmarks.slice(0, 5).map((id) => {
                  const article = newsArticles.find((a) => a.id === id);
                  if (!article) return null;
                  return (
                    <div key={id} style={{ padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>
                      <p className="text-xs font-medium" style={{ lineHeight: 1.5 }}>{article.title}</p>
                      <p className="text-xs" style={{ color: 'var(--color-text-dim)', marginTop: '2px' }}>{article.source}</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
