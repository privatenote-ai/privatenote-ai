import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  getAiCapabilities, 
  enhanceNoteHybrid,
  type AiEnhanceResponse 
} from '@/utils/aiEnhancement';
import { 
  initializeClientLLM, 
  isEngineLoaded,
  clearEngine,
  getModelInfo,
  getAvailableModels,
  getPreferredModels,
  isModelCached,
  listCachedModels,
  getStorageInfo,
  getRecommendedModelForDevice,
  getDeviceInfo
} from '@/utils/clientLLM';
import { useToast } from '@/hooks/use-toast';
import { Zap, CheckCircle, XCircle, Loader2, RefreshCw, Trash2 } from 'lucide-react';

export default function TestClientLLM() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<{ progress: number; text: string } | null>(null);
  const [capabilities, setCapabilities] = useState(getAiCapabilities());
  const [lastResult, setLastResult] = useState<AiEnhanceResponse | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [storageInfo, setStorageInfo] = useState<{
    quota: number;
    usage: number;
    available: number;
    databases: string[];
    webllmDatabases: string[];
  } | null>(null);
  const [cachedModels, setCachedModels] = useState<string[]>([]);
  const { toast } = useToast();

  const preferredModels = getPreferredModels();
  const availableModels = getAvailableModels();
  
  // Filter preferred models to only show ones that are actually available
  const availablePreferredModels = preferredModels.filter(model => 
    availableModels.includes(model)
  );
  
  // Get device-recommended model
  const deviceRecommendedModel = getRecommendedModelForDevice();
  const deviceInfo = getDeviceInfo();
  
  // If selected model is not available, try to find a match or use device-recommended model
  const [validatedSelectedModel, setValidatedSelectedModel] = useState<string>(() => {
    const saved = localStorage.getItem('webllm_selected_model');
    const available = getAvailableModels();
    const preferred = getPreferredModels();
    const availablePreferred = preferred.filter(m => available.includes(m));
    
    if (saved && available.includes(saved)) {
      return saved;
    }
    // Try to find a match for saved model
    if (saved) {
      const lowerSaved = saved.toLowerCase();
      const match = available.find(id => id.toLowerCase() === lowerSaved);
      if (match) return match;
      // Try partial match
      const savedParts = lowerSaved.split(/[-_\/]/).filter(p => p.length > 2);
      const partialMatch = available.find(id => {
        const idLower = id.toLowerCase();
        return savedParts.every(part => idLower.includes(part));
      });
      if (partialMatch) return partialMatch;
    }
    // Use device-recommended model if available, otherwise first available preferred model
    if (available.includes(deviceRecommendedModel)) {
      return deviceRecommendedModel;
    }
    return availablePreferred[0] || available[0] || preferred[0];
  });
  
  // Use validatedSelectedModel as selectedModel
  const selectedModel = validatedSelectedModel;
  
  const modelSizes: Record<string, number> = {
    'mlc-ai/gemma-3-1b-it-q4f32_1-MLC': 600,
    'llinguini/gemma-3-270m-it-q4f16_1-MLC': 200,
  };

  const getModelDisplayName = (modelId: string): string => {
    if (modelId.includes('gemma') && modelId.includes('1b')) return 'Gemma 3 1B (~600MB) - Desktop/New Mobile';
    if (modelId.includes('gemma') || modelId.includes('linguini')) return 'Gemma 3 270M (~200MB) - Mobile/Old Browser';
    return modelId;
  };

  const updateCapabilities = async () => {
    setCapabilities(getAiCapabilities());
    // Also update storage info
    try {
      const info = await getStorageInfo();
      setStorageInfo(info);
      const cached = await listCachedModels();
      setCachedModels(cached);
    } catch (error) {
      console.warn('Failed to update storage info:', error);
    }
  };

  // Load storage info on mount
  useEffect(() => {
    void updateCapabilities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInitialize = async () => {
    setIsInitializing(true);
    setProgress({ progress: 0, text: 'Initializing...' });
    try {
      // Clear existing engine if switching models
      if (isEngineLoaded()) {
        clearEngine();
      }
      
      await initializeClientLLM((prog) => {
        setProgress(prog);
      }, selectedModel);
      
      // Save selected model to localStorage
      localStorage.setItem('webllm_selected_model', selectedModel);
      
      updateCapabilities();
      toast({
        title: 'Success',
        description: `Client-side LLM initialized with ${getModelDisplayName(selectedModel)}!`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to initialize',
        variant: 'destructive',
      });
    } finally {
      setIsInitializing(false);
      setProgress(null);
    }
  };

  const handleTest = async (type: 'improve' | 'summarize' | 'secure' | 'ask') => {
    if (!inputText.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter some text to test',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    setProgress({ progress: 0, text: 'Processing...' });
    setOutputText('');
    setLastResult(null);

    try {
      const result = await enhanceNoteHybrid(
        inputText,
        type,
        {
          preferClientSide: true,
          onProgress: (prog) => {
            setProgress(prog);
          },
        }
      );

      setOutputText(result.content);
      setLastResult(result);
      
      toast({
        title: 'Success',
        description: `Processed using ${result.source === 'client' ? 'client-side' : 'server-side'} AI`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to process',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
  };

  const handleClearCache = async () => {
    try {
      // Clear IndexedDB cache
      const databases = await indexedDB.databases();
      for (const db of databases) {
        if (db.name && db.name.includes('webllm')) {
          indexedDB.deleteDatabase(db.name);
        }
      }
      
      clearEngine();
      updateCapabilities();
      
      toast({
        title: 'Success',
        description: 'Model cache cleared. Next load will download fresh model.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to clear cache',
        variant: 'destructive',
      });
    }
  };

  const sampleTexts = {
    improve: 'This is a test note that needs improvement. It has some grammar issues and could be more clear.',
    summarize: `PrivateNote.ai is a secure note-sharing platform that uses end-to-end encryption. 
Your notes are encrypted client-side before being sent to our servers. We use AES-256-GCM encryption 
with PBKDF2 key derivation. Notes can be set to expire after a certain time or number of reads. 
The platform is designed with privacy and security as top priorities.`,
    secure: 'Contact John Smith at john.smith@example.com or call him at 555-123-4567. His address is 123 Main St, Anytown, USA 12345. Credit card: 4532-1234-5678-9010.',
    ask: 'What is end-to-end encryption and how does it protect my data?',
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Client-Side LLM Test Page</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Test the private/client-side LLM functionality
        </p>
      </div>

      {/* Capabilities Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>System Capabilities</CardTitle>
          <CardDescription>Current status of client-side LLM support</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>WebLLM Supported:</span>
            {capabilities.clientSideSupported ? (
              <Badge variant="default" className="bg-green-500">
                <CheckCircle className="w-4 h-4 mr-1" />
                Yes
              </Badge>
            ) : (
              <Badge variant="destructive">
                <XCircle className="w-4 h-4 mr-1" />
                No
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <span>Engine Loaded:</span>
            {capabilities.clientSideLoaded ? (
              <Badge variant="default" className="bg-green-500">
                <CheckCircle className="w-4 h-4 mr-1" />
                Yes
              </Badge>
            ) : (
              <Badge variant="secondary">
                <XCircle className="w-4 h-4 mr-1" />
                No
              </Badge>
            )}
          </div>

          {capabilities.modelInfo && (
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center justify-between">
                <span>Model:</span>
                <span className="font-mono text-sm">{capabilities.modelInfo.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Size:</span>
                <span>{capabilities.modelInfo.sizeMB} MB</span>
              </div>
            </div>
          )}
          
          {/* Storage Information */}
          {storageInfo && (
            <div className="space-y-2 pt-4 border-t">
              <div className="text-sm font-medium mb-2">Storage Information</div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Total Quota:</span>
                  <span className="font-mono">{(storageInfo.quota / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <div className="flex justify-between">
                  <span>Used:</span>
                  <span className="font-mono">{(storageInfo.usage / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <div className="flex justify-between">
                  <span>Available:</span>
                  <span className="font-mono">{(storageInfo.available / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <div className="flex justify-between">
                  <span>Cached Models:</span>
                  <span className="font-mono">{cachedModels.length}</span>
                </div>
              </div>
              {cachedModels.length > 0 && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs text-gray-600 dark:text-gray-400">
                    Show Cached Databases ({cachedModels.length})
                  </summary>
                  <div className="mt-1 max-h-32 overflow-y-auto">
                    <pre className="text-xs font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                      {cachedModels.join('\n')}
                    </pre>
                  </div>
                </details>
              )}
              {cachedModels.length === 0 && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  No models cached yet. Initialize the engine to download a model.
                </div>
              )}
            </div>
          )}

          {/* Device Information */}
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm font-medium mb-2">Device Detection</div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Device Type:</span>
                <span className="font-mono">{deviceInfo.isMobile ? 'Mobile' : 'Desktop'}</span>
              </div>
              <div className="flex justify-between">
                <span>WebGPU Support:</span>
                <span className="font-mono">{deviceInfo.hasWebGPU ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span>Recommended Model:</span>
                <span className="font-mono text-blue-600 dark:text-blue-400">
                  {getModelDisplayName(deviceRecommendedModel)}
                </span>
              </div>
            </div>
          </div>

          {/* Model Selection */}
          <div className="mt-4 pt-4 border-t">
            <Label htmlFor="model-select" className="text-sm font-medium mb-2 block">
              Select Model
            </Label>
            <Select
              value={selectedModel}
              onValueChange={(value) => {
                setValidatedSelectedModel(value);
                localStorage.setItem('webllm_selected_model', value);
                // Clear engine if switching models (only if different model)
                if (isEngineLoaded() && capabilities.modelInfo?.name !== value) {
                  clearEngine();
                  updateCapabilities();
                  toast({
                    title: 'Model Changed',
                    description: 'Engine cleared. Click "Initialize Engine" to load the new model.',
                  });
                }
              }}
              disabled={isInitializing}
            >
              <SelectTrigger id="model-select" className="w-full">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent className="max-h-[320px] overflow-y-auto">
                {availablePreferredModels.length > 0 ? (
                  <>
                    <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
                      Available Preferred Models
                    </div>
                    {availablePreferredModels.map((model) => (
                      <SelectItem key={model} value={model}>
                        {getModelDisplayName(model)} ✓
                      </SelectItem>
                    ))}
                    {availablePreferredModels.length < preferredModels.length && (
                      <>
                        <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 mt-2">
                          Other Available Models
                        </div>
                        {availableModels
                          .filter(m => !preferredModels.includes(m))
                          .map((model) => (
                            <SelectItem key={model} value={model}>
                              {model}
                            </SelectItem>
                          ))}
                      </>
                    )}
                  </>
                ) : (
                  availableModels.slice(0, 20).map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {capabilities.clientSideLoaded 
                ? `Currently loaded: ${getModelDisplayName(capabilities.modelInfo?.name || '')}`
                : `Select a model and click "Initialize Engine" to download. ${availableModels.length} models available.`}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              ✓ All WebLLM models available ({availableModels.length} total). Gemma models use self-hosted R2.
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleInitialize} 
              disabled={isInitializing || capabilities.clientSideLoaded}
              variant="default"
            >
              {isInitializing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Initializing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Initialize Engine
                </>
              )}
            </Button>
            
            <Button 
              onClick={updateCapabilities}
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Status
            </Button>

            <Button 
              onClick={handleClearCache}
              variant="outline"
              disabled={!capabilities.clientSideLoaded}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Cache
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Input/Output Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test AI Features</CardTitle>
          <CardDescription>Try different AI enhancement types</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Input Text</label>
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to test..."
              rows={6}
              className="font-mono text-sm"
            />
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setInputText(sampleTexts.improve)}
              >
                Load Sample (Improve)
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setInputText(sampleTexts.summarize)}
              >
                Load Sample (Summarize)
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setInputText(sampleTexts.secure)}
              >
                Load Sample (Privacy)
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setInputText(sampleTexts.ask)}
              >
                Load Sample (Ask)
              </Button>
            </div>
          </div>

          {progress && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{progress.text}</span>
                <span>{progress.progress}%</span>
              </div>
              <Progress value={progress.progress} />
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={() => handleTest('improve')}
              disabled={isProcessing || !inputText.trim()}
              variant="default"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Improve
                </>
              )}
            </Button>
            
            <Button
              onClick={() => handleTest('summarize')}
              disabled={isProcessing || !inputText.trim()}
              variant="default"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Summarize
                </>
              )}
            </Button>
            
            <Button
              onClick={() => handleTest('secure')}
              disabled={isProcessing || !inputText.trim()}
              variant="default"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Privacy Check
                </>
              )}
            </Button>
            
            <Button
              onClick={() => handleTest('ask')}
              disabled={isProcessing || !inputText.trim()}
              variant="default"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Ask AI
                </>
              )}
            </Button>
          </div>

          {outputText && (
            <div>
              <label className="text-sm font-medium mb-2 block">Output</label>
              <Textarea
                value={outputText}
                readOnly
                rows={6}
                className="font-mono text-sm bg-gray-50 dark:bg-gray-900"
              />
              {lastResult && (
                <div className="mt-2">
                  <Badge variant={lastResult.source === 'client' ? 'default' : 'secondary'}>
                    Source: {lastResult.source === 'client' ? 'Client-Side' : 'Server-Side'}
                  </Badge>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions Card */}
      <Card>
        <CardHeader>
          <CardTitle>Testing Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <ol className="list-decimal list-inside space-y-1">
            <li>Check "System Capabilities" to verify WebLLM support</li>
            <li>Click "Initialize Engine" to load the model (first time downloads ~300MB)</li>
            <li>Enter text or use sample text buttons</li>
            <li>Click "Improve", "Summarize", or "Privacy Check" to test</li>
            <li>Check browser console for detailed logs</li>
            <li>Check Network tab - no requests should appear for client-side processing</li>
            <li>Check IndexedDB in DevTools to see cached model</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
