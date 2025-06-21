import mongoose from 'mongoose';

const llmInsightSchema = new mongoose.Schema({
  explorationId: { type: mongoose.Schema.Types.ObjectId, ref: 'KeywordExploration', required: true },
  generatedAt: { type: Date, default: Date.now },
  promptVersion: { type: String, default: 'v1.0' },
  model: { type: String, default: 'gemini-pro' },
  problems: [String],
  productIdeas: [String],
  sentiment: String,
  status: { type: String, enum: ['complete', 'in_progress', 'failed'], default: 'in_progress' },
});

export default mongoose.models.LLMInsight || mongoose.model('LLMInsight', llmInsightSchema);
