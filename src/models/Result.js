// models/Result.js
import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
      index: true 
    },
    // Individual scores
    math: { 
      type: Number, 
      required: true, 
      min: 0, 
      max: 10 
    },
    reading: { 
      type: Number, 
      required: true, 
      min: 0, 
      max: 10 
    },
    history: { 
      type: Number, 
      required: true, 
      min: 0, 
      max: 20 
    },
    majorSubject1: { 
      type: Number, 
      required: true, 
      min: 0, 
      max: 50 
    },
    majorSubject2: { 
      type: Number, 
      required: true, 
      min: 0, 
      max: 50 
    },
    // Total score (sum of all 5 subjects)
    totalScore: { 
      type: Number, 
      required: true, 
      min: 0, 
      max: 140 
    },
    preferredFaculty: { 
      type: String, 
      trim: true,
      default: "" 
    }
  },
  { 
    timestamps: true 
  }
);

// Index for faster queries
schema.index({ userId: 1, createdAt: -1 });

// Virtual to calculate percentage
schema.virtual('percentage').get(function() {
  return ((this.totalScore / 140) * 100).toFixed(2);
});

// Ensure virtuals are included in JSON
schema.set('toJSON', { virtuals: true });
schema.set('toObject', { virtuals: true });

export const Result = mongoose.model("Result", schema);