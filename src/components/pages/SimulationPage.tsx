import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Eye, Layout, Flame, AlertTriangle, ArrowRight } from 'lucide-react';
import { useAnalysisStore } from '@/store/analysisStore';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

type SimulationMode = 'reviewer' | 'placement' | 'heatmap' | 'risk';

export default function SimulationPage() {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState<SimulationMode>('reviewer');
  const { analysis, isLoading } = useAnalysisStore();

  useEffect(() => {
    if (!analysis && !isLoading) {
      navigate('/upload');
    }
  }, [analysis, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  const modes = [
    {
      id: 'reviewer' as SimulationMode,
      title: 'Retail Reviewer',
      icon: Eye,
      color: 'brightblue',
      description: 'Simulates how retail compliance teams evaluate your creative',
    },
    {
      id: 'placement' as SimulationMode,
      title: 'Real Placement',
      icon: Layout,
      color: 'limegreen',
      description: 'Preview your ad in actual retail placement contexts',
    },
    {
      id: 'heatmap' as SimulationMode,
      title: 'Attention Heatmap',
      icon: Flame,
      color: 'pastelpink',
      description: 'Visualize where viewers focus on your creative',
    },
    {
      id: 'risk' as SimulationMode,
      title: 'Risk Score',
      icon: AlertTriangle,
      color: 'softgray',
      description: 'Get confidence ratings before submission',
    },
  ];

  const getRiskColor = (score: number) => {
    if (score >= 90) return 'limegreen';
    if (score >= 75) return 'brightblue';
    if (score >= 60) return 'pastelpink';
    return 'destructive';
  };

  const getRiskLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Work';
  };

  const riskScore = analysis.riskAnalysis.score;

  return (
    <div className="min-h-screen bg-primary">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="max-w-[120rem] mx-auto px-6">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="mb-6">
              <span className="font-paragraph text-sm uppercase tracking-widest text-brightblue">
                Step 02
              </span>
            </div>
            <h1 className="font-heading text-6xl md:text-8xl font-black text-primary-foreground mb-4">
              Simulation
              <br />
              <span className="text-limegreen">Dashboard</span>
            </h1>
            <p className="font-paragraph text-xl text-softgray max-w-3xl">
              AI-powered analysis of your creative
            </p>
          </motion.div>

          {/* Mode Selector */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {modes.map((mode, index) => (
              <motion.button
                key={mode.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => setActiveMode(mode.id)}
                className={`p-6 text-left transition-all ${
                  activeMode === mode.id
                    ? `bg-${mode.color} border-2 border-${mode.color}`
                    : 'bg-secondary/20 border-2 border-transparent hover:border-secondary'
                }`}
              >
                <mode.icon className={`w-8 h-8 mb-4 ${
                  activeMode === mode.id ? 'text-secondary-foreground' : 'text-primary-foreground'
                }`} />
                <h3 className={`font-heading text-lg font-bold mb-2 ${
                  activeMode === mode.id ? 'text-secondary-foreground' : 'text-primary-foreground'
                }`}>
                  {mode.title}
                </h3>
                <p className={`font-paragraph text-xs ${
                  activeMode === mode.id ? 'text-secondary-foreground' : 'text-softgray'
                }`}>
                  {mode.description}
                </p>
              </motion.button>
            ))}
          </div>

          {/* Simulation Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Simulation View */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 bg-secondary/10 p-8"
            >
              <div className="mb-6">
                <h2 className="font-heading text-3xl font-bold text-primary-foreground mb-2">
                  {modes.find(m => m.id === activeMode)?.title}
                </h2>
                <p className="font-paragraph text-sm text-softgray">
                  {modes.find(m => m.id === activeMode)?.description}
                </p>
              </div>

              <div className="bg-softgray aspect-video flex items-center justify-center relative overflow-hidden">
                {activeMode === 'reviewer' && (
                  <div className="absolute inset-0 p-8 overflow-y-auto">
                    <div className="bg-primary/90 p-6 max-w-md">
                      <h3 className="font-heading text-xl font-bold text-limegreen mb-4">
                        Compliance Checklist
                      </h3>
                      <div className="space-y-3">
                        {analysis.complianceChecks.map((check, i) => (
                          <div key={i} className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-paragraph text-sm text-primary-foreground flex-1">
                                {check.item}
                              </span>
                              <span className={`font-paragraph text-xs font-semibold whitespace-nowrap ${
                                check.status === 'pass' ? 'text-limegreen' : check.status === 'warning' ? 'text-pastelpink' : 'text-destructive'
                              }`}>
                                {check.status === 'pass' ? '✓ PASS' : check.status === 'warning' ? '⚠ CHECK' : '✗ FAIL'}
                              </span>
                            </div>
                            <p className="font-paragraph text-xs text-softgray pl-2">
                              {check.details}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeMode === 'placement' && (
                  <div className="absolute inset-0 p-8 overflow-y-auto">
                    <div className="space-y-6">
                      {analysis.placementSimulations.map((placement, idx) => (
                        <div key={idx} className="bg-primary/90 p-6 max-w-md">
                          <h4 className="font-heading text-lg font-bold text-limegreen mb-2">
                            {placement.context}
                          </h4>
                          <p className="font-paragraph text-sm text-primary-foreground mb-3">
                            {placement.description}
                          </p>
                          <p className="font-paragraph text-xs text-brightblue">
                            💡 {placement.recommendation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeMode === 'heatmap' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-full h-full">
                      {/* Heatmap visualization */}
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        {/* Background */}
                        <rect width="100" height="100" fill="#1a1a1a" />
                        
                        {/* Heatmap zones */}
                        {analysis.heatmapData.zones.map((zone, idx) => {
                          const radius = (zone.intensity / 100) * 15;
                          const opacity = zone.intensity / 100;
                          const color = zone.intensity > 80 ? '#DF3131' : zone.intensity > 60 ? '#DDA0DD' : '#6A8EFF';
                          
                          return (
                            <g key={idx}>
                              <circle
                                cx={zone.x}
                                cy={zone.y}
                                r={radius}
                                fill={color}
                                opacity={opacity * 0.6}
                              />
                              <circle
                                cx={zone.x}
                                cy={zone.y}
                                r={radius * 0.6}
                                fill={color}
                                opacity={opacity * 0.3}
                              />
                            </g>
                          );
                        })}
                      </svg>
                      
                      {/* Legend */}
                      <div className="absolute bottom-4 left-4 bg-primary/90 p-4 text-xs text-primary-foreground">
                        <p className="font-heading font-bold mb-2">Focus Areas:</p>
                        <ul className="space-y-1">
                          {analysis.heatmapData.focusAreas.map((area, idx) => (
                            <li key={idx}>• {area}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {activeMode === 'risk' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
                    <div className="text-center">
                      <div className={`font-heading text-9xl font-black text-${getRiskColor(riskScore)} mb-4`}>
                        {riskScore}
                      </div>
                      <p className="font-heading text-3xl font-bold text-primary-foreground mb-2">
                        {getRiskLabel(riskScore)}
                      </p>
                      <p className="font-paragraph text-sm text-softgray mb-6">
                        Confidence Score
                      </p>
                      <p className="font-paragraph text-base text-softgray max-w-md">
                        {analysis.riskAnalysis.recommendation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Insights Panel */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Overall Score */}
              <div className="bg-secondary p-6">
                <h3 className="font-heading text-xl font-bold text-primary-foreground mb-4">
                  Overall Score
                </h3>
                <div className="flex items-end gap-4 mb-4">
                  <div className={`font-heading text-6xl font-black text-${getRiskColor(riskScore)}`}>
                    {riskScore}
                  </div>
                  <div className="pb-2">
                    <p className="font-paragraph text-sm text-primary-foreground">
                      / 100
                    </p>
                  </div>
                </div>
                <div className="w-full bg-primary h-3 mb-2">
                  <div
                    className={`h-full bg-${getRiskColor(riskScore)}`}
                    style={{ width: `${riskScore}%` }}
                  />
                </div>
                <p className="font-paragraph text-xs text-softgray">
                  {getRiskLabel(riskScore)} - {riskScore >= 75 ? 'Ready for submission' : 'Review suggestions'}
                </p>
              </div>

              {/* Key Metrics */}
              <div className="bg-primary/50 p-6 border-2 border-secondary/20">
                <h3 className="font-heading text-lg font-bold text-primary-foreground mb-4">
                  Key Metrics
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-paragraph text-sm text-softgray">Compliance</span>
                      <span className="font-paragraph text-sm font-semibold text-limegreen">{analysis.designMetrics.compliance}%</span>
                    </div>
                    <div className="w-full bg-secondary/20 h-2">
                      <div className="h-full bg-limegreen" style={{ width: `${analysis.designMetrics.compliance}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-paragraph text-sm text-softgray">Attention</span>
                      <span className="font-paragraph text-sm font-semibold text-brightblue">{analysis.designMetrics.attention}%</span>
                    </div>
                    <div className="w-full bg-secondary/20 h-2">
                      <div className="h-full bg-brightblue" style={{ width: `${analysis.designMetrics.attention}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-paragraph text-sm text-softgray">Readability</span>
                      <span className="font-paragraph text-sm font-semibold text-pastelpink">{analysis.designMetrics.readability}%</span>
                    </div>
                    <div className="w-full bg-secondary/20 h-2">
                      <div className="h-full bg-pastelpink" style={{ width: `${analysis.designMetrics.readability}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-paragraph text-sm text-softgray">Brand Consistency</span>
                      <span className="font-paragraph text-sm font-semibold text-limegreen">{analysis.designMetrics.brandConsistency}%</span>
                    </div>
                    <div className="w-full bg-secondary/20 h-2">
                      <div className="h-full bg-limegreen" style={{ width: `${analysis.designMetrics.brandConsistency}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/suggestions')}
                  className="w-full bg-limegreen hover:bg-limegreen/90 text-secondary-foreground font-heading text-base font-bold px-6 py-4 transition-all flex items-center justify-between group"
                >
                  View Suggestions
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/export')}
                  className="w-full bg-secondary/20 hover:bg-secondary/30 text-primary-foreground font-heading text-base font-bold px-6 py-4 border-2 border-secondary transition-all"
                >
                  Export Report
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
