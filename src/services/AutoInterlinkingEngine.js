# Step 6: Automated Interlinking Engine
class AutoInterlinkingEngine {
  constructor() {
    this.baseURL = 'http://localhost:3001';
    this.linkingCache = new Map();
    this.contentDatabase = new Map(); // In production, this would be a real database
    this.linkingRules = {
      max_links_per_content: 8,
      min_links_per_content: 3,
      max_links_to_same_page: 2,
      min_anchor_text_length: 3,
      max_anchor_text_length: 60,
      link_density_max: 2.5, // percentage
      contextual_window: 50 // words around link for context analysis
    };
  }

  // Main interlinking method for content clusters
  async generateInterlinkingStrategy(contentCluster, existingContent = []) {
    console.log('🔗 Generating automated interlinking strategy...');
    
    try {
      const strategy = {
        cluster_id: contentCluster.id || 'unknown',
        strategy_type: 'hub_and_spoke_with_lateral',
        generated_at: new Date().toISOString(),
        content_pieces: contentCluster.content_items || [],
        interlinking_map: {},
        linking_recommendations: [],
        seo_impact_analysis: {},
        implementation_guide: {}
      };

      // Analyze content relationships
      const contentRelationships = await this.analyzeContentRelationships(
        strategy.content_pieces, 
        existingContent
      );

      // Generate hub and spoke links (pillar to supporting content)
      const hubSpokeLinks = await this.generateHubSpokeLinks(
        strategy.content_pieces, 
        contentRelationships
      );

      // Generate lateral links (supporting content to supporting content)
      const lateralLinks = await this.generateLateralLinks(
        strategy.content_pieces, 
        contentRelationships
      );

      // Generate contextual links based on content analysis
      const contextualLinks = await this.generateContextualLinks(
        strategy.content_pieces, 
        contentRelationships
      );

      // Combine all linking strategies
      strategy.interlinking_map = this.combineInterlinkingStrategies(
        hubSpokeLinks, 
        lateralLinks, 
        contextualLinks
      );

      // Generate specific implementation recommendations
      strategy.linking_recommendations = await this.generateLinkingRecommendations(
        strategy.interlinking_map, 
        strategy.content_pieces
      );

      // Analyze SEO impact
      strategy.seo_impact_analysis = this.analyzeSEOImpact(
        strategy.interlinking_map, 
        strategy.content_pieces
      );

      // Create implementation guide
      strategy.implementation_guide = this.createImplementationGuide(
        strategy.interlinking_map, 
        strategy.linking_recommendations
      );

      console.log('✅ Interlinking strategy generated successfully');
      return strategy;

    } catch (error) {
      console.error('Interlinking strategy generation failed:', error);
      throw error;
    }
  }

  // Apply interlinking to actual content
  async applyInterlinking(content, contentMetadata, interlinkingStrategy) {
    console.log(`🎯 Applying interlinking to content: ${contentMetadata.title}`);
    
    try {
      const contentId = contentMetadata.id || contentMetadata.slug;
      const linkingPlan = interlinkingStrategy.interlinking_map[contentId];
      
      if (!linkingPlan || !linkingPlan.outbound_links) {
        return {
          success: true,
          content: content,
          links_added: 0,
          message: 'No interlinking plan found for this content'
        };
      }

      let modifiedContent = content;
      let linksAdded = 0;
      const addedLinks = [];

      // Process each recommended link
      for (const linkRec of linkingPlan.outbound_links) {
        const linkResult = await this.insertContextualLink(
          modifiedContent, 
          linkRec, 
          contentMetadata
        );

        if (linkResult.success) {
          modifiedContent = linkResult.content;
          linksAdded++;
          addedLinks.push({
            target_url: linkRec.target_url,
            anchor_text: linkRec.anchor_text,
            position: linkResult.position,
            context: linkResult.context
          });
        }
      }

      // Validate final link density
      const finalLinkDensity = this.calculateLinkDensity(modifiedContent);
      
      return {
        success: true,
        content: modifiedContent,
        links_added: linksAdded,
        total_links: this.countInternalLinks(modifiedContent),
        link_density: finalLinkDensity,
        added_links: addedLinks,
        seo_impact: this.assessLinkingSEOImpact(addedLinks, contentMetadata)
      };

    } catch (error) {
      console.error('Interlinking application failed:', error);
      return {
        success: false,
        error: error.message,
        content: content,
        links_added: 0
      };
    }
  }

