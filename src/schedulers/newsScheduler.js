// schedulers/newsScheduler.js
// Automatically fetch news from all universities periodically

import cron from "node-cron";
import axios from "axios";
import { News } from "../models/News.js";
import { University } from "../models/University.js";
import { ENV } from "../config/env.js";

/**
 * Fetch news for all universities
 */
async function autoFetchAllNews() {
  console.log("🔄 Starting automatic news fetch for all universities...");
  
  try {
    const universities = await University.find().limit(10); // Limit to avoid API quota
    let totalAdded = 0;

    for (const university of universities) {
      try {
        console.log(`  Fetching news for: ${university.name}`);
        
        const response = await axios.get("https://newsapi.org/v2/everything", {
          params: {
            q: university.name,
            language: "en",
            sortBy: "publishedAt",
            pageSize: 5,
            apiKey: ENV.NEWS_API_KEY
          }
        });

        const articles = response.data.articles || [];
        
        for (const article of articles) {
          try {
            await News.findOneAndUpdate(
              { 
                title: article.title,
                universityId: university._id 
              },
              {
                universityId: university._id,
                title: article.title,
                content: article.description || article.content || "No content available",
                publishedAt: article.publishedAt || new Date(),
                url: article.url,
                source: article.source?.name || "Unknown",
                imageUrl: article.urlToImage
              },
              { upsert: true, new: true }
            );
            totalAdded++;
          } catch (error) {
            // Skip duplicates
            if (error.code !== 11000) {
              console.error(`    Error saving article: ${error.message}`);
            }
          }
        }

        console.log(`  ✓ Added ${articles.length} news items for ${university.name}`);
        
        // Small delay to avoid rate limiting (NewsAPI has limits)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`  ✗ Error fetching news for ${university.name}:`, error.message);
      }
    }

    console.log(`✅ Automatic news fetch complete. Total added: ${totalAdded}`);
    
    // Cleanup old news (older than 30 days)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);
    const deleted = await News.deleteMany({ publishedAt: { $lt: cutoffDate } });
    
    if (deleted.deletedCount > 0) {
      console.log(`🗑️  Cleaned up ${deleted.deletedCount} old news items`);
    }
    
  } catch (error) {
    console.error("❌ Error in automatic news fetch:", error.message);
  }
}

/**
 * Initialize news scheduler
 */
export function initNewsScheduler() {
  // Run every 6 hours: At 00:00, 06:00, 12:00, and 18:00
  cron.schedule('0 */6 * * *', () => {
    console.log("⏰ Scheduled news fetch triggered");
    autoFetchAllNews();
  });

  console.log("📅 News scheduler initialized - will run every 6 hours");
  
  // Run once on startup (optional - comment out if not needed)
  console.log("🚀 Running initial news fetch on startup...");
  autoFetchAllNews();
}

// Export for manual triggering
export { autoFetchAllNews };