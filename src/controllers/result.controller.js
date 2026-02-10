import { Result } from "../models/Result.js";

/**
 * Save a new analysis result
 */
export async function saveResult(req, res) {
  try {
    const { math, reading, history, majorSubject1, majorSubject2, preferredFaculty } = req.body;
    const userId = req.user._id;

    // Validate all scores are present
    if (math === undefined || reading === undefined || history === undefined || 
        majorSubject1 === undefined || majorSubject2 === undefined) {
      return res.status(400).json({ 
        error: "All score fields are required (math, reading, history, majorSubject1, majorSubject2)" 
      });
    }

    // Validate score ranges
    if (math < 0 || math > 10) {
      return res.status(400).json({ error: "Math score must be between 0-10" });
    }
    if (reading < 0 || reading > 10) {
      return res.status(400).json({ error: "Reading score must be between 0-10" });
    }
    if (history < 0 || history > 20) {
      return res.status(400).json({ error: "History score must be between 0-20" });
    }
    if (majorSubject1 < 0 || majorSubject1 > 50) {
      return res.status(400).json({ error: "Major Subject 1 score must be between 0-50" });
    }
    if (majorSubject2 < 0 || majorSubject2 > 50) {
      return res.status(400).json({ error: "Major Subject 2 score must be between 0-50" });
    }

    // Calculate total score - MUST include all 5 subjects!
    const totalScore = math + reading + history + majorSubject1 + majorSubject2;

    console.log("Saving result with scores:", {
      math,
      reading,
      history,
      majorSubject1,
      majorSubject2,
      totalScore,
      calculation: `${math} + ${reading} + ${history} + ${majorSubject1} + ${majorSubject2} = ${totalScore}`
    });

    const result = await Result.create({
      userId,
      math,
      reading,
      history,
      majorSubject1,
      majorSubject2,
      totalScore,
      preferredFaculty: preferredFaculty || ""
    });

    res.status(201).json({ 
      success: true,
      result,
      message: "Result saved successfully"
    });
  } catch (error) {
    console.error("Error saving result:", error);
    res.status(500).json({ 
      error: "Failed to save result",
      details: error.message 
    });
  }
}

/**
 * Get user's saved results
 */
export async function getUserResults(req, res) {
  try {
    const userId = req.user._id;

    const items = await Result.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    console.log(`Found ${items.length} results for user ${userId}`);

    res.json({ items });
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ 
      error: "Failed to fetch results",
      details: error.message 
    });
  }
}

/**
 * Get a single result by ID
 */
export async function getResult(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const result = await Result.findOne({ 
      _id: id, 
      userId 
    });

    if (!result) {
      return res.status(404).json({ error: "Result not found" });
    }

    res.json({ result });
  } catch (error) {
    console.error("Error fetching result:", error);
    res.status(500).json({ 
      error: "Failed to fetch result",
      details: error.message 
    });
  }
}

/**
 * Update a result
 */
export async function updateResult(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { math, reading, history, majorSubject1, majorSubject2, preferredFaculty } = req.body;

    // Find the result
    const result = await Result.findOne({ _id: id, userId });
    
    if (!result) {
      return res.status(404).json({ error: "Result not found" });
    }

    // Update fields if provided
    if (math !== undefined) result.math = math;
    if (reading !== undefined) result.reading = reading;
    if (history !== undefined) result.history = history;
    if (majorSubject1 !== undefined) result.majorSubject1 = majorSubject1;
    if (majorSubject2 !== undefined) result.majorSubject2 = majorSubject2;
    if (preferredFaculty !== undefined) result.preferredFaculty = preferredFaculty;

    // Recalculate total
    result.totalScore = result.math + result.reading + result.history + 
                        result.majorSubject1 + result.majorSubject2;

    await result.save();

    res.json({ 
      success: true,
      result,
      message: "Result updated successfully" 
    });
  } catch (error) {
    console.error("Error updating result:", error);
    res.status(500).json({ 
      error: "Failed to update result",
      details: error.message 
    });
  }
}

/**
 * Delete a result
 */
export async function deleteResult(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const result = await Result.findOneAndDelete({ 
      _id: id, 
      userId 
    });

    if (!result) {
      return res.status(404).json({ error: "Result not found or unauthorized" });
    }

    console.log(`Deleted result ${id} for user ${userId}`);

    res.json({ 
      success: true,
      message: "Result deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting result:", error);
    res.status(500).json({ 
      error: "Failed to delete result",
      details: error.message 
    });
  }
}

/**
 * Get user statistics
 */
export async function getUserStats(req, res) {
  try {
    const userId = req.user._id;

    const results = await Result.find({ userId }).lean();

    if (results.length === 0) {
      return res.json({
        totalAttempts: 0,
        averageScore: 0,
        highestScore: 0,
        latestScore: 0
      });
    }

    const totalScores = results.map(r => r.totalScore);
    const averageScore = totalScores.reduce((a, b) => a + b, 0) / totalScores.length;
    const highestScore = Math.max(...totalScores);
    const latestScore = results[0].totalScore; // Already sorted by createdAt desc

    res.json({
      totalAttempts: results.length,
      averageScore: Math.round(averageScore * 10) / 10, // Round to 1 decimal
      highestScore,
      latestScore,
      results: results.slice(0, 5) // Last 5 results
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ 
      error: "Failed to fetch statistics",
      details: error.message 
    });
  }
}