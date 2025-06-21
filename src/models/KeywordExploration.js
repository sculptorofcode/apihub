import mongoose from 'mongoose';

const TrendSchema = new mongoose.Schema({
  month: String,
  year: Number,
  searches: Number,
}, { _id: false });

const SubKeywordSchema = new mongoose.Schema({
  keyword: String,
  volume: Number,
  cpc: Number,
  intent: String,
  competition: String,
  trend: [TrendSchema],
}, { _id: false });

const keywordExplorationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mainKeyword: { type: String, required: true },
  country: { type: String, default: 'en-US' },
  createdAt: { type: Date, default: Date.now },
  subkeywords: [SubKeywordSchema],
  sourcesScraped: [String], // e.g. ['reddit', 'x', 'devto']
  completed: { type: Boolean, default: false },
});

export default mongoose.models.KeywordExploration || mongoose.model('KeywordExploration', keywordExplorationSchema);