  // Analyze relationships between content pieces
  async analyzeContentRelationships(contentPieces, existingContent = []) {
    console.log('🔍 Analyzing content relationships...');
    
    const allContent = [...contentPieces, ...existingContent];
    const relationships = {
      semantic_similarity: {},
      keyword_overlap: {},
      topic_hierarchy: {},
      user_journey_flow: {},
      content_type_relationships: {}
    };

    // Analyze semantic similarity between content pieces
    for (let i = 0; i < allContent.length; i++) {
      for (let j = i + 1; j < allContent.length; j++) {
        const content1 = allContent[i];
        const content2 = allContent[j];
        
        const similarity = await this.calculateSemanticSimilarity(content1, content2);
        const keywordOverlap = this.calculateKeywordOverlap(content1, content2);
        
        const relationshipKey = `${content1.id}_${content2.id}`;
        
        relationships.semantic_similarity[relationshipKey] = similarity;
        relationships.keyword_overlap[relationshipKey] = keywordOverlap;
      }
    }

    // Analyze topic hierarchy (pillar → supporting → rapid)
    relationships.topic_hierarchy = this.analyzeTopicHierarchy(contentPieces);

    // Analyze user journey flow
    relationships.user_journey_flow = this.analyzeUserJourneyFlow(contentPieces);

    // Analyze content type relationships
    relationships.content_type_relationships = this.analyzeContentTypeRelationships(contentPieces);

    return relationships;
  }

  // Generate hub and spoke linking strategy
  async generateHubSpokeLinks(contentPieces, relationships) {
    console.log('🕸️ Generating hub and spoke links...');
    
    const hubSpokeLinks = {};
    const pillarContent = contentPieces.filter(piece => piece.type === 'pillar');
    const supportingContent = contentPieces.filter(piece => piece.type === 'supporting');
    const rapidContent = contentPieces.filter(piece => piece.type === 'rapid');

    // Pillar content as hubs - link to relevant supporting and rapid content
    for (const pillar of pillarContent) {
      hubSpokeLinks[pillar.id] = {
        content_piece: pillar,
        outbound_links: [],
        inbound_links: [],
        hub_score: this.calculateHubScore(pillar, contentPieces)
      };

      // Find relevant supporting content
      const relevantSupporting = this.findRelevantContent(
        pillar, 
        supportingContent, 
        relationships, 
        4 // max supporting links
      );

      // Find relevant rapid content
      const relevantRapid = this.findRelevantContent(
        pillar, 
        rapidContent, 
        relationships, 
        2 // max rapid links
      );

      // Generate outbound links from pillar
      for (const supportingPiece of relevantSupporting) {
        const linkRecommendation = await this.generateLinkRecommendation(
          pillar, 
          supportingPiece, 
          'hub_to_spoke',
          relationships
        );
        hubSpokeLinks[pillar.id].outbound_links.push(linkRecommendation);
      }

      for (const rapidPiece of relevantRapid) {
        const linkRecommendation = await this.generateLinkRecommendation(
          pillar, 
          rapidPiece, 
          'hub_to_spoke',
          relationships
        );
        hubSpokeLinks[pillar.id].outbound_links.push(linkRecommendation);
      }
    }

    // Supporting and rapid content linking back to relevant pillars
    for (const supporting of supportingContent) {
      if (!hubSpokeLinks[supporting.id]) {
        hubSpokeLinks[supporting.id] = {
          content_piece: supporting,
          outbound_links: [],
          inbound_links: []
        };
      }

      const relevantPillars = this.findRelevantContent(
        supporting, 
        pillarContent, 
        relationships, 
        2 // max pillar links
      );

      for (const pillar of relevantPillars) {
        const linkRecommendation = await this.generateLinkRecommendation(
          supporting, 
          pillar, 
          'spoke_to_hub',
          relationships
        );
        hubSpokeLinks[supporting.id].outbound_links.push(linkRecommendation);
      }
    }

    return hubSpokeLinks;
  }

