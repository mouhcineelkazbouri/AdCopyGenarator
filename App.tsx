

import React, { useState } from 'react';
import Input from './components/Input';
import Select from './components/Select';
import Button from './components/Button';
import AdCopyResult from './components/AdCopyResult';
import { generateAdCopy, analyzeWebsite } from './services/geminiService';
import { AdCopy, ToneOfVoice, Language, WebsiteAnalysis } from './types';
import { TONES_OF_VOICE, LANGUAGES, HEADLINE_MAX_LENGTH, DESCRIPTION_MAX_LENGTH } from './constants';

const App: React.FC = () => {
  const [productName, setProductName] = useState<string>('');
  const [targetAudience, setTargetAudience] = useState<string>('');
  const [keywords, setKeywords] = useState<string>('');
  const [tone, setTone] = useState<ToneOfVoice>(ToneOfVoice.Friendly);
  const [language, setLanguage] = useState<Language>(Language.English);
  const [adCopy, setAdCopy] = useState<AdCopy | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [competitorUrl, setCompetitorUrl] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);


  const handleAnalyzeClick = async () => {
    setAnalysisError(null);
    setIsAnalyzing(true);
    try {
      let url = competitorUrl;
      if (!url.trim().startsWith('http://') && !url.trim().startsWith('https://')) {
          url = `https://${url.trim()}`;
      }
      const analysisResult: WebsiteAnalysis = await analyzeWebsite(url);
      setProductName(analysisResult.productName);
      setTargetAudience(analysisResult.targetAudience);
      setKeywords(analysisResult.keywords);
    } catch (err: any) {
      setAnalysisError(err.message || 'An unexpected error occurred during analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };


  const handleGenerateClick = async () => {
    setError(null);
    setAdCopy(null);
    setIsLoading(true);

    try {
      const result = await generateAdCopy(productName, targetAudience, keywords, tone, language);
      setAdCopy(result);
    } catch (err: any)
     {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormIncomplete = !productName || !targetAudience;

  const LoadingSkeleton: React.FC = () => (
    <div className="bg-white rounded-xl shadow-lg p-8 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-3/4 mb-6"></div>
        <div className="space-y-4">
            <div>
                <div className="h-6 bg-slate-200 rounded w-1/3 mb-3"></div>
                <div className="space-y-2">
                    <div className="h-16 bg-slate-100 rounded"></div>
                    <div className="h-16 bg-slate-100 rounded"></div>
                    <div className="h-16 bg-slate-100 rounded"></div>
                </div>
            </div>
            <div className="pt-2">
                <div className="h-6 bg-slate-200 rounded w-1/3 mb-3"></div>
                <div className="space-y-2">
                    <div className="h-16 bg-slate-100 rounded"></div>
                    <div className="h-16 bg-slate-100 rounded"></div>
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex items-start md:items-center justify-center p-4 py-8 md:p-8">
      <main className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 md:gap-8">
        {/* Input Column */}
        <div className="bg-white rounded-xl shadow-lg p-8 h-fit">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              AdCopy<span className="text-blue-600">Generator</span>.com
            </h1>
            <p className="text-gray-500 mt-2">
              Create high-performing Google Ads copy in seconds.
            </p>
          </div>

          <div className="space-y-6">
            <Input
              label="Product or Service Name"
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g., Artisan Coffee Beans"
            />
            <Input
              label="Target Audience"
              id="targetAudience"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g., Young professionals, coffee enthusiasts"
            />
            
            <div className="space-y-3 p-4 border border-blue-200 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <h3 className="text-md font-semibold text-gray-800">
                    AI Website Analysis
                  </h3>
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-grow">
                    <Input
                      label="Competitor Website URL (Optional)"
                      id="competitorUrl"
                      value={competitorUrl}
                      onChange={(e) => setCompetitorUrl(e.target.value)}
                      placeholder="e.g., www.competitor.com"
                    />
                  </div>
                  <Button
                    onClick={handleAnalyzeClick}
                    isLoading={isAnalyzing}
                    disabled={!competitorUrl.trim() || isAnalyzing}
                    className="px-4 py-2 text-sm font-semibold"
                  >
                    {isAnalyzing ? '...' : 'Analyze'}
                  </Button>
                </div>
                {analysisError && (
                  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 rounded" role="alert">
                    <p className="text-sm">{analysisError}</p>
                  </div>
                )}
            </div>

            <Input
              label="Keywords"
              id="keywords"
              value={keywords}
// Fix: Corrected typo 'targe' to 'target' and added missing 'placeholder' prop.
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g., specialty coffee, single-origin"
            />

            <Select
              label="Tone of Voice"
              id="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value as ToneOfVoice)}
              options={TONES_OF_VOICE}
            />

            <Select
              label="Language"
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              options={LANGUAGES}
            />

            <Button
              onClick={handleGenerateClick}
              isLoading={isLoading}
              disabled={isFormIncomplete || isLoading}
              className="w-full"
            >
              Generate Ad Copy
            </Button>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Output Column */}
        <div className="mt-8 md:mt-0">
          {isLoading ? (
            <LoadingSkeleton />
          ) : adCopy ? (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Generated Ad Copy
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Headlines</h3>
                  <div className="space-y-2">
                    {adCopy.headlines.map((headline, index) => (
                      <AdCopyResult
                        key={`headline-${index}`}
                        text={headline}
                        maxLength={HEADLINE_MAX_LENGTH}
                        label={`Headline ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Descriptions</h3>
                  <div className="space-y-2">
                    {adCopy.descriptions.map((desc, index) => (
                      <AdCopyResult
                        key={`description-${index}`}
                        text={desc}
                        maxLength={DESCRIPTION_MAX_LENGTH}
                        label={`Description ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center text-center h-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h2 className="mt-4 text-xl font-semibold text-gray-700">Your ad copy will appear here</h2>
              <p className="mt-1 text-gray-500">
                Fill out the form on the left to get started.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Fix: Add default export to make the component available for import.
export default App;
