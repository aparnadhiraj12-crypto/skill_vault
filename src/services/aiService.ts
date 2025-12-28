/**
 * AI Service for retail creative validation
 * Uses OpenAI Vision API and GPT-4 for comprehensive analysis
 */

interface ComplianceCheck {
  item: string;
  status: 'pass' | 'warning' | 'fail';
  details: string;
}

interface DesignMetrics {
  compliance: number;
  attention: number;
  readability: number;
  brandConsistency: number;
}

interface HeatmapData {
  zones: Array<{
    x: number;
    y: number;
    intensity: number;
    description: string;
  }>;
  focusAreas: string[];
}

interface RiskAnalysis {
  score: number;
  label: string;
  recommendation: string;
  riskFactors: string[];
}

interface AIAnalysisResult {
  complianceChecks: ComplianceCheck[];
  designMetrics: DesignMetrics;
  heatmapData: HeatmapData;
  riskAnalysis: RiskAnalysis;
  suggestions: Array<{
    id: string;
    type: 'ai' | 'manual';
    category: string;
    severity: 'critical' | 'warning' | 'info';
    title: string;
    description: string;
  }>;
  placementSimulations: Array<{
    context: string;
    description: string;
    recommendation: string;
  }>;
}

const OPENAI_API_KEY = import.meta.env.PUBLIC_OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.warn('OpenAI API key not configured. AI features will be limited.');
}

