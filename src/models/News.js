import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    universityId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "University", 
      required: true,
      index: true 
    },
    title: { 
      type: String, 
      required: true, 
      trim: true 
    },
    content: { 
      type: String, 
      required: true 
    },
    publishedAt: { 
      type: Date, 
      default: Date.now,
      index: true 
    },
    url: { 
      type: String,
      trim: true 
    },
    source: { 
      type: String,
      trim: true 
    },
    imageUrl: { 
      type: String,
      trim: true 
    }
  },
  { 
    timestamps: true 
  }
);

// Create compound index for efficient queries
schema.index({ universityId: 1, publishedAt: -1 });

// Prevent duplicate news
schema.index({ title: 1, universityId: 1 }, { unique: true });

export const News = mongoose.model("News", schema);