  // Generate lateral linking between similar content
  async generateLateralLinks(contentPieces, relationships) {
    console.log('↔️ Generating lateral links...');
    
    const lateralLinks = {};

    // Group content by type
    const contentByType = {
      pillar: contentPieces.filter(p => p.type === 'pillar'),
      supporting: contentPieces.filter(p => p.type === 'supporting'),
      rapid: contentPieces.filter(p => p.type === 'rapid')
    };

    // Generate lateral links within each content type
    for (const [type, pieces] of Object.entries(contentByType)) {
      for (const piece of pieces) {
        if (!lateralLinks[piece.id]) {
          lateralLinks[piece.id] = {
            content_piece: piece,
            lateral_links: []
          };
        }

        // Find similar content for lateral linking
        const similarContent = this.findSimilarContent(
          piece, 
          pieces.filter(p => p.id !== piece.id), 
          relationships, 
          3 // max lateral links
        );

        for (const similar of similarContent) {
          const linkRecommendation = await this.generateLinkRecommendation(
            piece, 
            similar, 
            'lateral',
            relationships
          );
          lateralLinks[piece.id].lateral_links.push(linkRecommendation);
        }
      }
    }

    return lateralLinks;
  }

  // Generate contextual links based on content analysis
  async generateContextualLinks(contentPieces, relationships) {
    console.log('📝 Generating contextual links...');
    
    const contextualLinks = {};

    for (const piece of contentPieces) {
      contextualLinks[piece.id] = {
        content_piece: piece,
        contextual_opportunities: []
      };

      // Analyze content for natural linking opportunities
      const linkingOpportunities = await this.findContextualLinkingOpportunities(
        piece, 
        contentPieces, 
        relationships
      );

      contextualLinks[piece.id].contextual_opportunities = linkingOpportunities;
    }

    return contextualLinks;
  }

  // Find contextual linking opportunities within content
  async findContextualLinkingOpportunities(sourceContent, allContent, relationships) {
    const opportunities = [];
    
    // Simulate content analysis for linking opportunities
    const contentText = sourceContent.brief || sourceContent.title || '';
    const words = contentText.toLowerCase().split(' ');
    
    for (const targetContent of allContent) {
      if (targetContent.id === sourceContent.id) continue;
      
      const targetKeywords = targetContent.target_keyword.toLowerCase().split(' ');
      
      // Look for keyword mentions that could be linked
      for (const keyword of targetKeywords) {
        if (words.includes(keyword)) {
          opportunities.push({
            target_content: targetContent,
            anchor_keyword: keyword,
            link_type: 'contextual',
            relevance_score: this.calculateRelevanceScore(sourceContent, targetContent, relationships),
            suggested_anchor_text: this.generateAnchorText(targetContent, keyword),
            context_hint: `Link "${keyword}" to ${targetContent.title}`
          });
        }
      }
    }

    // Sort by relevance and limit
    return opportunities
      .sort((a, b) => b.relevance_score - a.relevance_score)
      .slice(0, 5);
  }

  // Combine different linking strategies
  combineInterlinkingStrategies(hubSpokeLinks, lateralLinks, contextualLinks) {
    const combinedStrategy = {};

    // Merge all linking recommendations
    const allContentIds = new Set([
      ...Object.keys(hubSpokeLinks),
      ...Object.keys(lateralLinks),
      ...Object.keys(contextualLinks)
    ]);

    for (const contentId of allContentIds) {
      combinedStrategy[contentId] = {
        content_id: contentId,
        outbound_links: [],
        linking_strategies: {
          hub_spoke: hubSpokeLinks[contentId] || null,
          lateral: lateralLinks[contentId] || null,
          contextual: contextualLinks[contentId] || null
        }
      };

      // Combine outbound links from all strategies
      if (hubSpokeLinks[contentId]?.outbound_links) {
        combinedStrategy[contentId].outbound_links.push(...hubSpokeLinks[contentId].outbound_links);
      }

      if (lateralLinks[contentId]?.lateral_links) {
        combinedStrategy[contentId].outbound_links.push(...lateralLinks[contentId].lateral_links);
      }

      if (contextualLinks[contentId]?.contextual_opportunities) {
        const contextualAsLinks = contextualLinks[contentId].contextual_opportunities.map(opp => ({
          target_content_id: opp.target_content.id,
          target_url: opp.target_content.slug || `/${opp.target_content.id}`,
          anchor_text: opp.suggested_anchor_text,
          link_type: 'contextual',
          relevance_score: opp.relevance_score,
          context_hint: opp.context_hint
        }));
        combinedStrategy[contentId].outbound_links.push(...contextualAsLinks);
      }

      // Remove duplicates and apply linking rules
      combinedStrategy[contentId].outbound_links = this.optimizeLinkingPlan(
        combinedStrategy[contentId].outbound_links
      );
    }

    return combinedStrategy;
  }