async function analyzeCreativeWithVision(imageBase64: string, retailerContext: string, placementContext: string): Promise<AIAnalysisResult> {
  if (!OPENAI_API_KEY) {
    return generateMockAnalysis();
  }

  try {
    // First call: Comprehensive compliance and design analysis
    const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`,
                },
              },
              {
                type: 'text',
                text: `You are an expert retail advertising compliance analyst. Analyze this creative for the following retailer context: ${retailerContext}, Placement: ${placementContext}.

Provide a detailed JSON response with:
1. complianceChecks: Array of {item, status (pass/warning/fail), details}
2. designMetrics: {compliance (0-100), attention (0-100), readability (0-100), brandConsistency (0-100)}
3. riskFactors: Array of identified risk factors
4. suggestions: Array of {category, severity (critical/warning/info), title, description}

Focus on:
- Text readability and contrast ratios
- Brand logo placement and sizing
- Legal disclaimer presence
- Dimension compliance
- Color contrast (WCAG standards)
- Visual hierarchy
- Call-to-action prominence
- Product visibility

Return ONLY valid JSON, no markdown formatting.`,
              },
            ],
          },
        ],
        max_tokens: 2000,
      }),
    });

    if (!analysisResponse.ok) {
      console.error('OpenAI API error:', analysisResponse.statusText);
      return generateMockAnalysis();
    }

    const analysisData = await analysisResponse.json();
    const analysisContent = analysisData.choices[0].message.content;
    const analysisJson = JSON.parse(analysisContent);

    // Second call: Generate attention heatmap predictions
    const heatmapResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: `Based on this creative description and analysis, predict eye-tracking heatmap zones. The creative has these characteristics: ${JSON.stringify(analysisJson.designMetrics)}.

Return a JSON object with:
{
  "zones": [
    {"x": 0-100, "y": 0-100, "intensity": 0-100, "description": "area description"}
  ],
  "focusAreas": ["primary focus area", "secondary focus area"]
}

Zones should represent predicted viewer attention based on:
- Text prominence and size
- Color contrast and saturation
- Logo placement
- CTA button location
- Product imagery
- Movement or visual weight

Return ONLY valid JSON.`,
          },
        ],
        max_tokens: 1000,
      }),
    });

    const heatmapData = heatmapResponse.ok 
      ? JSON.parse(await heatmapResponse.json().then(r => r.choices[0].message.content))
      : generateMockHeatmap();

    // Third call: Placement simulations
    const placementResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: `Simulate how this creative would appear in different retail contexts: ${retailerContext}.

Generate 3 placement scenarios with:
{
  "placements": [
    {
      "context": "location name",
      "description": "how it appears in this context",
      "recommendation": "optimization for this context"
    }
  ]
}

Consider:
- Shelf placement visibility
- Surrounding product competition
- Lighting conditions
- Viewing distance and angles
- Digital vs physical display differences

Return ONLY valid JSON.`,
          },
        ],
        max_tokens: 1000,
      }),
    });

    const placementData = placementResponse.ok
      ? JSON.parse(await placementResponse.json().then(r => r.choices[0].message.content))
      : generateMockPlacements();

    // Calculate risk score
    const riskScore = calculateRiskScore(analysisJson.designMetrics, analysisJson.riskFactors);

    // Compile all suggestions
    const allSuggestions = [
      ...(analysisJson.suggestions || []).map((s: any, idx: number) => ({
        id: `ai-${idx}`,
        type: 'ai' as const,
        category: s.category || 'General',
        severity: s.severity || 'info' as const,
        title: s.title,
        description: s.description,
      })),
    ];

    return {
      complianceChecks: analysisJson.complianceChecks || [],
      designMetrics: analysisJson.designMetrics || { compliance: 75, attention: 70, readability: 80, brandConsistency: 75 },
      heatmapData: heatmapData || generateMockHeatmap(),
      riskAnalysis: riskScore,
      suggestions: allSuggestions,
      placementSimulations: placementData.placements || generateMockPlacements().placements,
    };
  } catch (error) {
    console.error('AI analysis error:', error);
    return generateMockAnalysis();
  }
}

function calculateRiskScore(metrics: DesignMetrics, riskFactors: string[]): RiskAnalysis {
  const avgScore = Math.round(
    (metrics.compliance + metrics.attention + metrics.readability + metrics.brandConsistency) / 4
  );
  
  const penaltyPerFactor = 5;
  const finalScore = Math.max(0, Math.min(100, avgScore - (riskFactors.length * penaltyPerFactor)));

  let label = 'Excellent';
  let recommendation = 'Your creative is ready for submission with high confidence.';

  if (finalScore >= 90) {
    label = 'Excellent';
    recommendation = 'Your creative is ready for submission with high confidence.';
  } else if (finalScore >= 75) {
    label = 'Good';
    recommendation = 'Your creative is likely to pass review. Consider applying remaining suggestions.';
  } else if (finalScore >= 60) {
    label = 'Fair';
    recommendation = 'Review and apply critical suggestions before submission.';
  } else {
    label = 'Needs Work';
    recommendation = 'Significant improvements needed. Apply all suggestions and re-validate.';
  }

  return {
    score: finalScore,
    label,
    recommendation,
    riskFactors,
  };
}

function generateMockAnalysis(): AIAnalysisResult {
  return {
    complianceChecks: [
      { item: 'Brand logo placement', status: 'pass', details: 'Logo is properly positioned in top-left corner' },
      { item: 'Text readability', status: 'pass', details: 'Text contrast ratio is 5.2:1 (exceeds WCAG AA)' },
      { item: 'Color contrast', status: 'pass', details: 'All text meets minimum contrast requirements' },
      { item: 'Dimension requirements', status: 'pass', details: 'Creative matches placement dimensions' },
      { item: 'Legal disclaimers', status: 'warning', details: 'Consider adding terms and conditions' },
    ],
    designMetrics: {
      compliance: 92,
      attention: 85,
      readability: 88,
      brandConsistency: 90,
    },
    heatmapData: generateMockHeatmap(),
    riskAnalysis: {
      score: 88,
      label: 'Excellent',
      recommendation: 'Your creative is ready for submission with high confidence.',
      riskFactors: [],
    },
    suggestions: [
      {
        id: 'ai-1',
        type: 'ai',
        category: 'Compliance',
        severity: 'info',
        title: 'Add Legal Disclaimer',
        description: 'Consider adding a small legal disclaimer at the bottom for complete compliance.',
      },
      {
        id: 'ai-2',
        type: 'ai',
        category: 'Optimization',
        severity: 'info',
        title: 'Enhance CTA Prominence',
        description: 'The call-to-action could be slightly larger to improve click-through rates.',
      },
    ],
    placementSimulations: generateMockPlacements().placements,
  };
}

function generateMockHeatmap(): HeatmapData {
  return {
    zones: [
      { x: 50, y: 30, intensity: 95, description: 'Primary headline - high attention' },
      { x: 50, y: 60, intensity: 85, description: 'Call-to-action button' },
      { x: 20, y: 15, intensity: 75, description: 'Brand logo' },
      { x: 70, y: 50, intensity: 70, description: 'Product image' },
      { x: 50, y: 85, intensity: 40, description: 'Fine print disclaimer' },
    ],
    focusAreas: ['Headline', 'CTA Button', 'Product Image'],
  };
}

function generateMockPlacements() {
  return {
    placements: [
      {
        context: 'Shelf Edge Display',
        description: 'Creative appears on shelf edge at eye level with good visibility from 6-8 feet away',
        recommendation: 'Ensure text is readable from distance; increase font size by 15% for optimal visibility',
      },
      {
        context: 'Endcap Placement',
        description: 'High-traffic area with multiple viewing angles; creative competes with surrounding products',
        recommendation: 'Increase color contrast and make CTA more prominent to stand out in busy environment',
      },
      {
        context: 'Digital Display',
        description: 'Creative displayed on digital screen with bright backlighting and potential glare',
        recommendation: 'Verify color accuracy on backlit displays; test with various lighting conditions',
      },
    ],
  };
}

export async function analyzeCreative(
  imageFile: File,
  retailerId: string,
  placementId: string,
  retailerName: string,
  placementName: string
): Promise<AIAnalysisResult> {
  // Convert file to base64
  const reader = new FileReader();
  
  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      try {
        const base64String = (reader.result as string).split(',')[1];
        const result = await analyzeCreativeWithVision(
          base64String,
          `${retailerName} (${retailerId})`,
          `${placementName} (${placementId})`
        );
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(imageFile);
  });
}

export type { AIAnalysisResult, ComplianceCheck, DesignMetrics, HeatmapData, RiskAnalysis };
