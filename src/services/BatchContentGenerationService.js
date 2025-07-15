n/g, '<br>').replace(/##/g, '<h2>').replace(/<h2>/g, '</p><h2>').replace(/<br><br>/g, '</p><p>')}
    </article>
</body>
</html>`;
  }

  generateMarkdownExport(content, metadata) {
    return `---
title: ${metadata.title}
target_keyword: ${metadata.target_keyword}
content_type: ${metadata.content_type}
generated_at: ${metadata.generated_at}
research_enhanced: ${metadata.research_enhanced}
cluster_id: ${metadata.content_cluster_id}
---

${content}`;
  }

  generateWordPressExport(content, metadata) {
    return {
      title: metadata.title,
      content: content,
      excerpt: content.substring(0, 160) + '...',
      tags: [metadata.target_keyword],
      categories: [metadata.content_type],
      meta: {
        target_keyword: metadata.target_keyword,
        content_cluster_id: metadata.content_cluster_id,
        research_enhanced: metadata.research_enhanced
      }
    };
  }

  generateJSONExport(processedContent, contentItem) {
    return JSON.stringify({
      content_item: contentItem,
      processed_content: processedContent,
      generated_at: new Date().toISOString()
    }, null, 2);
  }

  // Helper methods for additional functionality
  inferTargetAudience(item, userProfile) {
    if (userProfile?.targetAudience) return userProfile.targetAudience;
    
    const audienceMap = {
      'how-to': 'beginners and DIY enthusiasts',
      'guide': 'professionals and decision-makers',
      'case-study': 'business professionals',
      'comparison': 'potential customers and evaluators'
    };
    
    return audienceMap[item.content_type] || 'business professionals';
  }

  getResearchFocus(title, researchData) {
    // Extract relevant research focus based on title keywords
    return `Market trends and competitive analysis relevant to ${title}`;
  }

  findLateralConnections(contentItems) {
    const connections = [];
    
    contentItems.forEach((item1, index1) => {
      contentItems.forEach((item2, index2) => {
        if (index1 !== index2 && item1.type === item2.type) {
          const keywordOverlap = this.calculateKeywordOverlap(item1.target_keyword, item2.target_keyword);
          if (keywordOverlap > 0.3) {
            connections.push({
              from: item1.id,
              to: item2.id,
              strength: keywordOverlap,
              reason: 'Related keywords and topics'
            });
          }
        }
      });
    });
    
    return connections;
  }

  calculateKeywordOverlap(keyword1, keyword2) {
    const words1 = keyword1.toLowerCase().split(' ');
    const words2 = keyword2.toLowerCase().split(' ');
    const intersection = words1.filter(word => words2.includes(word));
    const union = [...new Set([...words1, ...words2])];
    return intersection.length / union.length;
  }

  inferSearchIntent(keyword, contentType) {
    if (keyword.startsWith('how to') || keyword.startsWith('what is')) return 'informational';
    if (keyword.includes('best') || keyword.includes('review')) return 'commercial';
    if (keyword.includes('buy') || keyword.includes('price')) return 'transactional';
    return 'informational';
  }

  generateLongTailKeywords(contentItems) {
    return contentItems.map(item => ({
      primary: item.target_keyword,
      long_tail_variations: [
        `${item.target_keyword} guide`,
        `best ${item.target_keyword}`,
        `${item.target_keyword} tips`,
        `how to choose ${item.target_keyword}`
      ],
      content_id: item.id
    }));
  }

  generateInternalLinkingPlan(contentItems) {
    const plan = {};
    
    contentItems.forEach(item => {
      plan[item.id] = {
        outbound_links: contentItems
          .filter(other => other.id !== item.id && other.type !== item.type)
          .slice(0, 3)
          .map(other => ({
            target_id: other.id,
            anchor_text: other.title,
            context: `Related to ${other.target_keyword}`
          }))
      };
    });
    
    return plan;
  }

  extractResearchSources(researchData) {
    const sources = [];
    
    if (researchData.results) {
      Object.values(researchData.results).forEach(phaseData => {
        if (phaseData.sources) {
          sources.push(...phaseData.sources.map(source => source.domain));
        }
      });
    }
    
    return [...new Set(sources)];
  }
}

export default BatchContentGenerationService;