  // Generate specific linking recommendations
  async generateLinkingRecommendations(interlinkingMap, contentPieces) {
    console.log('📋 Generating linking recommendations...');
    
    const recommendations = [];

    for (const [contentId, linkingPlan] of Object.entries(interlinkingMap)) {
      const contentPiece = contentPieces.find(p => p.id === contentId);
      if (!contentPiece) continue;

      for (const link of linkingPlan.outbound_links) {
        recommendations.push({
          source_content: {
            id: contentId,
            title: contentPiece.title,
            type: contentPiece.type
          },
          target_content: {
            id: link.target_content_id,
            url: link.target_url
          },
          link_details: {
            anchor_text: link.anchor_text,
            link_type: link.link_type,
            relevance_score: link.relevance_score,
            placement_suggestion: this.suggestLinkPlacement(contentPiece, link),
            seo_value: this.calculateLinkSEOValue(link, contentPiece)
          },
          implementation: {
            method: 'contextual_insertion',
            priority: link.relevance_score > 0.7 ? 'high' : 'medium',
            estimated_effort: 'low'
          }
        });
      }
    }

    return recommendations.sort((a, b) => b.link_details.seo_value - a.link_details.seo_value);
  }

  // Insert contextual link into content
  async insertContextualLink(content, linkRecommendation, contentMetadata) {
    try {
      const anchorText = linkRecommendation.anchor_text;
      const targetUrl = linkRecommendation.target_url;
      
      // Find the best position to insert the link
      const insertionPoint = this.findBestInsertionPoint(content, anchorText, linkRecommendation);
      
      if (!insertionPoint.found) {
        return {
          success: false,
          reason: 'No suitable insertion point found',
          content: content
        };
      }

      // Create the link HTML
      const linkHtml = `<a href="${targetUrl}" title="${linkRecommendation.title || anchorText}">${anchorText}</a>`;
      
      // Insert the link
      const beforeText = content.substring(0, insertionPoint.position);
      const afterText = content.substring(insertionPoint.position + anchorText.length);
      const modifiedContent = beforeText + linkHtml + afterText;

      // Validate the modification
      const isValid = this.validateLinkInsertion(modifiedContent, linkRecommendation);
      
      if (!isValid) {
        return {
          success: false,
          reason: 'Link insertion validation failed',
          content: content
        };
      }

      return {
        success: true,
        content: modifiedContent,
        position: insertionPoint.position,
        context: this.extractLinkContext(modifiedContent, insertionPoint.position)
      };

    } catch (error) {
      return {
        success: false,
        reason: error.message,
        content: content
      };
    }
  }

  // Helper methods for analysis and optimization

  calculateSemanticSimilarity(content1, content2) {
    // Simplified semantic similarity calculation
    const keywords1 = (content1.target_keyword || '').toLowerCase().split(' ');
    const keywords2 = (content2.target_keyword || '').toLowerCase().split(' ');
    
    const intersection = keywords1.filter(k => keywords2.includes(k));
    const union = [...new Set([...keywords1, ...keywords2])];
    
    return union.length > 0 ? intersection.length / union.length : 0;
  }

  calculateKeywordOverlap(content1, content2) {
    const text1 = `${content1.title} ${content1.brief || ''}`.toLowerCase();
    const text2 = `${content2.title} ${content2.brief || ''}`.toLowerCase();
    
    const words1 = text1.split(' ').filter(w => w.length > 3);
    const words2 = text2.split(' ').filter(w => w.length > 3);
    
    const intersection = words1.filter(w => words2.includes(w));
    const union = [...new Set([...words1, ...words2])];
    
    return {
      overlap_ratio: union.length > 0 ? intersection.length / union.length : 0,
      common_words: intersection,
      total_unique_words: union.length
    };
  }

  analyzeTopicHierarchy(contentPieces) {
    const hierarchy = {
      pillar: [],
      supporting: [],
      rapid: []
    };

    contentPieces.forEach(piece => {
      if (hierarchy[piece.type]) {
        hierarchy[piece.type].push({
          id: piece.id,
          title: piece.title,
          keyword: piece.target_keyword,
          authority_score: this.calculateAuthorityScore(piece)
        });
      }
    });

    return hierarchy;
  }

