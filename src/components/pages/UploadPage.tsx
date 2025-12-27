import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, FileImage, CheckCircle2, ArrowRight } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { AdPlacements, Retailers } from '@/entities';
import { Image } from '@/components/ui/image';

export default function UploadPage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedRetailer, setSelectedRetailer] = useState('');
  const [selectedPlacement, setSelectedPlacement] = useState('');
  const [retailers, setRetailers] = useState<Retailers[]>([]);
  const [placements, setPlacements] = useState<AdPlacements[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Load retailers and placements on mount
  useState(() => {
    const loadData = async () => {
      const { items: retailerItems } = await BaseCrudService.getAll<Retailers>('retailers');
      const { items: placementItems } = await BaseCrudService.getAll<AdPlacements>('adplacements');
      setRetailers(retailerItems.filter(r => r.isActive));
      setPlacements(placementItems.filter(p => p.isActive));
    };
    loadData();
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !selectedRetailer || !selectedPlacement) {
      return;
    }

    setIsLoading(true);
    
    // Simulate upload processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Store selection in sessionStorage for simulation page
    sessionStorage.setItem('uploadedCreative', JSON.stringify({
      fileName: selectedFile.name,
      retailerId: selectedRetailer,
      placementId: selectedPlacement,
      previewUrl: previewUrl,
    }));

    setIsLoading(false);
    navigate('/simulation');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
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
            className="text-center mb-16"
          >
            <div className="mb-6">
              <span className="font-paragraph text-sm uppercase tracking-widest text-brightblue">
                Step 01
              </span>
            </div>
            <h1 className="font-heading text-6xl md:text-8xl font-black text-primary-foreground mb-6">
              Upload Your
              <br />
              <span className="text-limegreen">Creative</span>
            </h1>
            <p className="font-paragraph text-xl text-softgray max-w-3xl mx-auto">
              Select your ad creative file and choose the retailer and placement context for validation
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Upload Section */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="font-heading text-3xl font-bold text-primary-foreground mb-6">
                  Creative File
                </h2>
                
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="border-4 border-dashed border-secondary/40 hover:border-limegreen transition-colors p-12 text-center cursor-pointer bg-primary/50"
                >
                  <input
                    type="file"
                    id="file-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    {selectedFile ? (
                      <div className="space-y-4">
                        <CheckCircle2 className="w-16 h-16 text-limegreen mx-auto" />
                        <div>
                          <p className="font-heading text-xl font-semibold text-primary-foreground mb-2">
                            {selectedFile.name}
                          </p>
                          <p className="font-paragraph text-sm text-softgray">
                            Click or drag to replace
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="w-16 h-16 text-brightblue mx-auto" />
                        <div>
                          <p className="font-heading text-xl font-semibold text-primary-foreground mb-2">
                            Drop your creative here
                          </p>
                          <p className="font-paragraph text-sm text-softgray">
                            or click to browse files
                          </p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>

                {previewUrl && (
                  <div className="mt-6 bg-softgray p-4">
                    <p className="font-paragraph text-xs uppercase tracking-wider text-secondary-foreground mb-3">
                      Preview
                    </p>
                    <Image src={previewUrl} alt="Creative preview" className="w-full h-auto" />
                  </div>
                )}
              </motion.div>

              {/* Context Selection */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="font-heading text-3xl font-bold text-primary-foreground mb-6">
                    Context Selection
                  </h2>
                  
                  {/* Retailer Selection */}
                  <div className="mb-8">
                    <label className="font-heading text-lg font-semibold text-primary-foreground mb-4 block">
                      Select Retailer
                    </label>
                    <select
                      value={selectedRetailer}
                      onChange={(e) => setSelectedRetailer(e.target.value)}
                      className="w-full bg-secondary text-primary-foreground font-paragraph text-base px-6 py-4 border-2 border-secondary focus:border-limegreen outline-none transition-colors"
                      required
                    >
                      <option value="">Choose a retailer...</option>
                      {retailers.map((retailer) => (
                        <option key={retailer._id} value={retailer._id}>
                          {retailer.retailerName} - {retailer.industryCategory}
                        </option>
                      ))}
                    </select>
                    {selectedRetailer && (
                      <p className="font-paragraph text-sm text-softgray mt-3">
                        {retailers.find(r => r._id === selectedRetailer)?.description}
                      </p>
                    )}
                  </div>

                  {/* Placement Selection */}
                  <div>
                    <label className="font-heading text-lg font-semibold text-primary-foreground mb-4 block">
                      Select Placement
                    </label>
                    <select
                      value={selectedPlacement}
                      onChange={(e) => setSelectedPlacement(e.target.value)}
                      className="w-full bg-secondary text-primary-foreground font-paragraph text-base px-6 py-4 border-2 border-secondary focus:border-limegreen outline-none transition-colors"
                      required
                    >
                      <option value="">Choose a placement...</option>
                      {placements.map((placement) => (
                        <option key={placement._id} value={placement._id}>
                          {placement.placementName} - {placement.placementType}
                        </option>
                      ))}
                    </select>
                    {selectedPlacement && (
                      <div className="mt-3">
                        <p className="font-paragraph text-sm text-softgray mb-2">
                          {placements.find(p => p._id === selectedPlacement)?.description}
                        </p>
                        <p className="font-paragraph text-xs text-brightblue">
                          Dimensions: {placements.find(p => p._id === selectedPlacement)?.creativeDimensions}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!selectedFile || !selectedRetailer || !selectedPlacement || isLoading}
                  className="w-full bg-limegreen hover:bg-limegreen/90 disabled:bg-softgray disabled:cursor-not-allowed text-secondary-foreground font-heading text-xl font-bold px-8 py-5 transition-all flex items-center justify-center gap-3 group"
                >
                  {isLoading ? (
                    'Processing...'
                  ) : (
                    <>
                      Start Simulation
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <div className="bg-secondary/20 p-6 border-l-4 border-brightblue">
                  <h3 className="font-heading text-lg font-semibold text-primary-foreground mb-3">
                    What happens next?
                  </h3>
                  <ul className="space-y-2">
                    <li className="font-paragraph text-sm text-softgray flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-limegreen mt-0.5 flex-shrink-0" />
                      Your creative will be analyzed across multiple simulation modes
                    </li>
                    <li className="font-paragraph text-sm text-softgray flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-limegreen mt-0.5 flex-shrink-0" />
                      AI will generate compliance and optimization suggestions
                    </li>
                    <li className="font-paragraph text-sm text-softgray flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-limegreen mt-0.5 flex-shrink-0" />
                      You'll receive a detailed validation report
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
