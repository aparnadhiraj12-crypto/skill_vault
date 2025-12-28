import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Download, Share2, FileText, CheckCircle2, TrendingUp } from 'lucide-react';
import { useAnalysisStore } from '@/store/analysisStore';

export default function ExportPage() {
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);
  const { analysis, retailerName, placementName } = useAnalysisStore();

  useEffect(() => {
    if (!analysis) {
      navigate('/upload');
      return;
    }
  }, [analysis, navigate]);

  if (!analysis) {
    return null;
  }

  const confidenceScore = analysis.riskAnalysis.score;

  const handleDownload = async (format: 'pdf' | 'json') => {
    setIsExporting(true);
    
    // Create comprehensive report
    const reportData = {
      metadata: {
        retailer: retailerName,
        placement: placementName,
        timestamp: new Date().toISOString(),
        confidenceScore: analysis.riskAnalysis.score,
      },
      analysis: {
        designMetrics: analysis.designMetrics,
        complianceChecks: analysis.complianceChecks,
        riskAnalysis: analysis.riskAnalysis,
      },
      suggestions: analysis.suggestions,
      placementSimulations: analysis.placementSimulations,
      heatmapData: analysis.heatmapData,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `validation-report-${Date.now()}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    
    setIsExporting(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Creative Validation Report',
          text: `Validation Score: ${confidenceScore}/100 - ${analysis.riskAnalysis.label}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 90) return 'limegreen';
    if (score >= 75) return 'brightblue';
    if (score >= 60) return 'pastelpink';
    return 'destructive';
  };

  const getConfidenceLabel = (score: number) => {
    if (score >= 90) return 'High Confidence';
    if (score >= 75) return 'Good Confidence';
    if (score >= 60) return 'Moderate Confidence';
    return 'Low Confidence';
  };

  return (
    <div className="min-h-screen bg-primary">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="max-w-[100rem] mx-auto px-6">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="mb-6">
              <span className="font-paragraph text-sm uppercase tracking-widest text-brightblue">
                Step 04
              </span>
            </div>
            <h1 className="font-heading text-6xl md:text-8xl font-black text-primary-foreground mb-4">
              Export &
              <br />
              <span className="text-limegreen">Report</span>
            </h1>
            <p className="font-paragraph text-xl text-softgray max-w-3xl mx-auto">
              Download your validation report and share results with your team
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Confidence Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 bg-gradient-to-br from-secondary to-primary p-12 text-center"
            >
              <div className="mb-8">
                <h2 className="font-heading text-3xl font-bold text-primary-foreground mb-2">
                  Validation Confidence
                </h2>
                <p className="font-paragraph text-sm text-softgray">
                  Based on AI analysis and design metrics
                </p>
              </div>

              <div className="mb-8">
                <div className={`font-heading text-9xl font-black text-${getConfidenceColor(confidenceScore)} mb-4`}>
                  {confidenceScore}
                </div>
                <div className={`inline-block bg-${getConfidenceColor(confidenceScore)} px-8 py-3 mb-6`}>
                  <p className="font-heading text-xl font-bold text-secondary-foreground">
                    {getConfidenceLabel(confidenceScore)}
                  </p>
                </div>
                <p className="font-paragraph text-base text-softgray max-w-2xl mx-auto">
                  {analysis.riskAnalysis.recommendation}
                </p>
              </div>

              {/* Metrics Summary */}
              <div className="grid grid-cols-2 gap-6 max-w-3xl mx-auto">
                <div className="bg-primary/50 p-6">
                  <div className="font-heading text-4xl font-black text-limegreen mb-2">
                    {analysis.designMetrics.compliance}
                  </div>
                  <p className="font-paragraph text-xs uppercase tracking-wider text-softgray">
                    Compliance
                  </p>
                </div>
                <div className="bg-primary/50 p-6">
                  <div className="font-heading text-4xl font-black text-brightblue mb-2">
                    {analysis.designMetrics.attention}
                  </div>
                  <p className="font-paragraph text-xs uppercase tracking-wider text-softgray">
                    Attention
                  </p>
                </div>
                <div className="bg-primary/50 p-6">
                  <div className="font-heading text-4xl font-black text-pastelpink mb-2">
                    {analysis.designMetrics.readability}
                  </div>
                  <p className="font-paragraph text-xs uppercase tracking-wider text-softgray">
                    Readability
                  </p>
                </div>
                <div className="bg-primary/50 p-6">
                  <div className="font-heading text-4xl font-black text-limegreen mb-2">
                    {analysis.designMetrics.brandConsistency}
                  </div>
                  <p className="font-paragraph text-xs uppercase tracking-wider text-softgray">
                    Brand
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Export Options */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-secondary/10 p-6 border-2 border-secondary">
                <h3 className="font-heading text-2xl font-bold text-primary-foreground mb-6">
                  Export Options
                </h3>

                <div className="space-y-4">
                  <button
                    onClick={() => handleDownload('pdf')}
                    disabled={isExporting}
                    className="w-full bg-limegreen hover:bg-limegreen/90 disabled:bg-softgray disabled:cursor-not-allowed text-secondary-foreground font-heading text-base font-bold px-6 py-4 transition-all flex items-center justify-between group"
                  >
                    <span className="flex items-center gap-3">
                      <Download className="w-5 h-5" />
                      {isExporting ? 'Generating...' : 'Download PDF'}
                    </span>
                    <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </button>

                  <button
                    onClick={() => handleDownload('json')}
                    disabled={isExporting}
                    className="w-full bg-brightblue hover:bg-brightblue/90 disabled:bg-softgray disabled:cursor-not-allowed text-secondary-foreground font-heading text-base font-bold px-6 py-4 transition-all flex items-center justify-between group"
                  >
                    <span className="flex items-center gap-3">
                      <Download className="w-5 h-5" />
                      {isExporting ? 'Generating...' : 'Download JSON'}
                    </span>
                    <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </button>

                  <button
                    onClick={handleShare}
                    className="w-full bg-secondary hover:bg-secondary/90 text-primary-foreground font-heading text-base font-bold px-6 py-4 transition-all flex items-center justify-between group"
                  >
                    <span className="flex items-center gap-3">
                      <Share2 className="w-5 h-5" />
                      Share Report
                    </span>
                    <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Report Summary */}
              <div className="bg-primary/50 p-6 border-l-4 border-limegreen">
                <h4 className="font-heading text-lg font-bold text-primary-foreground mb-4">
                  Report Includes
                </h4>
                <ul className="space-y-3">
                  <li className="font-paragraph text-sm text-softgray flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-limegreen mt-0.5 flex-shrink-0" />
                    Complete simulation results
                  </li>
                  <li className="font-paragraph text-sm text-softgray flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-limegreen mt-0.5 flex-shrink-0" />
                    All AI-generated suggestions
                  </li>
                  <li className="font-paragraph text-sm text-softgray flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-limegreen mt-0.5 flex-shrink-0" />
                    Compliance checklist
                  </li>
                  <li className="font-paragraph text-sm text-softgray flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-limegreen mt-0.5 flex-shrink-0" />
                    Confidence score breakdown
                  </li>
                  <li className="font-paragraph text-sm text-softgray flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-limegreen mt-0.5 flex-shrink-0" />
                    Timestamp and metadata
                  </li>
                </ul>
              </div>

              {/* Next Steps */}
              <div className="bg-secondary/20 p-6">
                <h4 className="font-heading text-lg font-bold text-primary-foreground mb-4">
                  Next Steps
                </h4>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/upload')}
                    className="w-full bg-primary/50 hover:bg-primary/70 text-primary-foreground font-paragraph text-sm font-semibold px-4 py-3 border border-secondary/30 transition-all text-left"
                  >
                    Validate Another Creative
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="w-full bg-primary/50 hover:bg-primary/70 text-primary-foreground font-paragraph text-sm font-semibold px-4 py-3 border border-secondary/30 transition-all text-left"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 bg-gradient-to-r from-secondary/20 to-transparent p-8 border-l-4 border-brightblue"
          >
            <div className="flex items-start gap-4">
              <TrendingUp className="w-8 h-8 text-brightblue flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-heading text-2xl font-bold text-primary-foreground mb-3">
                  Pro Tip
                </h3>
                <p className="font-paragraph text-base text-softgray">
                  Save your validation reports for future reference. They can help you understand patterns in rejections and improve your creative process over time. Share reports with your team to align on best practices.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