  analyzeUserJourneyFlow(contentPieces) {
    // Simplified user journey analysis
    const journeyStages = {
      awareness: contentPieces.filter(p => p.type === 'rapid'),
      consideration: contentPieces.filter(p => p.type === 'supporting'),
      decision: contentPieces.filter(p => p.type === 'pillar')
    };

    return {
      stages: journeyStages,
      flow_recommendations: this.generateJourneyFlowRecommendations(journeyStages)
    };
  }

  findRelevantContent(sourceContent, candidateContent, relationships, maxLinks) {
    return candidateContent
      .map(candidate => ({
        content: candidate,
        relevance: this.calculateRelevanceScore(sourceContent, candidate, relationships)
      }))
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, maxLinks)
      .map(item => item.content);
  }

  calculateRelevanceScore(content1, content2, relationships) {
    const relationshipKey = `${content1.id}_${content2.id}`;
    const reverseKey = `${content2.id}_${content1.id}`;
    
    const semanticSimilarity = relationships.semantic_similarity[relationshipKey] || 
                              relationships.semantic_similarity[reverseKey] || 0;
    const keywordOverlap = relationships.keyword_overlap[relationshipKey]?.overlap_ratio || 
                          relationships.keyword_overlap[reverseKey]?.overlap_ratio || 0;
    
    // Weight different factors
    return (semanticSimilarity * 0.6) + (keywordOverlap * 0.4);
  }

  async generateLinkRecommendation(sourceContent, targetContent, linkType, relationships) {
    const relevanceScore = this.calculateRelevanceScore(sourceContent, targetContent, relationships);
    
    return {
      target_content_id: targetContent.id,
      target_url: targetContent.slug || `/${targetContent.id}`,
      anchor_text: this.generateAnchorText(targetContent),
      link_type: linkType,
      relevance_score: relevanceScore,
      seo_value: this.calculateLinkSEOValue({ relevance_score: relevanceScore }, sourceContent),
      placement_priority: relevanceScore > 0.7 ? 'high' : 'medium'
    };
  }

  generateAnchorText(targetContent, keyword = null) {
    if (keyword) {
      return keyword;
    }
    
    // Generate natural anchor text from target content
    const title = targetContent.title;
    const targetKeyword = targetContent.target_keyword;
    
    // Prefer shorter, more natural anchor text
    if (targetKeyword.length <= 30) {
      return targetKeyword;
    } else if (title.length <= 40) {
      return title;
    } else {
      return title.substring(0, 37) + '...';
    }
  }

  optimizeLinkingPlan(links) {
    // Remove duplicates
    const uniqueLinks = links.filter((link, index, self) => 
      index === self.findIndex(l => l.target_content_id === link.target_content_id)
    );

    // Sort by relevance and SEO value
    const sortedLinks = uniqueLinks.sort((a, b) => {
      const scoreA = (a.relevance_score || 0) + (a.seo_value || 0);
      const scoreB = (b.relevance_score || 0) + (b.seo_value || 0);
      return scoreB - scoreA;
    });

    // Apply linking rules
    return sortedLinks.slice(0, this.linkingRules.max_links_per_content);
  }

  findBestInsertionPoint(content, anchorText, linkRecommendation) {
    // Find exact match first
    const exactMatch = content.indexOf(anchorText);
    if (exactMatch !== -1) {
      return {
        found: true,
        position: exactMatch,
        method: 'exact_match'
      };
    }

    // Find partial matches or similar phrases
    const words = anchorText.toLowerCase().split(' ');
    const contentLower = content.toLowerCase();
    
    for (const word of words) {
      if (word.length > 3) {
        const wordIndex = contentLower.indexOf(word);
        if (wordIndex !== -1) {
          return {
            found: true,
            position: wordIndex,
            method: 'partial_match',
            matched_word: word
          };
        }
      }
    }

    return {
      found: false,
      reason: 'No suitable insertion point found'
    };
  }

  calculateLinkDensity(content) {
    const links = (content.match(/<a[^>]*>.*?<\/a>/gi) || []).length;
    const words = content.split(/\s+/).length;
    return ((links / words) * 100).toFixed(2);
  }

  countInternalLinks(content) {
    return (content.match(/<a[^>]*>.*?<\/a>/gi) || []).length;
  }

  validateLinkInsertion(content, linkRecommendation) {
    const linkDensity = parseFloat(this.calculateLinkDensity(content));
    return linkDensity <= this.linkingRules.link_density_max;
  }

  analyzeSEOImpact(interlinkingMap, contentPieces) {
    const impact = {
      total_internal_links: 0,
      average_links_per_page: 0,
      link_equity_distribution: {},
      authority_flow_analysis: {},
      estimated_seo_improvement: 0
    };

    let totalLinks = 0;
    const linkCounts = {};

    // Calculate link statistics
    Object.values(interlinkingMap).forEach(plan => {
      const linkCount = plan.outbound_links?.length || 0;
      totalLinks += linkCount;
      linkCounts[plan.content_id] = linkCount;
    });

    impact.total_internal_links = totalLinks;
    impact.average_links_per_page = totalLinks / Object.keys(interlinkingMap).length;

    // Estimate SEO improvement
    impact.estimated_seo_improvement = this.estimateSEOImprovement(interlinkingMap, contentPieces);

    return impact;
  }

  createImplementationGuide(interlinkingMap, recommendations) {
    return {
      overview: 'Automated interlinking implementation guide',
      total_links_to_implement: recommendations.length,
      implementation_steps: [
        'Review and approve linking recommendations',
        'Apply high-priority contextual links first',
        'Implement hub-and-spoke structure',
        'Add lateral linking between similar content',
        'Monitor link density and user experience',
        'Track SEO performance improvements'
      ],
      best_practices: [
        'Use natural, descriptive anchor text',
        'Maintain optimal link density (1-3%)',
        'Prioritize user experience over link quantity',
        'Regularly audit and update internal links',
        'Monitor click-through rates on internal links'
      ],
      automation_notes: 'Links can be automatically inserted using the provided recommendations and insertion points'
    };
  }

  // Additional helper methods
  calculateHubScore(content, allContent) {
    return content.type === 'pillar' ? 0.9 : content.type === 'supporting' ? 0.6 : 0.3;
  }

  calculateAuthorityScore(content) {
    const typeScores = { pillar: 0.9, supporting: 0.6, rapid: 0.3 };
    return typeScores[content.type] || 0.3;
  }

  suggestLinkPlacement(content, link) {
    return link.relevance_score > 0.8 ? 'early_in_content' : 'contextually_relevant_section';
  }

  calculateLinkSEOValue(link, sourceContent) {
    return (link.relevance_score || 0.5) * 10; // Scale to 0-10
  }

  assessLinkingSEOImpact(addedLinks, contentMetadata) {
    return {
      links_added: addedLinks.length,
      estimated_authority_boost: addedLinks.length * 2, // Simplified calculation
      user_experience_impact: 'positive'
    };
  }

  extractLinkContext(content, position) {
    const start = Math.max(0, position - this.linkingRules.contextual_window);
    const end = Math.min(content.length, position + this.linkingRules.contextual_window);
    return content.substring(start, end);
  }

  estimateSEOImprovement(interlinkingMap, contentPieces) {
    const totalLinks = Object.values(interlinkingMap)
      .reduce((sum, plan) => sum + (plan.outbound_links?.length || 0), 0);
    
    // Simplified SEO improvement estimation
    return Math.min(25, totalLinks * 2); // Cap at 25% improvement
  }

  generateJourneyFlowRecommendations(journeyStages) {
    return [
      'Link awareness content to consideration stage',
      'Connect consideration content to decision-making resources',
      'Create circular linking within each stage',
      'Implement progressive information architecture'
    ];
  }

  findSimilarContent(content, candidates, relationships, maxSimilar) {
    return candidates
      .map(candidate => ({
        content: candidate,
        similarity: this.calculateRelevanceScore(content, candidate, relationships)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, maxSimilar)
      .filter(item => item.similarity > 0.3) // Minimum similarity threshold
      .map(item => item.content);
  }

  analyzeContentTypeRelationships(contentPieces) {
    const relationships = {};
    
    contentPieces.forEach(piece => {
      if (!relationships[piece.type]) {
        relationships[piece.type] = [];
      }
      relationships[piece.type].push(piece.id);
    });

    return relationships;
  }
}

export default AutoInterlinkingEngine;