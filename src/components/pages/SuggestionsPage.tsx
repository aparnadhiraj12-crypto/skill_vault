import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Sparkles, User, CheckCircle2, AlertCircle, ArrowRight, Lightbulb } from 'lucide-react';

type SuggestionType = 'ai' | 'manual';

interface Suggestion {
  id: string;
  type: SuggestionType;
  category: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  applied: boolean;
}

export default function SuggestionsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SuggestionType>('ai');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    const data = sessionStorage.getItem('uploadedCreative');
    if (!data) {
      navigate('/upload');
      return;
    }

    // Generate sample suggestions
    const aiSuggestions: Suggestion[] = [
      {
        id: '1',
        type: 'ai',
        category: 'Compliance',
        severity: 'critical',
        title: 'Add Legal Disclaimer',
        description: 'Your creative is missing required legal text. Add disclaimer at bottom with minimum 8pt font size.',
        applied: false,
      },
      {
        id: '2',
        type: 'ai',
        category: 'Design',
        severity: 'warning',
        title: 'Improve Text Contrast',
        description: 'Text contrast ratio is 3.2:1. Increase to 4.5:1 for WCAG AA compliance by darkening text or lightening background.',
        applied: false,
      },
      {
        id: '3',
        type: 'ai',
        category: 'Optimization',
        severity: 'info',
        title: 'Optimize Call-to-Action',
        description: 'CTA button could be more prominent. Consider increasing size by 20% and using higher contrast color.',
        applied: false,
      },
      {
        id: '4',
        type: 'ai',
        category: 'Brand',
        severity: 'warning',
        title: 'Logo Placement',
        description: 'Brand logo should be in top-left corner per retailer guidelines. Current placement: center.',
        applied: false,
      },
    ];

    const manualSuggestions: Suggestion[] = [
      {
        id: '5',
        type: 'manual',
        category: 'Content',
        severity: 'info',
        title: 'Simplify Messaging',
        description: 'Consider reducing text by 30%. Shorter messages perform better in retail environments.',
        applied: false,
      },
      {
        id: '6',
        type: 'manual',
        category: 'Visual',
        severity: 'info',
        title: 'Product Image Quality',
        description: 'Use higher resolution product image for better clarity on large displays.',
        applied: false,
      },
    ];

    setSuggestions([...aiSuggestions, ...manualSuggestions]);
  }, [navigate]);

  const toggleSuggestion = (id: string) => {
    setSuggestions(prev =>
      prev.map(s => s.id === id ? { ...s, applied: !s.applied } : s)
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'warning': return 'pastelpink';
      case 'info': return 'brightblue';
      default: return 'softgray';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return AlertCircle;
      case 'warning': return AlertCircle;
      case 'info': return Lightbulb;
      default: return Lightbulb;
    }
  };

  const filteredSuggestions = suggestions.filter(s => s.type === activeTab);
  const appliedCount = filteredSuggestions.filter(s => s.applied).length;

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
            className="mb-12"
          >
            <div className="mb-6">
              <span className="font-paragraph text-sm uppercase tracking-widest text-brightblue">
                Step 03
              </span>
            </div>
            <h1 className="font-heading text-6xl md:text-8xl font-black text-primary-foreground mb-4">
              Fix
              <br />
              <span className="text-limegreen">Suggestions</span>
            </h1>
            <p className="font-paragraph text-xl text-softgray max-w-3xl">
              Review AI-generated and manual feedback to optimize your creative before submission
            </p>
          </motion.div>

          {/* Tab Selector */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex items-center gap-3 px-8 py-4 font-heading text-lg font-bold transition-all ${
                activeTab === 'ai'
                  ? 'bg-limegreen text-secondary-foreground'
                  : 'bg-secondary/20 text-primary-foreground hover:bg-secondary/30'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              AI Suggestions
              <span className={`px-3 py-1 text-sm ${
                activeTab === 'ai' ? 'bg-secondary-foreground text-limegreen' : 'bg-secondary text-primary-foreground'
              }`}>
                {suggestions.filter(s => s.type === 'ai').length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex items-center gap-3 px-8 py-4 font-heading text-lg font-bold transition-all ${
                activeTab === 'manual'
                  ? 'bg-brightblue text-secondary-foreground'
                  : 'bg-secondary/20 text-primary-foreground hover:bg-secondary/30'
              }`}
            >
              <User className="w-5 h-5" />
              Manual Feedback
              <span className={`px-3 py-1 text-sm ${
                activeTab === 'manual' ? 'bg-secondary-foreground text-brightblue' : 'bg-secondary text-primary-foreground'
              }`}>
                {suggestions.filter(s => s.type === 'manual').length}
              </span>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="bg-secondary/20 p-6 mb-8">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-heading text-lg font-bold text-primary-foreground">
                Progress
              </h3>
              <span className="font-paragraph text-sm text-softgray">
                {appliedCount} of {filteredSuggestions.length} applied
              </span>
            </div>
            <div className="w-full bg-primary h-4">
              <div
                className="h-full bg-limegreen transition-all duration-500"
                style={{ width: `${filteredSuggestions.length > 0 ? (appliedCount / filteredSuggestions.length) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Suggestions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {filteredSuggestions.map((suggestion, index) => {
              const SeverityIcon = getSeverityIcon(suggestion.severity);
              
              return (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`bg-secondary/10 p-6 border-l-4 ${
                    suggestion.applied ? 'border-limegreen' : `border-${getSeverityColor(suggestion.severity)}`
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className={`bg-${getSeverityColor(suggestion.severity)} p-2`}>
                        <SeverityIcon className="w-5 h-5 text-secondary-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-paragraph text-xs uppercase tracking-wider text-${getSeverityColor(suggestion.severity)}`}>
                            {suggestion.category}
                          </span>
                          <span className="font-paragraph text-xs text-softgray">•</span>
                          <span className="font-paragraph text-xs uppercase tracking-wider text-softgray">
                            {suggestion.severity}
                          </span>
                        </div>
                        <h3 className="font-heading text-xl font-bold text-primary-foreground">
                          {suggestion.title}
                        </h3>
                      </div>
                    </div>
                    {suggestion.applied && (
                      <CheckCircle2 className="w-6 h-6 text-limegreen flex-shrink-0" />
                    )}
                  </div>

                  <p className="font-paragraph text-sm text-softgray mb-6">
                    {suggestion.description}
                  </p>

                  <button
                    onClick={() => toggleSuggestion(suggestion.id)}
                    className={`w-full px-6 py-3 font-heading text-sm font-bold transition-all ${
                      suggestion.applied
                        ? 'bg-limegreen/20 text-limegreen border-2 border-limegreen'
                        : 'bg-secondary text-primary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {suggestion.applied ? '✓ Applied' : 'Mark as Applied'}
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/simulation')}
              className="bg-secondary/20 hover:bg-secondary/30 text-primary-foreground font-heading text-lg font-bold px-10 py-5 border-2 border-secondary transition-all"
            >
              Back to Simulation
            </button>
            <button
              onClick={() => navigate('/export')}
              className="group bg-limegreen hover:bg-limegreen/90 text-secondary-foreground font-heading text-lg font-bold px-10 py-5 transition-all inline-flex items-center justify-center gap-3"
            >
              Continue to Export
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
