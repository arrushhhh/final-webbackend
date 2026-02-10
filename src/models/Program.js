// models/Program.js
import mongoose from "mongoose";

const programSchema = new mongoose.Schema(
  {
    universityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: true,
      index: true
    },
    programName: {
      type: String,
      required: true,
      trim: true
    },
    faculty: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    // Minimum passing score for this program (out of 140)
    minScore: {
      type: Number,
      required: true,
      min: 0,
      max: 140
    },
    // Grant/scholarship availability
    grantAvailable: {
      type: Boolean,
      default: false
    },
    // Optional: Minimum score for grant eligibility
    grantMinScore: {
      type: Number,
      min: 0,
      max: 140
    },
    // Program details
    description: {
      type: String,
      trim: true
    },
    duration: {
      type: Number, // in years
      default: 4
    },
    language: {
      type: String,
      enum: ["Kazakh", "Russian", "English"],
      default: "Kazakh"
    },
    // Capacity information
    totalSeats: {
      type: Number,
      min: 0
    },
    grantSeats: {
      type: Number,
      min: 0
    },
    // Previous year statistics (optional)
    lastYearStats: {
      averageScore: Number,
      highestScore: Number,
      lowestScore: Number,
      applicants: Number
    },
    // Status
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes for efficient queries
programSchema.index({ faculty: 1, minScore: 1 });
programSchema.index({ universityId: 1, faculty: 1 });
programSchema.index({ minScore: 1 });

// Virtual to check if grant is realistically available
programSchema.virtual('hasGrant').get(function() {
  return this.grantAvailable && this.grantSeats > 0;
});

// Method to check if score qualifies for admission
programSchema.methods.qualifiesForAdmission = function(score) {
  return score >= this.minScore;
};

// Method to check if score qualifies for grant
programSchema.methods.qualifiesForGrant = function(score) {
  if (!this.grantAvailable) return false;
  return score >= (this.grantMinScore || this.minScore);
};

programSchema.set('toJSON', { virtuals: true });
programSchema.set('toObject', { virtuals: true });

export const Program = mongoose.model("Program", programSchema);