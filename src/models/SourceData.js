import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  body: String,
  comments: [String],
  likes: Number,
  postUrl: String,
}, { _id: false });

const sourceDataSchema = new mongoose.Schema({
  explorationId: { type: mongoose.Schema.Types.ObjectId, ref: 'KeywordExploration', required: true },
  source: { type: String, required: true }, // 'reddit', 'x', 'devto'
  keyword: { type: String, required: true },
  fetchedAt: { type: Date, default: Date.now },
  data: [PostSchema],
});

export default mongoose.models.SourceData || mongoose.model('SourceData', sourceDataSchema);
