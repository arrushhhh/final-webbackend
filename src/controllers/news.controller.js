import axios from "axios";
import { News } from "../models/News.js";
import { University } from "../models/University.js";
import { ENV } from "../config/env.js";

/**
 * Fetch & store news for a university
 */
export async function fetchUniversityNews(req, res) {
  try {
    const { universityId } = req.params;
    const university = await University.findById(universityId);
    
    if (!university) {
      return res.status(404).json({ error: "University not found" });
    }

    const response = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        q: university.name,
        language: "en",
        sortBy: "publishedAt",
        apiKey: ENV.NEWS_API_KEY
      }
    });

    const articles = response.data.articles || [];
    
    const savedNews = await Promise.all(
      articles.slice(0, 5).map(article =>
        News.findOneAndUpdate(
          { 
            title: article.title,
            universityId: universityId 
          },
          {
            universityId,
            title: article.title,
            content: article.description || article.content || "No content available", // Fixed: Use 'content' not 'description'
            publishedAt: article.publishedAt || new Date(),
            url: article.url, // Added: Store URL
            source: article.source?.name || "Unknown", // Added: Store source
            imageUrl: article.urlToImage // Added: Store image if available
          },
          { upsert: true, new: true }
        )
      )
    );

    res.json({
      university: university.name,
      added: savedNews.length,
      items: savedNews
    });
  } catch (error) {
    console.error("Error fetching university news:", error.message);
    res.status(500).json({ 
      error: "Failed to fetch news",
      details: error.message 
    });
  }
}

/**
 * List stored news
 */
export async function listNews(req, res) {
  try {
    const { universityId } = req.query;
    const filter = universityId ? { universityId } : {};
    
    const items = await News.find(filter)
      .sort({ publishedAt: -1 })
      .limit(20)
      .populate('universityId', 'name city') // Populate university details
      .lean();

    // Transform data to match frontend expectations
    const transformedItems = items.map(item => ({
      _id: item._id,
      title: item.title,
      content: item.content,
      publishedAt: item.publishedAt,
      university: item.universityId?.name || "Unknown University",
      universityCity: item.universityId?.city,
      link: item.url,
      source: item.source,
      imageUrl: item.imageUrl
    }));

    res.json({ items: transformedItems });
  } catch (error) {
    console.error("Error listing news:", error.message);
    res.status(500).json({ 
      error: "Failed to fetch news list",
      details: error.message 
    });
  }
}

/**
 * Fetch news for ALL universities (batch update)
 */
export async function fetchAllUniversitiesNews(req, res) {
  try {
    const universities = await University.find().limit(10); // Limit to avoid API quota issues
    
    let totalAdded = 0;
    const results = [];

    for (const university of universities) {
      try {
        const response = await axios.get("https://newsapi.org/v2/everything", {
          params: {
            q: university.name,
            language: "en",
            sortBy: "publishedAt",
            pageSize: 5, // Limit articles per university
            apiKey: ENV.NEWS_API_KEY
          }
        });

        const articles = response.data.articles || [];
        
        const savedNews = await Promise.all(
          articles.map(article =>
            News.findOneAndUpdate(
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
            )
          )
        );

        totalAdded += savedNews.length;
        results.push({
          university: university.name,
          added: savedNews.length
        });

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Error fetching news for ${university.name}:`, error.message);
        results.push({
          university: university.name,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      totalUniversities: universities.length,
      totalNewsAdded: totalAdded,
      results
    });
  } catch (error) {
    console.error("Error in batch fetch:", error.message);
    res.status(500).json({ 
      error: "Failed to fetch news for all universities",
      details: error.message 
    });
  }
}

/**
 * Delete old news (cleanup)
 */
export async function cleanupOldNews(req, res) {
  try {
    const daysOld = parseInt(req.query.days) || 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await News.deleteMany({
      publishedAt: { $lt: cutoffDate }
    });

    res.json({
      success: true,
      deleted: result.deletedCount,
      message: `Deleted news older than ${daysOld} days`
    });
  } catch (error) {
    console.error("Error cleaning up news:", error.message);
    res.status(500).json({ 
      error: "Failed to cleanup old news",
      details: error.message 
    });
  }
}