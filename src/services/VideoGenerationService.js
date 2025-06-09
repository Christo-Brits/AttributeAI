class VideoGenerationService {
  constructor() {
    this.baseURL = 'http://localhost:3001';
    this.platforms = {
      tiktok: {
        name: 'TikTok',
        duration: { min: 15, max: 60, optimal: 30 },
        style: 'fast-paced, trendy, hook-driven',
        aspectRatio: '9:16',
        features: ['trending sounds', 'effects', 'captions', 'challenges']
      },
      youtube: {
        name: 'YouTube Shorts',
        duration: { min: 15, max: 60, optimal: 45 },
        style: 'educational, value-packed, clear CTA',
        aspectRatio: '9:16',
        features: ['chapters', 'end screens', 'captions', 'descriptions']
      },
      instagram: {
        name: 'Instagram Reels',
        duration: { min: 15, max: 90, optimal: 30 },
        style: 'aesthetic, engaging, shareable',
        aspectRatio: '9:16',
        features: ['music', 'effects', 'stickers', 'captions']
      }
    };
  }

  async generateVideoContent(blogContent, platform = 'tiktok', options = {}) {
    try {
      console.log('🎬 Generating video content for', platform);
      
      // Step 1: Extract key points from blog
      const keyPoints = await this.extractKeyPoints(blogContent);
      
      // Step 2: Generate platform-specific script
      const script = await this.generateScript(keyPoints, platform, options);
      
      // Step 3: Create scene breakdown
      const scenes = await this.createSceneBreakdown(script, platform);
      
      // Step 4: Generate captions
      const captions = await this.generateCaptions(scenes);
      
      // Step 5: Suggest trending audio
      const audioSuggestions = await this.suggestTrendingAudio(platform, keyPoints);
      
      // Step 6: Create thumbnail ideas
      const thumbnailIdeas = this.generateThumbnailIdeas(keyPoints, platform);
      
      // Step 7: Generate hashtags
      const hashtags = await this.generateHashtags(keyPoints, platform);
      
      return {
        platform: this.platforms[platform],
        script,
        scenes,
        captions,
        audioSuggestions,
        thumbnailIdeas,
        hashtags,
        metadata: {
          totalDuration: scenes.reduce((acc, scene) => acc + scene.duration, 0),
          sceneCount: scenes.length,
          wordCount: script.split(' ').length
        }
      };
    } catch (error) {
      console.error('Video generation error:', error);
      throw error;
    }
  }

  async extractKeyPoints(blogContent) {
    // Remove HTML tags and extract text
    const textContent = blogContent.replace(/<[^>]*>/g, ' ').trim();    
    try {
      const response = await fetch(`${this.baseURL}/api/extract-key-points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: textContent })
      });
      
      if (!response.ok) throw new Error('Key point extraction failed');
      
      const result = await response.json();
      return result.keyPoints;
    } catch (error) {
      console.error('Key point extraction error:', error);
      // Fallback to basic extraction
      return this.basicKeyPointExtraction(textContent);
    }
  }

  basicKeyPointExtraction(text) {
    // Simple extraction based on paragraphs and lists
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    const keyPoints = [];
    
    // Find sentences with numbers or action words
    sentences.forEach(sentence => {
      if (sentence.match(/\d+|tip|step|way|reason|benefit|must|should|need/i)) {
        keyPoints.push(sentence.trim());
      }
    });
    
    // Return top 5 points
    return keyPoints.slice(0, 5);
  }
  async generateScript(keyPoints, platform, options) {
    const platformConfig = this.platforms[platform];
    
    try {
      const response = await fetch(`${this.baseURL}/api/generate-video-script`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyPoints,
          platform,
          style: platformConfig.style,
          duration: options.duration || platformConfig.duration.optimal,
          tone: options.tone || 'engaging'
        })
      });
      
      if (!response.ok) throw new Error('Script generation failed');
      
      const result = await response.json();
      return result.script;
    } catch (error) {
      console.error('Script generation error:', error);
      // Fallback to template-based generation
      return this.generateTemplateScript(keyPoints, platform);
    }
  }

  generateTemplateScript(keyPoints, platform) {
    let script = '';
    
    // Platform-specific hooks
    const hooks = {
      tiktok: [
        "STOP! This will save you thousands 💰",
        "POV: You just discovered the secret to...",
        "Nobody talks about this but..."
      ],
      youtube: [
        "Here's exactly how to...",
        "The complete guide to...",
        "5 things you need to know about..."
      ],
      instagram: [
        "Save this for later! 📌",
        "Your sign to finally...",
        "Transform your property with these tips ✨"
      ]
    };
    
    // Add hook
    const randomHook = hooks[platform][Math.floor(Math.random() * hooks[platform].length)];
    script += randomHook + '\n\n';
    
    // Add key points
    keyPoints.forEach((point, index) => {
      script += `${index + 1}. ${point}\n`;
    });
    
    // Add CTA
    script += '\n' + this.getPlatformCTA(platform);
    
    return script;
  }
  getPlatformCTA(platform) {
    const ctas = {
      tiktok: "Follow for more property tips! 🏠",
      youtube: "Subscribe for weekly property guides! Hit the bell 🔔",
      instagram: "Save & share with someone who needs this! 💙"
    };
    return ctas[platform] || "Follow for more!";
  }

  async createSceneBreakdown(script, platform) {
    const platformConfig = this.platforms[platform];
    const scenes = [];
    
    // Split script into sections
    const sections = script.split('\n').filter(line => line.trim());
    
    // Calculate time per section
    const totalDuration = platformConfig.duration.optimal;
    const hookDuration = 3; // First 3 seconds for hook
    const ctaDuration = 2; // Last 2 seconds for CTA
    const contentDuration = totalDuration - hookDuration - ctaDuration;
    const timePerPoint = contentDuration / (sections.length - 2); // Exclude hook and CTA
    
    // Create scenes
    sections.forEach((section, index) => {
      if (index === 0) {
        // Hook scene
        scenes.push({
          duration: hookDuration,
          type: 'hook',          text: section,
          visual: 'Attention-grabbing visual or problem visualization',
          transition: 'quick cut',
          caption: section.toUpperCase()
        });
      } else if (index === sections.length - 1) {
        // CTA scene
        scenes.push({
          duration: ctaDuration,
          type: 'cta',
          text: section,
          visual: 'Brand logo or call-to-action graphic',
          transition: 'fade out',
          caption: section
        });
      } else {
        // Content scenes
        scenes.push({
          duration: Math.round(timePerPoint),
          type: 'point',
          text: section,
          visual: `Demonstration or visualization of: ${section.substring(0, 50)}...`,
          transition: 'smooth transition',
          caption: this.generateSceneCaption(section)
        });
      }
    });
    
    return scenes;
  }
  generateSceneCaption(text) {
    // Create short, punchy captions for scenes
    const shortened = text.substring(0, 60);
    
    // Add emojis for visual interest
    const emojiMap = {
      'tip': '💡',
      'save': '💰',
      'money': '💵',
      'property': '🏠',
      'maintenance': '🔧',
      'check': '✅',
      'warning': '⚠️',
      'important': '❗',
      'step': '👟'
    };
    
    let caption = shortened;
    Object.entries(emojiMap).forEach(([word, emoji]) => {
      if (text.toLowerCase().includes(word)) {
        caption += ' ' + emoji;
      }
    });
    
    return caption.toUpperCase();
  }

  async generateCaptions(scenes) {
    const captions = {
      srt: [],      vtt: [],
      json: []
    };
    
    let currentTime = 0;
    
    scenes.forEach((scene, index) => {
      const startTime = currentTime;
      const endTime = currentTime + scene.duration;
      
      // SRT format
      captions.srt.push(
        `${index + 1}\n` +
        `${this.formatSRTTime(startTime)} --> ${this.formatSRTTime(endTime)}\n` +
        `${scene.caption}\n`
      );
      
      // VTT format
      captions.vtt.push(
        `${this.formatVTTTime(startTime)} --> ${this.formatVTTTime(endTime)}\n` +
        `${scene.caption}\n`
      );
      
      // JSON format
      captions.json.push({
        start: startTime,
        end: endTime,
        text: scene.caption
      });
            
      currentTime = endTime;
    });
    
    return {
      srt: captions.srt.join('\n'),
      vtt: 'WEBVTT\n\n' + captions.vtt.join('\n'),
      json: captions.json
    };
  }

  formatSRTTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')},000`;
  }

  formatVTTTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}.000`;
  }

  async suggestTrendingAudio(platform, keyPoints) {
    // In production, this would call a trending audio API
    const audioSuggestions = {
      tiktok: [
        {
          name: "Upbeat Tutorial Music",          description: "Fast-paced electronic beat perfect for tips",
          trending: true,
          uses: "2.3M"
        },
        {
          name: "Motivational Background",
          description: "Inspiring music for transformation content",
          trending: true,
          uses: "1.8M"
        }
      ],
      youtube: [
        {
          name: "Corporate Upbeat",
          description: "Professional yet engaging background music",
          trending: false,
          uses: "500K"
        },
        {
          name: "Tech Tutorial Theme",
          description: "Modern electronic music for educational content",
          trending: true,
          uses: "1.2M"
        }
      ],
      instagram: [
        {
          name: "Aesthetic Chill",
          description: "Relaxing vibe for lifestyle content",
          trending: true,
          uses: "3.1M"        },
        {
          name: "Uplifting Pop",
          description: "Feel-good music for positive content",
          trending: true,
          uses: "2.5M"
        }
      ]
    };
    
    return audioSuggestions[platform] || [];
  }

  generateThumbnailIdeas(keyPoints, platform) {
    const ideas = [];
    
    // Platform-specific thumbnail strategies
    const strategies = {
      tiktok: {
        style: "Eye-catching first frame",
        elements: ["Bold text overlay", "Surprising visual", "Clear benefit"]
      },
      youtube: {
        style: "Click-worthy custom thumbnail",
        elements: ["Big text", "Contrasting colors", "Face with expression", "Number/List"]
      },
      instagram: {
        style: "Aesthetic cover image",
        elements: ["Branded design", "Clean layout", "Readable text", "On-brand colors"]
      }
    };    
    const strategy = strategies[platform];
    
    // Generate 3 thumbnail ideas
    ideas.push({
      concept: "Before/After Split",
      description: "Split screen showing problem vs solution",
      text: keyPoints[0] ? keyPoints[0].substring(0, 30) + "..." : "Amazing Results",
      elements: strategy.elements
    });
    
    ideas.push({
      concept: "Big Number Focus",
      description: "Large number or statistic as focal point",
      text: "5 MUST-KNOW TIPS",
      elements: strategy.elements
    });
    
    ideas.push({
      concept: "Question Hook",
      description: "Intriguing question to spark curiosity",
      text: "Are You Making This Mistake?",
      elements: strategy.elements
    });
    
    return ideas;
  }

  async generateHashtags(keyPoints, platform) {
    const baseHashtags = {      tiktok: ['#propertyTikTok', '#homeTips', '#propertyMaintenance', '#learnOnTikTok', '#fyp'],
      youtube: ['#Shorts', '#propertyTips', '#howTo', '#tutorial', '#quickTips'],
      instagram: ['#reels', '#propertyGram', '#homeMaintenance', '#tipsAndTricks', '#reelsInstagram']
    };
    
    // Extract topic-specific hashtags from key points
    const topics = [];
    keyPoints.forEach(point => {
      const words = point.toLowerCase().split(' ');
      words.forEach(word => {
        if (word.length > 5 && !topics.includes(word)) {
          topics.push('#' + word);
        }
      });
    });
    
    // Combine base and topic hashtags
    const allHashtags = [...baseHashtags[platform], ...topics.slice(0, 5)];
    
    // Add trending hashtags
    const trendingHashtags = this.getTrendingHashtags(platform);
    
    return {
      required: baseHashtags[platform],
      topical: topics.slice(0, 5),
      trending: trendingHashtags,
      recommended: allHashtags.slice(0, 10)
    };
  }
  getTrendingHashtags(platform) {
    // In production, this would fetch real trending hashtags
    const trending = {
      tiktok: ['#foryoupage', '#viral', '#trending2025'],
      youtube: ['#youtubeshorts', '#shortsvideo', '#shortsfeed'],
      instagram: ['#reelitfeelit', '#instareels', '#reelsviral']
    };
    
    return trending[platform] || [];
  }

  // Export methods for different formats
  exportAsJSON(videoData) {
    return JSON.stringify(videoData, null, 2);
  }

  exportAsText(videoData) {
    let text = `VIDEO SCRIPT - ${videoData.platform.name}\n`;
    text += `${'='.repeat(50)}\n\n`;
    
    text += `FULL SCRIPT:\n${videoData.script}\n\n`;
    
    text += `SCENE BREAKDOWN:\n`;
    videoData.scenes.forEach((scene, index) => {
      text += `\nScene ${index + 1} (${scene.duration}s - ${scene.type}):\n`;
      text += `Text: ${scene.text}\n`;
      text += `Visual: ${scene.visual}\n`;
      text += `Caption: ${scene.caption}\n`;
    });    
    text += `\nHASHTAGS:\n${videoData.hashtags.recommended.join(' ')}\n`;
    
    text += `\nAUDIO SUGGESTIONS:\n`;
    videoData.audioSuggestions.forEach(audio => {
      text += `- ${audio.name}: ${audio.description}\n`;
    });
    
    return text;
  }

  exportAsPDF(videoData) {
    // This would integrate with a PDF library
    // For now, return structured data for PDF generation
    return {
      title: `Video Script - ${videoData.platform.name}`,
      sections: [
        { heading: 'Script', content: videoData.script },
        { heading: 'Scenes', content: videoData.scenes },
        { heading: 'Captions', content: videoData.captions.srt },
        { heading: 'Hashtags', content: videoData.hashtags.recommended.join(' ') }
      ]
    };
  }
}

export default VideoGenerationService;