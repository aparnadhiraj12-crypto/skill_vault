import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Eye, Layout, Flame, AlertTriangle, ArrowRight } from 'lucide-react';

type SimulationMode = 'reviewer' | 'placement' | 'heatmap' | 'risk';

export default function SimulationPage() {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState<SimulationMode>('reviewer');
  const [creativeData, setCreativeData] = useState<any>(null);
  const [riskScore, setRiskScore] = useState(0);

  useEffect(() => {
    const data = sessionStorage.getItem('uploadedCreative');
    if (!data) {
      navigate('/upload');
      return;
    }
    setCreativeData(JSON.parse(data));
    
    // Simulate risk score calculation
    const score = Math.floor(Math.random() * 30) + 70; // 70-100
    setRiskScore(score);
  }, [navigate]);

  if (!creativeData) {
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
              Analyzing: {creativeData.fileName}
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
                  <div className="absolute inset-0 p-8">
                    <div className="bg-primary/90 p-6 max-w-md">
                      <h3 className="font-heading text-xl font-bold text-limegreen mb-4">
                        Compliance Checklist
                      </h3>
                      <div className="space-y-3">
                        {[
                          { item: 'Brand logo placement', status: 'pass' },
                          { item: 'Text readability', status: 'pass' },
                          { item: 'Color contrast', status: 'pass' },
                          { item: 'Dimension requirements', status: 'pass' },
                          { item: 'Legal disclaimers', status: 'warning' },
                        ].map((check, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="font-paragraph text-sm text-primary-foreground">
                              {check.item}
                            </span>
                            <span className={`font-paragraph text-xs font-semibold ${
                              check.status === 'pass' ? 'text-limegreen' : 'text-pastelpink'
                            }`}>
                              {check.status === 'pass' ? '✓ PASS' : '⚠ CHECK'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeMode === 'placement' && (
                  <div className="absolute inset-0 bg-gradient-to-br from-softgray to-primary-foreground p-12">
                    <div className="bg-primary p-4 max-w-sm mx-auto">
                      <p className="font-paragraph text-xs text-brightblue mb-2">RETAIL CONTEXT</p>
                      <div className="bg-limegreen h-48 flex items-center justify-center">
                        <p className="font-heading text-2xl font-bold text-secondary-foreground">
                          YOUR AD HERE
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeMode === 'heatmap' && (
                  <div className="absolute inset-0 bg-gradient-to-br from-destructive/30 via-pastelpink/30 to-limegreen/30 flex items-center justify-center">
                    <div className="text-center">
                      <Flame className="w-24 h-24 text-destructive mx-auto mb-4" />
                      <p className="font-heading text-2xl font-bold text-primary-foreground">
                        Attention Analysis
                      </p>
                      <p className="font-paragraph text-sm text-softgray mt-2">
                        Hotspots indicate high viewer focus
                      </p>
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
                      <p className="font-paragraph text-sm text-softgray">
                        Confidence Score
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
                      <span className="font-paragraph text-sm font-semibold text-limegreen">94%</span>
                    </div>
                    <div className="w-full bg-secondary/20 h-2">
                      <div className="h-full bg-limegreen" style={{ width: '94%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-paragraph text-sm text-softgray">Attention</span>
                      <span className="font-paragraph text-sm font-semibold text-brightblue">87%</span>
                    </div>
                    <div className="w-full bg-secondary/20 h-2">
                      <div className="h-full bg-brightblue" style={{ width: '87%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-paragraph text-sm text-softgray">Readability</span>
                      <span className="font-paragraph text-sm font-semibold text-pastelpink">78%</span>
                    </div>
                    <div className="w-full bg-secondary/20 h-2">
                      <div className="h-full bg-pastelpink" style={{ width: '78%' }} />
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
