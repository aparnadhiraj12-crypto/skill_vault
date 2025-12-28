# AI Implementation Guide - Retail Creative Validator

## Overview

This document explains the real AI features implemented using OpenAI's Vision API and GPT-4 for comprehensive retail creative validation.

## Features Implemented

### 1. **Retail Reviewer Simulation**
- **Technology**: OpenAI Vision API (gpt-4-vision-preview)
- **Functionality**: Analyzes creative images for compliance with retailer guidelines
- **Checks**:
  - Brand logo placement and sizing
  - Text readability and contrast ratios (WCAG standards)
  - Legal disclaimer presence
  - Dimension compliance
  - Color contrast analysis
  - Visual hierarchy
  - Call-to-action prominence
  - Product visibility

**Output**: Compliance checklist with pass/warning/fail status for each item

### 2. **Real Placement Simulation**
- **Technology**: GPT-4 text analysis
- **Functionality**: Simulates how the creative appears in different retail contexts
- **Contexts Analyzed**:
  - Shelf edge displays
  - Endcap placements
  - Digital displays
  - Various viewing distances and angles

**Output**: 3 placement scenarios with descriptions and optimization recommendations

### 3. **Attention Heatmap (Eye-Tracking Prediction)**
- **Technology**: GPT-4 + SVG visualization
- **Functionality**: Predicts viewer attention zones using eye-tracking prediction models
- **Analysis Factors**:
  - Text prominence and size
  - Color contrast and saturation
  - Logo placement
  - CTA button location
  - Product imagery
  - Visual weight and movement

**Output**: Interactive heatmap with intensity zones and focus areas

### 4. **Risk Score & Confidence Rating**
- **Technology**: Multi-factor analysis algorithm
- **Calculation**:
  - Average of 4 design metrics (0-100):
    - Compliance score
    - Attention score
    - Readability score
    - Brand consistency score
  - Penalty system for identified risk factors (-5 points per factor)
  - Final score: 0-100

**Score Interpretation**:
- 90+: Excellent - Ready for submission
- 75-89: Good - Likely to pass review
- 60-74: Fair - Apply critical suggestions
- <60: Needs Work - Significant improvements needed

### 5. **AI-Generated Suggestions**
- **Technology**: OpenAI Vision API analysis
- **Categories**:
  - Compliance (critical/warning/info)
  - Design (critical/warning/info)
  - Optimization (warning/info)
  - Brand (warning/info)

**Output**: Actionable suggestions with severity levels and detailed descriptions

## Setup Instructions

### 1. **Get OpenAI API Key**

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Sign up or log in
3. Navigate to API keys section
4. Create a new API key
5. Copy the key (you won't be able to see it again)

### 2. **Configure Environment Variables**

Create a `.env.local` file in the project root:

```env
PUBLIC_OPENAI_API_KEY=sk-your-api-key-here
```

**Important**: The `PUBLIC_` prefix is required for Vite to expose this to the browser.

### 3. **Verify Configuration**

The app will automatically:
- Check for the API key on startup
- Fall back to mock analysis if key is missing
- Log warnings to console if key is not configured

## Architecture

### File Structure

```
/src
├── services/
│   └── aiService.ts          # OpenAI API integration
├── store/
│   └── analysisStore.ts      # Zustand state management
└── components/pages/
    ├── UploadPage.tsx        # File upload & AI trigger
    ├── SimulationPage.tsx    # Real-time analysis display
    ├── SuggestionsPage.tsx   # AI suggestions
    └── ExportPage.tsx        # Report generation
```

### Data Flow

```
1. User uploads creative → UploadPage
   ↓
2. AI analysis triggered → aiService.analyzeCreative()
   ↓
3. OpenAI Vision API processes image
   ├─ Compliance analysis
   ├─ Design metrics
   ├─ Risk factors
   └─ Suggestions
   ↓
4. GPT-4 generates:
   ├─ Heatmap predictions
   ├─ Placement simulations
   └─ Additional insights
   ↓
5. Results stored in Zustand → analysisStore
   ↓
6. SimulationPage displays results
   ↓
7. User reviews suggestions → SuggestionsPage
   ↓
8. Export report → ExportPage
```

## Setup & Configuration

### Environment Variables

Create `.env.local` in project root:

```env
PUBLIC_OPENAI_API_KEY=sk-your-api-key-here
```

### Cost Considerations

- **Vision API**: ~$0.01 per image
- **GPT-4**: ~$0.02-0.03 per analysis
- **Total per creative**: ~$0.05

## Fallback Behavior

If OpenAI API key is not configured:
- Mock analysis is generated automatically
- App continues to function normally
- Console warning notifies developer
- All features work with sample data

## Testing

### Manual Testing Checklist

- [ ] Upload valid image file
- [ ] Verify AI analysis completes
- [ ] Check compliance checklist displays
- [ ] Verify heatmap visualization renders
- [ ] Check placement simulations show
- [ ] Verify risk score calculation
- [ ] Test suggestion generation
- [ ] Export report as JSON
- [ ] Share report functionality
- [ ] Test with mock data (no API key)

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| "API key not configured" | Add `PUBLIC_OPENAI_API_KEY` to `.env.local` |
| "Invalid API key" | Verify key is correct and has API access |
| "Rate limit exceeded" | Wait a few minutes before retrying |
| "Image too large" | Compress image before upload |

## Support

- **OpenAI Docs**: https://platform.openai.com/docs
- **Vision API**: https://platform.openai.com/docs/guides/vision
- **Status Page**: https://status.openai.com
